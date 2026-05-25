# Deployment Guide — uwleo.com

The site is a static HTML/JS project. Two deploy steps: GitHub → Render → DNS.

## 1. Push to GitHub

```bash
cd C:\Users\jonnw\Desktop\uwleo-project
git init
git add .
git commit -m "Initial commit: U.W. Leo site"
gh repo create ImPickleJonn/uwleo --public --source=. --push
```

## 2. Deploy to Render

1. Log in to https://render.com
2. New → Web Service → connect the `ImPickleJonn/uwleo` GitHub repo
3. Render reads `render.yaml` automatically — no manual config needed
4. Click Create. First deploy takes ~1 minute.
5. You'll get a default URL like `https://uwleo.onrender.com` — verify the site loads.

## 3. Connect uwleo.com domain

1. In Render: project → Settings → Custom Domain → add `uwleo.com` and `www.uwleo.com`
2. Render shows you 2 DNS records to add (an A record for the apex and a CNAME for www)
3. Go to your domain registrar (wherever you bought uwleo.com), open DNS settings, and add those two records
4. SSL certificate provisioning is automatic — gives it ~10 minutes
5. Once propagated, https://uwleo.com goes live

## 4. Newsletter (MailerLite)

The current site has a placeholder newsletter form that just shows a thank-you message. To wire it up to actual email signups:

1. Create free account at https://www.mailerlite.com (free tier = up to 1000 subscribers)
2. Create a group called "UW Leo Readers"
3. Forms → Embedded form → design it (or use the default)
4. MailerLite gives you an embed snippet — paste it inside the `<div class="newsletter">` block in `index.html`, replacing the existing `<form>...</form>`
5. Send a test signup to confirm

Once wired, your dad logs into MailerLite, clicks Campaigns → New, writes the email, attaches the latest article PDF or links to the site, and hits Send.

## Future updates

When new articles arrive:
1. Save the PDF in `pdfs/`
2. Add an entry to `data/articles.js` with title_he, title_en, date, num
3. Run extraction script to populate body_he
4. Commit + push — Render auto-deploys
