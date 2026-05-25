(function () {
  const articles = window.UWLEO_ARTICLES || [];
  const books = window.UWLEO_BOOKS || [];

  // ===== i18n =====
  const I18N = {
    he: {
      brand: 'U.W. Leo',
      brandSub: 'אורי ויינברג · מאמרונים',
      navHome: 'בית',
      navArticles: 'מאמרונים',
      navBooks: 'ספרים',
      navAbout: 'אודות',
      heroEyebrow: 'מאמרונים · 2022—2026',
      heroTitle: 'מחשבות על הקיום, האלוהי, והאנושי.',
      heroSubtitle: 'אוסף של מאמרונים מאת אורי ויינברג, הידוע גם בשם U.W. Leo. כתיבה הדנה בקצוות הגדולים — היקום, המוסר, אלוהים, האהבה, המוות, וגבולות הידיעה האנושית.',
      heroCta: 'קרא את המאמרונים →',
      latestTitle: 'המאמרונים החדשים',
      latestSeeAll: 'כל המאמרונים ←',
      newsletterTitle: 'הירשמו לרשימת התפוצה',
      newsletterBody: 'קבלו עדכון במייל כאשר יוצא מאמרון חדש. ללא ספאם, ללא הצפה. רק כתיבה איכותית, מדי פעם.',
      newsletterCta: 'הצטרפו',
      newsletterNote: 'לא נשתף את כתובת הדוא״ל שלכם עם אף אחד.',
      newsletterThanks: 'תודה! נצור איתך קשר בקרוב כשנפעיל את רשימת התפוצה.',
      newsletterPlaceholder: 'כתובת הדוא״ל שלכם',
      articlesTitle: 'המאמרונים',
      articlesCount: (n) => `${n} מאמרונים`,
      searchPlaceholder: 'חיפוש לפי כותרת או מספר...',
      sortDesc: 'חדשים תחילה',
      sortAsc: 'ישנים תחילה',
      sortNum: 'לפי מספר',
      essayLabel: 'מאמרון',
      essayBy: 'U.W. Leo · אורי ויינברג',
      back: '→ חזרה',
      prev: '→ הקודם',
      next: 'הבא ←',
      comingSoon: 'בעריכה',
      placeholderBody: 'הטקסט של המאמרון יופיע כאן ברגע שנחלץ אותו מקובץ ה-PDF.\n(המאמרון קיים כקובץ PDF במייל — תהליך החילוץ והעיבוד יבוצע בקרוב.)',
      notFound: 'מאמרון לא נמצא.',
      booksTitle: 'ספרים',
      booksMeta: 'סדרת ARKO',
      booksIntro: 'סדרת ARKO היא טרילוגיית מדע בדיוני—פילוסופי מאת אורי ויינברג, החוקרת את שאלות הקיום, התודעה, וייעוד האנושות באמצעות סיפור עתידני.',
      bookCta: 'לרכישה באמזון →',
      reviewsLabel: 'מה הביקורת אמרה',
      aboutTitle: 'אודות המחבר',
      aboutHeading: 'הכירו את U.W. Leo',
      aboutP1: 'הסופר U.W. Leo נשאב אל הכתיבה כבר בילדותו המוקדמת, לאחר שבילה חלק ניכר מילדותו עם דודו, <strong>דויד שחר</strong> — סופר ישראלי ידוע וזוכה פרס מדיסיס היוקרתי, פרס ספרותי צרפתי לסיפורת. הזרע של תשוקת הכתיבה נשתל אז וצמח, והוא המשיך לכתוב סיפורים קצרים, שירים ומכתבים.',
      aboutP2: 'חוויה מיוחדת ש-U.W. Leo חווה בכתיבתו היא התחושה שהספר כותב את עצמו, כשהסיפור מתעורר לחיים כמעט מעצמו, ושהסיפור עצמו אף כותב חלק מקיומו שלו. הוא מוצא בתהליך הזה דבר נשגב — בבואה אמיתית של פלא החיים.',
      aboutP3: 'כשאינו כותב סיפורי נוער מרתקים, U.W. Leo נהנה ללמוד דברים חדשים, לקרוא, לראות סרטים ולשחק שחמט. אחת ההנאות הגדולות ביותר שלו היא פשוט שיחה וכוס קפה עם חבר או בן משפחה.',
      aboutP4: 'U.W. Leo הוא גם המחבר של <em>Red Silkworms</em>, זוכה פרס משרד החינוך לסופרים מתחילים, ושל <em>Days of Light and Shadow</em> — שניהם רומנים של סיפורת. הוא חי, מבחינה פיזית, ליד ירושלים שבישראל, ומבחינה מנטלית, ב-Kepler-29JW — פלנטה במרחק 1,500 שנות אור מכדור הארץ.',
      footer: 'U.W. Leo · אורי ויינברג · 2022—2026',
      loading: 'טוען...',
    },
    en: {
      brand: 'U.W. Leo',
      brandSub: 'Uri Weinberg · Essays',
      navHome: 'Home',
      navArticles: 'Essays',
      navBooks: 'Books',
      navAbout: 'About',
      heroEyebrow: 'Essays · 2022—2026',
      heroTitle: 'Reflections on existence, the divine, and the human.',
      heroSubtitle: 'A collection of essays by Uri Weinberg, also known as U.W. Leo. Writing that engages with the great edges — the cosmos, morality, God, love, death, and the limits of human knowledge.',
      heroCta: 'Read the essays →',
      latestTitle: 'Latest essays',
      latestSeeAll: 'All essays →',
      newsletterTitle: 'Subscribe to the newsletter',
      newsletterBody: 'Get an email when a new essay is published. No spam, no flood. Just thoughtful writing, every so often.',
      newsletterCta: 'Subscribe',
      newsletterNote: 'We will never share your email with anyone.',
      newsletterThanks: 'Thank you! We\'ll be in touch as soon as the newsletter is live.',
      newsletterPlaceholder: 'Your email address',
      articlesTitle: 'Essays',
      articlesCount: (n) => `${n} essays`,
      searchPlaceholder: 'Search by title or number...',
      sortDesc: 'Newest first',
      sortAsc: 'Oldest first',
      sortNum: 'By number',
      essayLabel: 'Essay',
      essayBy: 'U.W. Leo · Uri Weinberg',
      back: '← Back',
      prev: '← Previous',
      next: 'Next →',
      comingSoon: 'Coming soon',
      placeholderBody: 'The English translation of this essay will appear here once we have extracted and translated the source text.\n(The essay exists as a Hebrew PDF — extraction and translation are in progress.)',
      notFound: 'Essay not found.',
      booksTitle: 'Books',
      booksMeta: 'The ARKO Series',
      booksIntro: 'The ARKO series is a philosophical science-fiction trilogy by Uri Weinberg, exploring questions of existence, consciousness, and humanity\'s purpose through a futuristic narrative.',
      bookCta: 'Buy on Amazon →',
      reviewsLabel: 'What the critics say',
      aboutTitle: 'About the author',
      aboutHeading: 'Meet U.W. Leo',
      aboutP1: 'Author U.W. Leo was inspired as a young child to become a writer, having spent much of his childhood with his uncle, <strong>David Shahar</strong>, a well-known Israeli writer and winner of the prestigious Prix Médicis award, a French literary award for fiction writing. The seed for his writing passion was planted then and grew as he continued writing short stories, poems, and letters.',
      aboutP2: 'An interesting experience U.W. Leo has while writing is the feeling that the book is writing itself, as the story comes to life on its own, seemingly with no control from him, and that the story is also writing a part of his own existence. He finds this process magnificent — a true reflection of the wonder of life itself.',
      aboutP3: 'When he isn\'t writing captivating young adult stories, U.W. Leo enjoys learning new things, reading, watching movies, and playing chess. One of his greatest pleasures is simply having a chat and coffee with a friend or family member.',
      aboutP4: 'U.W. Leo is also the author of <em>Red Silkworms</em>, winner of the Ministry of Education\'s Award for Emerging Authors, and <em>Days of Light and Shadow</em>, both novels of fiction. He lives, physically, near Jerusalem in Israel and, mentally, at Kepler-29JW — a planet 1,500 light years from Earth.',
      footer: 'U.W. Leo · Uri Weinberg · 2022—2026',
      loading: 'Loading...',
    }
  };

  // ===== State =====
  let currentLang = (localStorage.getItem('uwleo-lang') === 'en') ? 'en' : 'he';

  function t(key) {
    return I18N[currentLang][key] ?? I18N.he[key] ?? '';
  }

  // ===== Helpers =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const locale = currentLang === 'en' ? 'en-US' : 'he-IL';
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function articleTitle(a) {
    return currentLang === 'en' && a.title_en ? a.title_en : a.title_he;
  }

  function articleBody(a) {
    if (currentLang === 'en') return a.body_en || null;
    return a.body_he || null;
  }

  function paragraphsToHTML(text) {
    if (!text) return '';
    const paras = String(text).split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    return paras.map(p => `<p>${escapeHTML(p).replace(/\n/g, '<br>')}</p>`).join('');
  }

  // ===== Rendering =====
  function renderArticleRow(a) {
    const hasText = !!articleBody(a);
    const cls = 'article-row' + (hasText ? '' : ' no-text');
    const numStr = String(a.num).padStart(2, '0');
    return `
      <li class="${cls}" data-coming-soon="${t('comingSoon')}">
        <div class="article-num">№ ${numStr}</div>
        <button class="article-title" data-num="${a.num}">${escapeHTML(articleTitle(a))}</button>
        <time class="article-date" datetime="${a.date}">${formatDate(a.date)}</time>
      </li>`;
  }

  function renderHomeLatest() {
    const el = $('#home-latest');
    if (!el) return;
    const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date) || b.num - a.num).slice(0, 6);
    el.innerHTML = latest.map(renderArticleRow).join('');
  }

  function renderAllArticles(filter = '', sort = 'desc') {
    const el = $('#all-articles');
    const countEl = $('#articles-count');
    if (!el) return;

    let list = [...articles];
    const q = filter.trim().toLowerCase();
    if (q) {
      list = list.filter(a => {
        const t = (a.title_he || '').toLowerCase();
        const te = (a.title_en || '').toLowerCase();
        const n = String(a.num);
        return t.includes(q) || te.includes(q) || n === q || n.padStart(2, '0') === q;
      });
    }

    if (sort === 'desc') list.sort((a, b) => b.date.localeCompare(a.date) || b.num - a.num);
    else if (sort === 'asc') list.sort((a, b) => a.date.localeCompare(b.date) || a.num - b.num);
    else if (sort === 'num') list.sort((a, b) => b.num - a.num);

    el.innerHTML = list.map(renderArticleRow).join('');
    if (countEl) countEl.textContent = I18N[currentLang].articlesCount(list.length);
  }

  function renderArticleView(num) {
    const el = $('#article-view');
    if (!el) return;
    const a = articles.find(x => x.num === Number(num));
    if (!a) {
      el.innerHTML = `<p style="text-align:center;color:var(--ink-muted);padding:80px 0;">${t('notFound')}</p>`;
      return;
    }

    const numStr = String(a.num).padStart(2, '0');
    const body = articleBody(a);
    const idx = articles.findIndex(x => x.num === a.num);
    const prev = idx > 0 ? articles[idx - 1] : null;
    const next = idx < articles.length - 1 ? articles[idx + 1] : null;

    const placeholderText = t('placeholderBody').replace(/\n/g, '<br><br>');
    const bodyHTML = body
      ? paragraphsToHTML(body)
      : `<div class="placeholder">${placeholderText}</div>`;

    el.innerHTML = `
      <button class="back-link" onclick="history.back()">${t('back')}</button>
      <div class="article-eyebrow">${t('essayLabel')} № ${numStr} · ${formatDate(a.date)}</div>
      <h1 class="article-headline">${escapeHTML(articleTitle(a))}</h1>
      <div class="article-meta">${t('essayBy')}</div>
      <div class="article-body">${bodyHTML}</div>
      <nav class="article-nav">
        ${prev ? `<a href="#/article/${prev.num}">
          <span class="label">${t('prev')}</span>
          <span class="title">${escapeHTML(articleTitle(prev))}</span>
        </a>` : '<span></span>'}
        ${next ? `<a href="#/article/${next.num}">
          <span class="label">${t('next')}</span>
          <span class="title">${escapeHTML(articleTitle(next))}</span>
        </a>` : '<span></span>'}
      </nav>`;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function renderBooks() {
    const el = $('#books-grid');
    if (!el) return;
    el.innerHTML = books.map(b => {
      const title = currentLang === 'en' ? (b.title_en || b.title_he) : b.title_he;
      const subtitle = currentLang === 'en' ? (b.subtitle_en || b.subtitle_he || '') : (b.subtitle_he || '');
      const desc = currentLang === 'en' ? (b.desc_en || b.desc_he || '') : (b.desc_he || '');
      const reviews = b.reviews || [];
      const reviewsHTML = reviews.length === 0 ? '' : `
        <div class="book-reviews">
          <div class="book-reviews-label">${t('reviewsLabel')}</div>
          ${reviews.map(r => {
            const q = currentLang === 'en' ? (r.quote_en || r.quote_he || '') : (r.quote_he || r.quote_en || '');
            return `
              <blockquote class="book-review">
                <p>“${escapeHTML(q)}”</p>
                <cite>— ${escapeHTML(r.source)}</cite>
              </blockquote>`;
          }).join('')}
        </div>`;
      const coverHTML = b.cover_url
        ? `<img class="book-cover-img" src="${b.cover_url}" alt="${escapeHTML(title)}" loading="lazy">`
        : `<div class="book-cover">${escapeHTML(b.cover_text || title).replace(/\n/g, '<br>')}</div>`;
      return `
        <article class="book-card">
          ${coverHTML}
          <div class="book-meta">
            <h3 class="book-title">${escapeHTML(title)}</h3>
            <div class="book-subtitle">${escapeHTML(subtitle)}</div>
            <p class="book-desc">${escapeHTML(desc)}</p>
            <a href="${b.amazon_url || '#'}" class="book-cta" target="_blank" rel="noopener">${t('bookCta')}</a>
            ${reviewsHTML}
          </div>
        </article>`;
    }).join('');
  }

  // ===== Routing (hash-based) =====
  function parseRoute() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 0) return { path: '/' };
    if (parts[0] === 'article' && parts[1]) return { path: '/article', num: parts[1] };
    return { path: '/' + parts[0] };
  }

  function setActivePage(path) {
    $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === path));
    $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.route === path));
    const loading = $('#loading');
    if (loading) loading.style.display = 'none';
  }

  function handleRoute() {
    const r = parseRoute();
    setActivePage(r.path);
    if (r.path === '/') renderHomeLatest();
    else if (r.path === '/articles') renderAllArticles($('#article-search')?.value || '', $('#article-sort')?.value || 'desc');
    else if (r.path === '/article') renderArticleView(r.num);
    else if (r.path === '/books') renderBooks();
  }

  function applyI18n() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    // Apply data-i18n
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = I18N[currentLang][key];
      if (typeof val === 'string') el.innerHTML = val;
    });
    // Static elements not using data-i18n
    const search = $('#article-search');
    if (search) search.placeholder = t('searchPlaceholder');
    const newsletterInput = $('#newsletter-form input[type=email]');
    if (newsletterInput) newsletterInput.placeholder = t('newsletterPlaceholder');
    const sortSel = $('#article-sort');
    if (sortSel) {
      const opts = sortSel.options;
      if (opts[0]) opts[0].textContent = t('sortDesc');
      if (opts[1]) opts[1].textContent = t('sortAsc');
      if (opts[2]) opts[2].textContent = t('sortNum');
    }
    const loading = $('#loading');
    if (loading) loading.textContent = t('loading');
    const footer = $('footer div');
    if (footer) footer.textContent = t('footer');
    // Inject CSS for the "coming soon" badge per language
    let style = document.getElementById('i18n-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'i18n-style';
      document.head.appendChild(style);
    }
    style.textContent = `.article-row.no-text .article-title::after { content: '${t('comingSoon')}' !important; }`;
  }

  // ===== Event wiring =====
  function wire() {
    // Article title clicks
    document.addEventListener('click', (e) => {
      const t = e.target.closest('.article-title');
      if (t && t.dataset.num) {
        location.hash = `#/article/${t.dataset.num}`;
      }
    });

    // Article list search/sort
    $('#article-search')?.addEventListener('input', (e) => {
      renderAllArticles(e.target.value, $('#article-sort').value);
    });
    $('#article-sort')?.addEventListener('change', (e) => {
      renderAllArticles($('#article-search').value, e.target.value);
    });

    // Lang toggle
    $$('.lang-toggle button').forEach(b => {
      b.disabled = false;
      b.title = '';
      b.classList.toggle('active', b.dataset.lang === currentLang);
      b.addEventListener('click', () => {
        currentLang = b.dataset.lang;
        localStorage.setItem('uwleo-lang', currentLang);
        $$('.lang-toggle button').forEach(x => x.classList.toggle('active', x.dataset.lang === currentLang));
        applyI18n();
        handleRoute();
      });
    });

    // Newsletter
    $('#newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = $('#newsletter-note');
      const input = e.target.querySelector('input[type=email]');
      if (note) {
        note.textContent = t('newsletterThanks');
        note.style.color = '#9ACDA1';
      }
      input.value = '';
    });

    window.addEventListener('hashchange', handleRoute);
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', () => {
    applyI18n();
    wire();
    handleRoute();
  });
})();
