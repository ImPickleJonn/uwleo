# U.W. Leo — uwleo.com

Personal site for the literary essays (מאמרונים) of Uri Weinberg (U.W. Leo).

## Stack

- Static HTML/CSS/JS — no build step
- Hash-based client-side routing
- Hebrew RTL, English LTR toggle (English translations coming in v2)
- Node.js static file server for Render hosting
- MailerLite for newsletter (to be wired post-deploy)

## Local dev

```bash
node server.js
# Opens at http://localhost:8765
```

## Project structure

```
uwleo-project/
├── index.html              # All pages (SPA via hash routing)
├── main.js                 # Routing + rendering
├── data/
│   └── articles.js         # Article metadata + Hebrew body text
├── server.js               # Static file server (for Render)
├── package.json            # node hosting on Render
├── render.yaml             # Render deployment config
├── pdfs/                   # (gitignored) Source PDFs from Gmail
├── scripts/                # PDF extraction helpers
├── DEPLOY.md               # Deployment instructions
├── DOWNLOAD_INSTRUCTIONS.md # How to pull PDFs from Gmail
└── README.md
```

## Next steps

1. Download PDFs per `DOWNLOAD_INSTRUCTIONS.md`
2. Run extraction to populate `body_he` for each article
3. Deploy per `DEPLOY.md`
4. Wire MailerLite signup
5. (Later) Translate articles to English for the EN toggle
