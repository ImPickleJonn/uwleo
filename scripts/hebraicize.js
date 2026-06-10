// hebraicize.js — apply scripts/hebrew_terms.json substitutions to every
// body_he in extracted/articles_v2.json, producing extracted/articles_v2_he.json
// (the all-Hebrew bodies). The rebuild script picks up the Hebraicized version.
//
// Substitution rules:
//   1. Apply longest keys first to avoid partial matches.
//   2. Each match is wrapped in word boundaries that work for Latin scripts
//      (so "AI" inside "MAIL" wouldn't fire — but Hebrew text generally won't
//      contain Latin substrings of words anyway).
//   3. Case-sensitive (so "Genesis" → "ספר בראשית" but "Genesis 5:1" still has
//      the verse reference handled separately by the longer keys we provided).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DICT = JSON.parse(fs.readFileSync(path.join(__dirname, 'hebrew_terms.json'), 'utf8'));
const V2   = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'articles_v2.json'), 'utf8'));

// Strip metadata keys (the underscore-prefixed ones)
const entries = Object.entries(DICT).filter(([k]) => !k.startsWith('_'));

// Sort longest first so "Donald Trump" is replaced before "Trump"
entries.sort((a, b) => b[0].length - a[0].length);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isLatinBoundary(ch) {
  return !ch || !/[A-Za-zÀ-ÿ]/.test(ch);
}

// Normalize fancy/curly Unicode quotes to ASCII so dictionary lookups match.
function normalizeQuotes(s) {
  return s
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"');
}

// The source Word docs sometimes have Latin and Hebrew runs glued together
// without a separating space (e.g. "consciousnessלפי"). Insert a space at
// every Latin↔Hebrew boundary so dict lookups can find clean tokens.
function splitLatinHebrew(s) {
  s = s.replace(/([A-Za-zÀ-ÿ])([֐-׿])/g, '$1 $2');
  s = s.replace(/([֐-׿])([A-Za-zÀ-ÿ])/g, '$1 $2');
  return s;
}

// After substitution, fix dangling Hebrew-definite-article prefixes like
// "ה- המודל" (which appears because the source was "ה- Heliocentric Model"
// → "ה- " + Hebrew). The "ה-" prefix is now redundant in front of a Hebrew
// word that already carries the definite ה.
function cleanupArtifacts(s) {
  // ONLY operate on the literal "ה-" prefix pattern (Hebrew definite article
  // with hyphen, which is how author marked prefixes on foreign words).
  //
  // Pattern A: "ה- ה..." → drop the redundant ה- (the Hebrew word already
  // carries its own ה).
  s = s.replace(/ה-\s+ה([֐-׿])/g, 'ה$1');
  // Pattern B: "ה- " followed by Hebrew NOT starting with ה — attach the
  // prefix (e.g. "ה- אסלאם" → "האסלאם").
  s = s.replace(/ה-\s+([֐-׿])/g, 'ה$1');
  // Same patterns for ב-, ל-, מ-, ש-, ו- prefixes
  s = s.replace(/([בלמשוכה])-\s+ה([֐-׿])/g, '$1ה$2');
  s = s.replace(/([בלמשוכ])-\s+([֐-׿])/g, '$1$2');
  // Collapse any double-spaces created along the way
  s = s.replace(/ {2,}/g, ' ');
  return s;
}

function applyDict(text) {
  if (!text) return text;
  let t = text;
  for (const [pattern, replacement] of entries) {
    // Use a manual scan so we can enforce Latin-letter boundaries
    let idx = 0;
    let out = '';
    const lower = pattern;
    while (true) {
      const found = t.indexOf(lower, idx);
      if (found === -1) {
        out += t.slice(idx);
        break;
      }
      const before = t.charAt(found - 1);
      const after  = t.charAt(found + lower.length);
      const okBefore = isLatinBoundary(before);
      const okAfter  = isLatinBoundary(after);
      if (okBefore && okAfter) {
        out += t.slice(idx, found) + replacement;
        idx = found + lower.length;
      } else {
        out += t.slice(idx, found + 1);
        idx = found + 1;
      }
    }
    t = out;
  }
  return t;
}

// Build the Hebraicized corpus
const out = {};
let touched = 0;
let remainingLatinAfter = new Map();

for (const k of Object.keys(V2)) {
  const a = V2[k];
  if (!a || !a.body_he) { out[k] = a; continue; }
  const before = splitLatinHebrew(normalizeQuotes(a.body_he));
  const dictApplied = applyDict(before);
  const after = cleanupArtifacts(dictApplied);
  if (after !== a.body_he) touched++;

  // Diagnostic: which Latin tokens remain after substitution?
  const remaining = after.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ.''-]{1,}/g) || [];
  for (const tok of remaining) {
    remainingLatinAfter.set(tok, (remainingLatinAfter.get(tok) || 0) + 1);
  }

  out[k] = { ...a, body_he: after };
}

fs.writeFileSync(
  path.join(ROOT, 'extracted', 'articles_v2_he.json'),
  JSON.stringify(out, null, 2),
  'utf8'
);

console.log(`✅ Hebraicized ${touched}/${Object.keys(V2).length} articles`);
console.log(`   Dictionary entries: ${entries.length}`);
console.log(`   Latin tokens still remaining: ${remainingLatinAfter.size} unique`);
const top = [...remainingLatinAfter.entries()]
  .filter(([t]) => t.length >= 3)        // ignore very short tokens
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40);
if (top.length) {
  console.log('\n   Top remaining Latin tokens (consider adding to dictionary):');
  top.forEach(([t, c]) => console.log(`     ${String(c).padStart(3)} ${t}`));
}
