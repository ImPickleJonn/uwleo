// download_pdfs.js — pull all 94 UW Leo article PDFs from Gmail via Gmail API.
//
// One-time setup (Pickle):
//   1. https://console.cloud.google.com → create or pick a project
//   2. APIs & Services → Library → enable "Gmail API"
//   3. APIs & Services → OAuth consent screen → External → fill name+email, add yourself as a test user
//   4. APIs & Services → Credentials → Create OAuth Client ID → "Desktop app"
//   5. Download JSON → save as credentials.json in this project root
//
// Then:
//   cd C:\Users\jonnw\Desktop\uwleo-project
//   npm install googleapis
//   node scripts/download_pdfs.js
//
// First run: browser opens, you approve, script downloads all PDFs to pdfs/.
// Subsequent runs: token cached in token.json, no browser needed.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');

const ROOT          = path.resolve(__dirname, '..');
const CREDS_PATH    = path.join(ROOT, 'credentials.json');
const TOKEN_PATH    = path.join(ROOT, 'token.json');
const PDFS_DIR      = path.join(ROOT, 'pdfs');
const SCOPES        = ['https://www.googleapis.com/auth/gmail.readonly'];
const USER_ID       = 'me';

// ============================================================================
// Article inventory — thread IDs are stable; attachment IDs fetched at runtime.
// Each entry maps to a single article number, or to a bundle of articles
// (whose order matches the file order in the email).
// ============================================================================
const BUNDLES = [
  {
    threadId: '184048d8655af8ef',
    label: 'Bundle 1 (articles 1-35)',
    // Bundle 1 attachments in original Gmail order map to articles 1..35
    mapByOrder: { start: 1, end: 35 },
  },
  {
    threadId: '19ab5183a02d2b3d',
    label: 'Bundle 2 (articles 36-75)',
    mapByOrder: { start: 36, end: 75 },
  },
];

const SINGLES = [
  { threadId: '19af7f5cc215420e', num: 76, label: "Alzheimer's and Angels" },
  { threadId: '19b3757f1bc9fbae', num: 77, label: 'An angel with a broken wing' },
  { threadId: '19b37c93aa7fe264', num: 78, label: 'Incoherence' },
  { threadId: '19b405621309baba', num: 79, label: 'Incoherence (2)' },
  { threadId: '19b454013926ded4', num: 80, label: 'Incoherence (3)' },
  { threadId: '19b923e97ebcec96', num: 81, label: 'Woke' },
  { threadId: '19ba9359ab5b3fb7', num: 82, label: 'queers for Palestine' },
  { threadId: '19bc1020a0476c71', num: 83, label: 'The violence of the enlightened' },
  { threadId: '19bd52c2b1f43abc', num: 84, label: 'More about Hypocrisy' },
  { threadId: '19be4ded4dfa2184', num: [85, 86], label: 'Psychological Holy Temple + Strange Bird' },
  { threadId: '19bf446fbc441822', num: 87, label: 'The Clinical Guide' },
  { threadId: '19bfe4029df7d6da', num: 88, label: 'Sublime Knowledge' },
  { threadId: '19c17d730f04f6b6', num: 89, label: 'The Fog' },
  { threadId: '19c187f75ff42393', num: 90, label: 'Reverie' },
  { threadId: '19cd3ac17fa49dab', num: 91, label: 'Feuerstein (TIKKUN)' },
  { threadId: '19c3c683fb82be4d', num: 92, label: 'Quantum Inferiority Complex (TIKKUN)' },
  { threadId: '19c46f8a53fe9ccb', num: 93, label: 'Faith of the Innocents' },
  { threadId: '19cd2630f9604f42', num: 94, label: 'Wars of Religion' },
];

// ============================================================================
// OAuth — supports a local loopback redirect (Desktop client OAuth flow)
// ============================================================================
async function authorize() {
  if (!fs.existsSync(CREDS_PATH)) {
    console.error('\n❌ credentials.json not found at:');
    console.error(`   ${CREDS_PATH}`);
    console.error('\nSee the setup steps at the top of this script.\n');
    process.exit(1);
  }
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const block = creds.installed || creds.web;
  if (!block) {
    console.error('credentials.json missing "installed" or "web" key — re-download as a Desktop OAuth client.');
    process.exit(1);
  }
  const { client_id, client_secret } = block;

  // Use a local loopback redirect on a free port.
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:53682');

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('\n🔑 First-time auth required.');
  console.log('   Opening browser to:\n   ' + authUrl + '\n');
  // Best-effort browser launch
  try {
    const { spawn } = require('child_process');
    spawn('cmd', ['/c', 'start', '', authUrl], { detached: true, stdio: 'ignore' }).unref();
  } catch (_) { /* user can copy URL manually */ }

  // Spin up a tiny local server to catch the redirect
  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const u = new URL(req.url, 'http://localhost:53682');
        const c = u.searchParams.get('code');
        if (c) {
          res.end('Auth complete. You can close this tab and return to the terminal.');
          server.close();
          resolve(c);
        } else {
          res.end('Waiting for auth code...');
        }
      } catch (e) { reject(e); }
    });
    server.listen(53682);
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('✅ Token saved to token.json\n');
  return oAuth2Client;
}

// ============================================================================
// Gmail helpers
// ============================================================================
function walkParts(part, out = []) {
  if (!part) return out;
  if (part.body && part.body.attachmentId && part.filename && part.filename.toLowerCase().endsWith('.pdf')) {
    out.push({ filename: part.filename, attachmentId: part.body.attachmentId, mimeType: part.mimeType });
  }
  if (Array.isArray(part.parts)) part.parts.forEach(p => walkParts(p, out));
  return out;
}

async function getPdfAttachments(gmail, threadId) {
  const t = await gmail.users.threads.get({ userId: USER_ID, id: threadId, format: 'full' });
  const attachments = [];
  for (const msg of (t.data.messages || [])) {
    walkParts(msg.payload, attachments).forEach(a => {
      attachments.push({ ...a, messageId: msg.id });
    });
  }
  // dedupe by attachmentId
  const seen = new Set();
  return attachments.filter(a => {
    if (seen.has(a.attachmentId)) return false;
    seen.add(a.attachmentId);
    return true;
  });
}

function sanitizeFilename(s) {
  return s.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
}

async function downloadAttachment(gmail, messageId, attachmentId, destPath) {
  const r = await gmail.users.messages.attachments.get({
    userId: USER_ID, messageId, id: attachmentId,
  });
  const buf = Buffer.from(r.data.data, 'base64url');
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  if (!fs.existsSync(PDFS_DIR)) fs.mkdirSync(PDFS_DIR, { recursive: true });
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  let totalSaved = 0;
  let totalBytes = 0;

  for (const bundle of BUNDLES) {
    console.log(`\n📦 ${bundle.label}  (thread ${bundle.threadId})`);
    const attachments = await getPdfAttachments(gmail, bundle.threadId);
    console.log(`   ${attachments.length} PDF attachments found`);

    const { start, end } = bundle.mapByOrder;
    const expected = end - start + 1;
    if (attachments.length !== expected) {
      console.warn(`   ⚠️ Expected ${expected} but found ${attachments.length} — order mapping may drift.`);
    }

    for (let i = 0; i < attachments.length; i++) {
      const num = start + i;
      const a = attachments[i];
      const numStr = String(num).padStart(2, '0');
      const safe = sanitizeFilename(a.filename);
      const dest = path.join(PDFS_DIR, `${numStr}_${safe}`);
      if (fs.existsSync(dest)) {
        console.log(`   • #${numStr} ${a.filename}  (already on disk)`);
        continue;
      }
      const bytes = await downloadAttachment(gmail, a.messageId, a.attachmentId, dest);
      totalSaved++; totalBytes += bytes;
      console.log(`   ✓ #${numStr} ${a.filename}  (${(bytes/1024).toFixed(1)} KB)`);
    }
  }

  for (const s of SINGLES) {
    const nums = Array.isArray(s.num) ? s.num : [s.num];
    console.log(`\n📄 #${nums.join('+')} ${s.label}  (thread ${s.threadId})`);
    const attachments = await getPdfAttachments(gmail, s.threadId);

    for (let i = 0; i < attachments.length && i < nums.length; i++) {
      const num = nums[i];
      const a = attachments[i];
      const numStr = String(num).padStart(2, '0');
      const safe = sanitizeFilename(a.filename);
      const dest = path.join(PDFS_DIR, `${numStr}_${safe}`);
      if (fs.existsSync(dest)) {
        console.log(`   • #${numStr} ${a.filename}  (already on disk)`);
        continue;
      }
      const bytes = await downloadAttachment(gmail, a.messageId, a.attachmentId, dest);
      totalSaved++; totalBytes += bytes;
      console.log(`   ✓ #${numStr} ${a.filename}  (${(bytes/1024).toFixed(1)} KB)`);
    }
  }

  console.log(`\n🎉 Done. ${totalSaved} new files (${(totalBytes/1024/1024).toFixed(2)} MB) saved to:`);
  console.log(`   ${PDFS_DIR}\n`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message || err);
  if (err.response?.data) console.error(err.response.data);
  process.exit(1);
});
