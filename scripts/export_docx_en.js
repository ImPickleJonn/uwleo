// export_docx_en.js — write each English article translation to its own .docx,
// into a folder, then the caller zips it.
//
// Sources: scripts/articles_meta_v2.json (titles), extracted/translations_en.json (bodies)

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');

const ROOT = path.resolve(__dirname, '..');
const META = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'articles_meta_v2.json'), 'utf8'));
const EN   = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'translations_en.json'), 'utf8'));

const OUT_DIR = path.join(ROOT, 'export', 'UW Leo - English Translations');

function fmtDate(iso) {
  // pull date from the v2 extraction if available
  return iso || '';
}

// Load dates from the v2 corpus
const V2 = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'articles_v2.json'), 'utf8'));

function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
}

async function buildDoc(num, titleEn, dateIso, bodyEn) {
  const paras = [];

  // Title
  paras.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 120 },
    children: [new TextRun({ text: titleEn, bold: true, size: 36, font: 'Georgia' })],
  }));

  // Byline + date
  const meta = `Essay No. ${num}` + (dateIso ? `  ·  ${dateIso}` : '') + '  ·  U. W. Leo (Uri Weinberg)';
  paras.push(new Paragraph({
    spacing: { after: 360 },
    children: [new TextRun({ text: meta, italics: true, size: 20, color: '777777', font: 'Georgia' })],
  }));

  // Body paragraphs
  const blocks = (bodyEn || '').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    paras.push(new Paragraph({
      spacing: { after: 200, line: 320 },
      children: [new TextRun({ text: block.replace(/\n/g, ' '), size: 24, font: 'Georgia' })],
    }));
  }

  const doc = new Document({
    creator: 'U. W. Leo',
    title: titleEn,
    sections: [{
      properties: {},
      children: paras,
    }],
  });

  return Packer.toBuffer(doc);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const nums = Object.keys(META).map(Number).sort((a, b) => a - b);
  let written = 0;
  for (const num of nums) {
    const titleEn = META[String(num)].title_en;
    const bodyEn = EN[String(num)];
    const dateIso = V2[String(num)]?.date_in_doc || '';
    if (!bodyEn) { console.warn(`#${num} has no English body — skipping`); continue; }

    const buf = await buildDoc(num, titleEn, dateIso, bodyEn);
    const fname = `${String(num).padStart(3, '0')} - ${sanitize(titleEn)}.docx`;
    fs.writeFileSync(path.join(OUT_DIR, fname), buf);
    written++;
  }
  console.log(`✅ Wrote ${written} .docx files to:`);
  console.log(`   ${OUT_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
