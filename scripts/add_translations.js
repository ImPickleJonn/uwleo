// Merge new translations into extracted/translations_en.json.
// Usage: node scripts/add_translations.js NEW_JSON_PATH
// NEW_JSON_PATH points to a JSON file like { "18": "...", "19": "...", ... }

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EN_PATH = path.join(ROOT, 'extracted', 'translations_en.json');

const input = process.argv[2];
if (!input) { console.error('Usage: node scripts/add_translations.js NEW_JSON_PATH'); process.exit(1); }

const existing = fs.existsSync(EN_PATH) ? JSON.parse(fs.readFileSync(EN_PATH, 'utf8')) : {};
const incoming = JSON.parse(fs.readFileSync(input, 'utf8'));

const added = [];
for (const k of Object.keys(incoming)) {
  existing[k] = incoming[k];
  added.push(k);
}

// Sort numerically
const sorted = {};
Object.keys(existing).map(Number).sort((a, b) => a - b).forEach(n => {
  sorted[String(n)] = existing[String(n)];
});

fs.writeFileSync(EN_PATH, JSON.stringify(sorted, null, 2), 'utf8');
console.log('✅ Added/updated translations:', added.join(', '));
console.log('   Total translations:', Object.keys(sorted).length, '/ 75');
