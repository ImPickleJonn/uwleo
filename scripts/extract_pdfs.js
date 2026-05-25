// extract_pdfs.js — extract Hebrew text from each PDF using pdftotext (Poppler).
// pdftotext from Git for Windows produces much cleaner Hebrew than pdf-parse:
// proper paragraphs, no mid-word splits, correct RTL ordering.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const ROOT    = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'pdfs', 'UWLEO Articles');
const OUT_DIR = path.join(ROOT, 'extracted');
const TMP_DIR = path.join(os.tmpdir(), 'uwleo-pdfs');

// Filename → article number (75 articles in two original Gmail bundles)
const FILENAME_TO_NUM = {
  // Bundle 1 — articles 1..35
  'האם העולם עלול לנוע אחורנית.pdf': 1,
  'האוקיינוס שבו אנחנו חיים.pdf': 2,
  'ההבדל בינינו לבין בעלי חיים.pdf': 3,
  'קץ העולם.pdf': 4,
  'העקרון השטני של החיים.pdf': 5,
  'אלוהים והרע בעולם - קובץ מתוקן.pdf': 6,
  'טלסקופ ג_יימס ווב.pdf': 7,
  'האם אנחנו לבד.pdf': 8,
  'SKEPTICISM.pdf': 9,
  'מדע ואמונה.pdf': 10,
  'על הקיצוניות.pdf': 11,
  'מייל מס_ 12 (תיקון) - על האהבה.pdf': 12,
  'CANCEL CULTURE.pdf': 13,
  'Great Purge.pdf': 14,
  'Lucifer   מייל 15 תיקון.pdf': 15,
  'Choose Life.pdf': 16,
  'The Great Experiment.pdf': 17,
  'Sons of God.pdf': 18,
  'Lords of Creation.pdf': 19,
  'The Future of Mankind.pdf': 20,
  'Antisemitism.pdf': 21,
  'The Matrix.pdf': 22,
  'מייל מס_ 23 - Singularity of Information.pdf': 23,
  'cosmic connectome - מייל מס_ 24.pdf': 24,
  'Cosmic Monster.pdf': 25,
  'Lynch תיקון .pdf': 26,
  'The Psycho-Physical Problem (1).pdf': 27,
  'Psycho-Physical Problem (2) .pdf': 28,
  'Psycho-Physical Problem (3) - מייל מס_ 29.pdf': 29,
  'Psycho-Physical Problem (4) - מייל מס_ 30.pdf': 30,
  'מייל מס_ 31 -  Psycho-Physical Problem (5) The.pdf': 31,
  'מייל מס_ 32 - חוויה סובייקטיבית אצל הזר (1).pdf': 32,
  'מייל מס_ 33 - חוויה סובייקטיבית אצל הַזָּר (2).pdf': 33,
  'מייל מס_ 34 - Close Encounters of the Third Kind.pdf': 34,
  'מייל מס_ 35 - Techno-Signatures.pdf': 35,
  // Bundle 2 — articles 36..75
  'טיעון מן הבורות.pdf': 36,
  'חווית סף מוות (1).pdf': 37,
  'חווית סף מוות 2.pdf': 38,
  'חווית סף מוות (3).pdf': 39,
  'חווית סף מוות (4).pdf': 40,
  'שני אלוהים.pdf': 41,
  'The very well-known God.pdf': 42,
  'The completely unknown God.pdf': 43,
  'Meaning (1).pdf': 44,
  'meaning (2).pdf': 45,
  'meaning (3).pdf': 46,
  'Meaning (4).pdf': 47,
  'meaning for me.pdf': 48,
  'Meaning for me (2).pdf': 49,
  'Meaning for me (3).pdf': 50,
  'meaning  fror me (4).pdf': 51,
  'Alzheimer and Love.pdf': 52,
  'Noah_s Ark (-1-).pdf': 53,
  'Noah_s Ark (2).pdf': 54,
  'Noah_s Ark (3).pdf': 55,
  'Noah_s Ark (4).pdf': 56,
  'LOVE (1).pdf': 57,
  'LOVE (2).pdf': 58,
  'Love (3).pdf': 59,
  'Love (4).pdf': 60,
  'Abrahamic Religions and Love.pdf': 61,
  'מייל מס_ 62 - Jesus vs. Jehovah.pdf': 62,
  'Apes and Pigs מייל מס_ 63.pdf': 63,
  'מייל מס_ 64 - Ecstasy of Blood.pdf': 64,
  'מייל מס_ 65 - Operating Instructions.pdf': 65,
  'מייל מס_ 66 - The Prophet.pdf': 66,
  'מייל מס_ 67 - Good Example.pdf': 67,
  'מייל מס_ 68 - dar al-harb.pdf': 68,
  'מייל מס_ 69 - 29.5.1453.pdf': 69,
  'מייל מס_ 70 - The Great Invasion.pdf': 70,
  'מייל מס_ 71 - Deep Coma.pdf': 71,
  'מייל מס_ 72 - (תיקון) -   Mets Yeghern.pdf': 72,
  'מייל מס_ 73 - 15.7.1099.pdf': 73,
  'מייל מס_ 74 - Sermon on the Mount.pdf': 74,
  'מייל מס_ 75 - The Cross and the Crescent.pdf': 75,
};

function cleanText(raw) {
  let t = raw;
  // Strip Unicode bidi markers (LRE, RLE, PDF, LRM, RLM, ZWJ, ZWNJ, FSI, PDI, etc.)
  t = t.replace(/[​-‏‪-‮⁦-⁩﻿]/g, '');
  // Normalize line endings + spaces
  t = t.replace(/\r\n/g, '\n');
  t = t.replace(/ /g, ' ');         // NBSP → space
  t = t.replace(/[ \t]+/g, ' ');         // collapse whitespace runs (preserve newlines)
  t = t.replace(/[ ]+\n/g, '\n');
  t = t.replace(/\n[ ]+/g, '\n');
  // Trim each line, drop totally-empty lines that are part of large gaps
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function wordCount(s) { return (s.match(/\S+/g) || []).length; }

function extractWithPdftotext(srcPath) {
  // Copy to a tmpfile with ASCII name so pdftotext (Windows build) can open it.
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
  const tmpName = crypto.randomBytes(6).toString('hex') + '.pdf';
  const tmpPath = path.join(TMP_DIR, tmpName);
  fs.copyFileSync(srcPath, tmpPath);
  const res = spawnSync('pdftotext', ['-layout', '-enc', 'UTF-8', tmpPath, '-'], {
    maxBuffer: 16 * 1024 * 1024,
    encoding: 'utf8',
  });
  try { fs.unlinkSync(tmpPath); } catch (_) {}
  if (res.status !== 0) throw new Error(res.stderr || 'pdftotext failed');
  return res.stdout;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  const byNum = {};
  const unmapped = [];
  let totalWords = 0;
  let totalChars = 0;

  for (const f of files) {
    const num = FILENAME_TO_NUM[f];
    if (!num) { unmapped.push(f); continue; }
    const fullPath = path.join(PDF_DIR, f);
    try {
      const raw = extractWithPdftotext(fullPath);
      const text = cleanText(raw);
      const wc = wordCount(text);
      totalWords += wc;
      totalChars += text.length;
      byNum[num] = { num, filename: f, words: wc, chars: text.length, text_he: text };
      console.log(`#${String(num).padStart(2, '0')}  ${wc}w  ${f}`);
    } catch (e) {
      console.error(`#${num}  FAILED  ${f}: ${e.message}`);
      byNum[num] = { num, filename: f, error: e.message };
    }
  }

  if (unmapped.length) {
    console.log('\n⚠️ Unmapped files (skipped):');
    unmapped.forEach(f => console.log('   ' + f));
  }

  const perArticleDir = path.join(OUT_DIR, 'per-article');
  if (!fs.existsSync(perArticleDir)) fs.mkdirSync(perArticleDir, { recursive: true });
  for (const num of Object.keys(byNum)) {
    fs.writeFileSync(
      path.join(perArticleDir, `${String(num).padStart(2, '0')}.json`),
      JSON.stringify(byNum[num], null, 2),
      'utf8'
    );
  }
  fs.writeFileSync(
    path.join(OUT_DIR, 'articles_he.json'),
    JSON.stringify(byNum, null, 2),
    'utf8'
  );

  console.log(`\n✅ Extracted ${Object.keys(byNum).length} articles via pdftotext.`);
  console.log(`   Total words: ${totalWords.toLocaleString()}`);
  console.log(`   Total chars: ${totalChars.toLocaleString()}`);
}

main().catch(e => { console.error(e); process.exit(1); });
