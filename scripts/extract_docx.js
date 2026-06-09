// extract_docx.js — pull clean text + the date+title header out of each .docx,
// write extracted/articles_v2.json keyed by article number.

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const ROOT = path.resolve(__dirname, '..');
const DOCX_DIR = path.join(ROOT, 'source-docx', 'מאמרים 1-120  WORD');
const OUT = path.join(ROOT, 'extracted', 'articles_v2.json');

// Strip RLM/LRM/PDF bidi markers + zero-widths.
function stripBidi(s) {
  return s.replace(/[​-‏‪-‮⁦-⁩﻿]/g, '');
}

function cleanText(raw) {
  let t = stripBidi(raw);
  t = t.replace(/\r\n/g, '\n');
  t = t.replace(/ /g, ' ');         // NBSP
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/ +\n/g, '\n');
  t = t.replace(/\n +/g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

// Returns true if `line` is a header line we should skip (number, date, etc.)
function isHeaderLine(line, expectedNum, knownTitle) {
  if (!line) return true;
  // Bare number — typically the article number at the doc top.
  if (/^\d{1,4}\s*$/.test(line)) return true;
  // "מייל מס' N" / "מאמרון N" / "מאמר N"
  if (/^(מייל|מאמרון|מאמר)\s*(מס[׳']?)?\s*\d+/.test(line)) return true;
  // Bare correction marker
  if (/^\(?תיקון\)?\s*$/.test(line)) return true;
  // Date line (DD.MM.YYYY-style, possibly with stray commas + location suffix like "(USA)")
  if (/^\d{1,2}[.,/]\d{1,2}[.,/]\d{2,4}\b/.test(line) && line.length < 40) return true;
  // Matches the known title from filename (sometimes with punctuation difference)
  if (knownTitle) {
    const norm = s => s.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
    if (norm(line) && norm(line) === norm(knownTitle)) return true;
  }
  return false;
}

function parseHeader(text, expectedNum, knownTitle) {
  const lines = text.split('\n');
  let date_iso = null;
  let title_in_doc = null;

  // Scan first ~12 non-empty lines to find date and title.
  let nonEmptyCount = 0;
  for (let k = 0; k < lines.length && nonEmptyCount < 12; k++) {
    const line = lines[k].trim();
    if (!line) continue;
    nonEmptyCount++;
    const dm = line.match(/^(\d{1,2})[.,/](\d{1,2})[.,/](\d{2,4})\b/);
    if (dm && !date_iso) {
      let [, d, mo, y] = dm;
      if (y.length === 2) y = '20' + y;
      date_iso = y + '-' + mo.padStart(2,'0') + '-' + d.padStart(2,'0');
      continue;
    }
    if (!title_in_doc && !isHeaderLine(line, expectedNum, null)) {
      title_in_doc = line;
    }
  }

  // Now strip header lines from the top of the body.
  let startIdx = 0;
  for (let k = 0; k < lines.length; k++) {
    const line = lines[k].trim();
    if (line === '') { startIdx = k + 1; continue; }
    if (isHeaderLine(line, expectedNum, knownTitle)) { startIdx = k + 1; continue; }
    // Also strip the title-as-found-in-doc if different from filename title
    if (title_in_doc && line === title_in_doc) { startIdx = k + 1; continue; }
    break;
  }

  let bodyLines = lines.slice(startIdx);
  // Drop trailing signature lines.
  while (bodyLines.length) {
    const last = bodyLines[bodyLines.length - 1].trim();
    if (!last || /^U\.?\s*W\.?\s*Leo\.?/i.test(last) || /^\d+\s*\/\s*\d+\s*$/.test(last) || /^--\s*\d+\s+of\s+\d+\s*--$/i.test(last)) {
      bodyLines.pop();
    } else break;
  }
  const body = bodyLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { date_iso, title_he: title_in_doc, body };
}

function parseFilename(name) {
  // Two formats observed:
  //   "1 - האם העולם.docx"               (number first)
  //   "Title - 42.docx"                   (number last, often English-titled)
  const base = name.replace(/\.docx$/i, '').trim();
  let m = base.match(/^(\d+)\s*-\s*(.+)$/);
  if (m) return { num: Number(m[1]), title_from_filename: m[2].trim() };
  m = base.match(/^(.+?)\s*-\s*(\d+)\s*$/);
  if (m) return { num: Number(m[2]), title_from_filename: m[1].trim() };
  return null;
}

async function main() {
  const files = fs.readdirSync(DOCX_DIR).filter(f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'));
  const byNum = {};

  for (const f of files) {
    const meta = parseFilename(f);
    if (!meta) { console.warn('skip unparseable name:', f); continue; }
    const full = path.join(DOCX_DIR, f);
    try {
      const result = await mammoth.extractRawText({ path: full });
      const text = cleanText(result.value);
      const { date_iso, title_he, body } = parseHeader(text, meta.num, meta.title_from_filename);
      byNum[meta.num] = {
        num: meta.num,
        filename: f,
        title_from_filename: meta.title_from_filename,
        title_he_from_doc: title_he,
        date_in_doc: date_iso,
        words: (body.match(/\S+/g) || []).length,
        chars: body.length,
        body_he: body,
      };
    } catch (e) {
      console.error('failed', f, e.message);
      byNum[meta.num] = { num: meta.num, filename: f, error: e.message };
    }
  }

  if (!fs.existsSync(path.dirname(OUT))) fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(byNum, null, 2), 'utf8');

  const total = Object.keys(byNum).length;
  const withDate = Object.values(byNum).filter(a => a.date_in_doc).length;
  const totalWords = Object.values(byNum).reduce((s, a) => s + (a.words || 0), 0);
  console.log(`✅ Extracted ${total} articles, ${withDate} with dates, ${totalWords.toLocaleString()} total words`);
  // Spot check
  console.log('\nFirst 5:');
  [1,2,3,4,5].forEach(n => {
    const a = byNum[n];
    if (a) console.log(`  #${n.toString().padStart(3)}  ${a.date_in_doc || '???'}  ${a.title_he_from_doc?.slice(0, 50) || '(no title)'}`);
  });
  console.log('\nLast 5:');
  [116,117,118,119,120].forEach(n => {
    const a = byNum[n];
    if (a) console.log(`  #${n.toString().padStart(3)}  ${a.date_in_doc || '???'}  ${a.title_he_from_doc?.slice(0, 50) || '(no title)'}`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
