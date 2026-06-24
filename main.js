(function () {
  const articles = window.UWLEO_ARTICLES || [];
  const books = window.UWLEO_BOOKS || [];

  // ===== i18n =====
  const I18N = {
    he: {
      brand: 'U.W. Leo',
      brandSub: 'אורי וינברג · מאמרים',
      navHome: 'בית',
      navArticles: 'מאמרים',
      navBooks: 'ספרים',
      navAbout: 'אודות',
      heroEyebrow: 'מאמרים · 2022—2026',
      heroTitle: 'מחשבות על הקיום, האלוהי והאנושי.',
      heroSubtitle: 'אוסף של מאמרים מאת אורי וינברג, הידוע גם בשם העט U. W. Leo. כתיבה הדנה בקצוות הגדולים: יקום, מוסר, אלוהים, אהבה, מוות, וגבולות הידיעה האנושית.',
      heroCta: 'קרא את המאמרים →',
      latestTitle: 'המאמרים החדשים',
      latestSeeAll: 'כל המאמרים ←',
      homeBooksTitle: 'ספרים מאת U. W. Leo',
      homeBooksSeeAll: 'לכל הספרים ←',
      newsletterTitle: 'הירשמו לרשימת התפוצה',
      newsletterBody: 'קבלו עדכון במייל כאשר יוצא מאמר חדש. ללא ספאם, ללא הצפה. רק כתיבה איכותית, מדי פעם.',
      newsletterCta: 'הצטרפו',
      newsletterNote: 'לא נשתף את כתובת הדוא״ל שלכם עם אף אחד.',
      newsletterThanks: 'תודה! נצור איתך קשר בקרוב כשנפעיל את רשימת התפוצה.',
      newsletterPlaceholder: 'כתובת הדוא״ל שלכם',
      articlesTitle: 'המאמרים',
      articlesCount: (n) => `${n} מאמרים`,
      searchPlaceholder: 'חיפוש לפי כותרת או מספר...',
      sortDesc: 'חדשים תחילה',
      sortAsc: 'ישנים תחילה',
      sortNum: 'לפי מספר',
      essayLabel: 'מאמר',
      essayBy: 'U. W. Leo · אורי וינברג',
      back: '→ חזרה',
      prev: '→ הקודם',
      next: 'הבא ←',
      comingSoon: 'בעריכה',
      placeholderBody: 'הטקסט של המאמר יופיע כאן בקרוב.',
      notFound: 'מאמר לא נמצא.',
      booksTitle: 'ספרים',
      booksMeta: 'סדרת ARKO',
      booksIntro: 'סדרת ARKO היא סדרת מדע בדיוני לבני הנעורים מאת אורי וינברג, החוקרת את שאלות הקיום, התודעה, וייעוד האנושות באמצעות סיפור עתידני.',
      bookCta: 'לרכישה באמזון →',
      reviewsLabel: 'מה הביקורת אמרה',
      aboutTitle: 'אודות המחבר',
      aboutHeading: 'הכירו את U. W. Leo',
      aboutP1: 'U. W. Leo נשאב אל הכתיבה כבר בילדותו, בהשפעת דודו הסופר <strong>דוד שחר</strong>, יוצרה של סדרת המופת "היכל הכלים השבורים". תשוקת הכתיבה אשר התפתחה בו מאז, התבטאה בהתנסויות שונות, כמו סיפורים קצרים, שירים ומכתבים. זו הייתה תחילת הדרך.',
      aboutP2: 'בהמשך דרכו, פרסם U. W. Leo שני רומנים בעברית: <em>"תולעי משי אדומות"</em> בהוצאת הקיבוץ המאוחד ו<em>"ימים של אור וצל"</em> בהוצאת אמציה. שניהם פורסמו אז תחת שמו המקורי, אורי וינברג. הספרים, המהווים פרוזה בעלת עומק פילוסופי-פסיכולוגי, זכו לביקורות מצוינות. <em>"תולעי משי אדומות"</em> אף זכה בפרס רומן ביכורים של משרד החינוך בישראל.',
      aboutP3: 'U. W. Leo (שם עט) הוא יוצרה של סדרת ARKO, ספרי מדע בדיוני לבני הנעורים. עד עתה יצאו בסדרה זו שני ספרים, אשר קיבלו ביקורות נלהבות מצד גופים כמו Kirkus ואחרים. הספר הראשון בסדרה זכה במקום ראשון בקטגוריית SF של תחרות CIBAs.',
      aboutP4: 'מאז שנת 2022, לצד הסיפורת, הוא כותב מאמרים קצרים בנושאים פילוסופיים, מדעיים ואישיים. המאמרים נעים בין רפלקציה אישית לבין דיון בשאלות יסוד כמו: סודות היקום, מקומם של האדם ובעלי החיים בו, אהבה, סבל, אלוהים ומשמעות. אסוּפת המאמרים מוּבאת כאן בשלמוּתה.',
      aboutP5: 'חוויה מיוחדת ש-U. W. Leo מדווח עליה היא שבעיצומו של תהליך הכתיבה הספר מתחיל לכאורה לכתוב את עצמו. החל משלב מסוים הסיפור מתעורר לחיים ומכתיב את המשכו. U. W. Leo מוצא בתהליך הזה משהו נשגב — כמו בבואה לפלא החיים.',
      aboutP6: 'כאשר אינו כותב ספרי נוער מרתקים או מאמרים, U. W. Leo נהנה ללמוד דברים חדשים, לקרוא, לחקור, לצפות בסרטים ולשחק שחמט. הוא מוצא עניין רב ביותר גם בשיחת כוס-קפה עם חברים ובני משפחה.',
      aboutP7: 'U. W. Leo מתגורר, מבחינה פיזית, ליד ירושלים. מבחינה מנטלית הוא נמצא אי-שם ב-Kepler-29 JW — פלנטה הסובבת במרחק 1,500 שנות אור מכדור הארץ.',
      footer: 'U. W. Leo · אורי וינברג · 2022—2026',
      loading: 'טוען...',
      themeDark: 'מצב כהה',
      themeLight: 'מצב בהיר',
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
      homeBooksTitle: 'Books by U.W. Leo',
      homeBooksSeeAll: 'All books →',
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
      aboutHeading: 'Meet U. W. Leo',
      aboutP1: 'U. W. Leo was drawn to writing already in his childhood, under the influence of his uncle, the writer <strong>David Shahar</strong>, author of the masterwork series "The Palace of Shattered Vessels." The passion for writing that developed in him from then on found expression in various forms — short stories, poems, and letters. This was the beginning of the road.',
      aboutP2: 'Later in his path, U. W. Leo published two novels in Hebrew: <em>Red Silkworms</em> (HaKibbutz HaMeuchad Publishing) and <em>Days of Light and Shadow</em> (Amatzia Publishing). Both were published then under his original name, Uri Weinberg. The books, prose of philosophical-psychological depth, received excellent reviews. <em>Red Silkworms</em> even won the debut-novel prize of the Israeli Ministry of Education.',
      aboutP3: 'U. W. Leo (a pen name) is the author of the ARKO series, science-fiction books for young readers. Two books have appeared in the series so far, which received enthusiastic reviews from bodies such as Kirkus and others. The first book in the series won first place in the SF category of the CIBAs competition.',
      aboutP4: 'Since 2022, alongside his fiction, he has been writing short essays on philosophical, scientific, and personal subjects. The essays move between intimate reflection and discussion of fundamental questions such as: the secrets of the universe, the place of humans and animals within it, love, suffering, God, and meaning. The collection of essays is presented here in full.',
      aboutP5: 'A special experience U. W. Leo reports is that, in the midst of the writing process, the book seemingly begins to write itself. From a certain stage the story comes to life and dictates its own continuation. U. W. Leo finds something sublime in this process — like a reflection of the wonder of life.',
      aboutP6: 'When he is not writing captivating young adult books or essays, U. W. Leo enjoys learning new things, reading, exploring, watching movies, and playing chess. He also finds great interest in a cup of coffee and conversation with friends and family.',
      aboutP7: 'U. W. Leo lives, physically, near Jerusalem. Mentally he is somewhere on Kepler-29 JW — a planet orbiting 1,500 light years from Earth.',
      footer: 'U. W. Leo · Uri Weinberg · 2022—2026',
      loading: 'Loading...',
      themeDark: 'Dark mode',
      themeLight: 'Light mode',
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
    // Parse as a local date (not UTC) to avoid timezone shifts off-by-one.
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(iso);
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

  function renderHomeBooks() {
    const el = $('#home-books');
    if (!el) return;
    el.innerHTML = books.slice(0, 3).map(b => {
      const title = currentLang === 'en' ? (b.title_en || b.title_he) : b.title_he;
      const subtitle = currentLang === 'en' ? (b.subtitle_en || b.subtitle_he || '') : (b.subtitle_he || '');
      const status = currentLang === 'en' ? b.status_en : b.status_he;
      const href = b.amazon_url && b.amazon_url !== '#' ? b.amazon_url : '#/books';
      const target = b.amazon_url && b.amazon_url !== '#' ? '_blank' : '_self';
      const coverHTML = b.cover_url
        ? `<div class="home-book-cover"><img src="${b.cover_url}" alt="${escapeHTML(title)}" loading="lazy"></div>`
        : `<div class="home-book-cover">${escapeHTML(b.cover_text || title).replace(/\n/g, '<br>')}</div>`;
      return `
        <a class="home-book" href="${href}" target="${target}" rel="noopener">
          ${coverHTML}
          <div class="home-book-title">${escapeHTML(title)}</div>
          <div class="home-book-sub">${escapeHTML(subtitle)}</div>
          ${status ? `<div class="home-book-status">${escapeHTML(status)}</div>` : ''}
        </a>`;
    }).join('');
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
    if (r.path === '/') { renderHomeLatest(); renderHomeBooks(); }
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
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const label = isDark ? t('themeLight') : t('themeDark');
      themeBtn.setAttribute('title', label);
      themeBtn.setAttribute('aria-label', label);
    }
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

    // Theme toggle
    $('#theme-toggle')?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('uwleo-theme', next); } catch (_) {}
      const btn = $('#theme-toggle');
      if (btn) btn.setAttribute('title', next === 'dark' ? t('themeLight') : t('themeDark'));
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
