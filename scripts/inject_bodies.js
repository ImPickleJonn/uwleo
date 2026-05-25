// inject_bodies.js — reads extracted/articles_he.json + optional translations_en.json
// and writes data/articles.js with body_he / body_en filled in.
//
// Translation file format (extracted/translations_en.json):
//   { "1": "Could the world move backwards? ...", "2": "...", ... }

const fs = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const HE_PATH   = path.join(ROOT, 'extracted', 'articles_he.json');
const EN_PATH   = path.join(ROOT, 'extracted', 'translations_en.json');
const JS_PATH   = path.join(ROOT, 'data', 'articles.js');

function cleanBody(raw, titleHints = []) {
  if (!raw) return '';
  let t = raw;

  // Strip "U. W. Leo" / "UW Leo" signature near the end
  t = t.replace(/\n*\s*U\.?\s*W\.?\s*Leo\.?\s*\n*/gi, '\n');
  t = t.replace(/\n*\s*UW\s*Leo\.?\s*\n*/gi, '\n');

  // Strip "-- N of N --" / "Page N of N" page markers
  t = t.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');
  t = t.replace(/Page\s+\d+\s+of\s+\d+/gi, '');

  // Tokenize into paragraph blocks (split on blank lines).
  // For each leading block, strip if it matches a header pattern OR a title hint.
  const normalizeForCompare = s => s.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
  const titleSet = new Set(titleHints.map(normalizeForCompare).filter(Boolean));

  let blocks = t.split(/\n{2,}/).map(b => b.trim()).filter(b => b.length > 0);
  while (blocks.length > 0) {
    const first = blocks[0];
    const oneLine = first.split('\n')[0].trim();
    // Header patterns
    if (/^(מייל|מאמרון)\s*(מס[׳']?)?\s*\d+/.test(oneLine)) { blocks.shift(); continue; }
    if (/^\d{1,2}\.\d{1,2}\.\d{2,4}\s*$/.test(oneLine)) { blocks.shift(); continue; }
    if (/^\(?תיקון\)?/.test(oneLine) && oneLine.length < 20) { blocks.shift(); continue; }
    // Title-line strip: ONLY if this whole block is a single short line matching a title hint
    if (first.split('\n').length === 1 && first.length < 80) {
      const norm = normalizeForCompare(first);
      if (titleSet.has(norm)) { blocks.shift(); continue; }
      // Or a fuzzy startsWith match (PDF may have slight punctuation differences)
      let matched = false;
      for (const hint of titleSet) {
        if (hint.length > 6 && (norm.startsWith(hint) || hint.startsWith(norm))) { matched = true; break; }
      }
      if (matched) { blocks.shift(); continue; }
    }
    break;
  }

  // Within each remaining block, single newlines are forced wraps from PDF — join them.
  // Hebrew sentences don't break across lines in the source, so this is safe.
  blocks = blocks.map(b => b.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim());

  // Fix common Hebrew RTL punctuation artifacts from pdftotext:
  //   "word ?" -> "word?"      "word ,word" -> "word, word"     "word ."  -> "word."
  blocks = blocks.map(b => b
    .replace(/\s+([.,!?:;])/g, '$1')
    .replace(/([.,!?:;])(?=\S)/g, '$1 ')
    // Insert space at Latin↔Hebrew boundaries (bidi joins)
    .replace(/([A-Za-z])([֐-׿])/g, '$1 $2')
    .replace(/([֐-׿])([A-Za-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  );

  return blocks.join('\n\n').trim();
}

function escapeForJSLiteral(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function extractTitlesFromJS(jsSrc) {
  // Parse out { num: N, title_he: "...", title_en: "...", ... } per article line.
  const titlesByNum = {};
  const re = /\{\s*num:\s*(\d+)\s*,\s*title_he:\s*"((?:\\"|[^"])*)"\s*,\s*title_en:\s*"((?:\\"|[^"])*)"/g;
  let m;
  while ((m = re.exec(jsSrc)) !== null) {
    titlesByNum[Number(m[1])] = { title_he: m[2], title_en: m[3] };
  }
  return titlesByNum;
}

function main() {
  const heMap = JSON.parse(fs.readFileSync(HE_PATH, 'utf8'));
  const enMap = fs.existsSync(EN_PATH) ? JSON.parse(fs.readFileSync(EN_PATH, 'utf8')) : {};

  let jsSrc = fs.readFileSync(JS_PATH, 'utf8');
  const titles = extractTitlesFromJS(jsSrc);
  let updated = 0;
  let missing = [];

  // Process each article in the heMap
  for (const numStr of Object.keys(heMap)) {
    const num = Number(numStr);
    const entry = heMap[numStr];
    if (!entry || !entry.text_he) continue;
    const titleHints = [titles[num]?.title_he, titles[num]?.title_en].filter(Boolean);
    const body_he = cleanBody(entry.text_he, titleHints);
    const body_en = enMap[numStr] ? cleanBody(enMap[numStr], titleHints) : null;

    // Match the line for { num: N, title_he: ..., body_he: <current> }
    // Replace body_he: null  or  body_he: `...`  with new value
    const numPattern = new RegExp(
      '(\\{[^}]*?\\bnum:\\s*' + num + '\\b[^}]*?body_he:\\s*)(null|`(?:\\\\`|[^`])*`)([^}]*?\\})',
      's'
    );
    const heLiteral = '`' + escapeForJSLiteral(body_he) + '`';

    let m = jsSrc.match(numPattern);
    if (!m) {
      missing.push(num);
      continue;
    }
    jsSrc = jsSrc.replace(numPattern, m[1] + heLiteral + m[3]);

    // body_en: if present in entry, also need to inject (currently entries don't have body_en field)
    if (body_en !== null) {
      const enPattern = new RegExp(
        '(\\{[^}]*?\\bnum:\\s*' + num + '\\b[^}]*?body_he:\\s*`(?:\\\\`|[^`])*`)([^}]*?\\})',
        's'
      );
      const enMatch = jsSrc.match(enPattern);
      if (enMatch) {
        const enLiteral = ', body_en: `' + escapeForJSLiteral(body_en) + '`';
        jsSrc = jsSrc.replace(enPattern, enMatch[1] + enLiteral + enMatch[2]);
      }
    }
    updated++;
  }

  fs.writeFileSync(JS_PATH, jsSrc, 'utf8');
  console.log(`✅ Updated ${updated} articles in data/articles.js`);
  if (missing.length) console.log(`⚠️  Could not find entries for: ${missing.join(', ')}`);
}

main();
