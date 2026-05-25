// rebuild_articles.js — regenerate data/articles.js from scratch.
// Combines: article metadata template + Hebrew bodies (extracted/articles_he.json)
//           + English bodies (extracted/translations_en.json) + Books data.
// Run after any change to translations or extraction.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HE   = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'articles_he.json'), 'utf8'));
const EN   = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'translations_en.json'), 'utf8'));

// Strip metadata header lines + signature from Hebrew text.
function cleanHe(raw, titleHints = []) {
  if (!raw) return null;
  let t = raw
    .replace(/\n*\s*U\.?\s*W\.?\s*Leo\.?\s*\n*/gi, '\n')
    .replace(/\n*\s*UW\s*Leo\.?\s*\n*/gi, '\n')
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '');
  const normalize = s => s.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
  const titleSet = new Set(titleHints.map(normalize).filter(Boolean));
  let blocks = t.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  while (blocks.length > 0) {
    const first = blocks[0];
    const one = first.split('\n')[0].trim();
    if (/^(מייל|מאמרון)\s*(מס[׳']?)?\s*\d+/.test(one)) { blocks.shift(); continue; }
    if (/^\d{1,2}\.\d{1,2}\.\d{2,4}\s*$/.test(one)) { blocks.shift(); continue; }
    if (/^\(?תיקון\)?/.test(one) && one.length < 20) { blocks.shift(); continue; }
    if (first.split('\n').length === 1 && first.length < 80) {
      const norm = normalize(first);
      if (titleSet.has(norm)) { blocks.shift(); continue; }
      let matched = false;
      for (const hint of titleSet) {
        if (hint.length > 6 && (norm.startsWith(hint) || hint.startsWith(norm))) { matched = true; break; }
      }
      if (matched) { blocks.shift(); continue; }
    }
    break;
  }
  blocks = blocks.map(b => b.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim());
  blocks = blocks.map(b => b
    .replace(/\s+([.,!?:;])/g, '$1')
    .replace(/([.,!?:;])(?=\S)/g, '$1 ')
    .replace(/([A-Za-z])([֐-׿])/g, '$1 $2')
    .replace(/([֐-׿])([A-Za-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  );
  return blocks.join('\n\n').trim() || null;
}

// English text — already clean from translation, just normalize whitespace.
function cleanEn(raw) {
  if (!raw) return null;
  return raw.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() || null;
}

// ===== Article metadata (94 articles, in chronological writing order) =====
const ARTICLES_META = [
  [1, 'האם העולם עלול לנוע אחורנית?', 'Could the World Move Backwards?', '2022-10-23', 'bundle-1'],
  [2, 'האוקיינוס שבו אנחנו חיים', 'The Ocean We Live In', '2022-10-23', 'bundle-1'],
  [3, 'ההבדל בינינו לבין בעלי חיים', 'The Difference Between Us and Animals', '2022-10-23', 'bundle-1'],
  [4, 'קץ העולם', 'End of the World', '2022-10-23', 'bundle-1'],
  [5, 'העיקרון השטני של החיים', 'The Satanic Principle of Life', '2022-10-23', 'bundle-1'],
  [6, 'אלוהים והרע בעולם', 'God and Evil in the World', '2022-10-23', 'bundle-1'],
  [7, "טלסקופ ג'יימס ווב", 'The James Webb Telescope', '2022-10-23', 'bundle-1'],
  [8, 'האם אנחנו לבד?', 'Are We Alone?', '2022-10-23', 'bundle-1'],
  [9, 'סקפטיות', 'Skepticism', '2022-10-23', 'bundle-1'],
  [10, 'מדע ואמונה', 'Science and Faith', '2022-10-23', 'bundle-1'],
  [11, 'על הקיצוניות', 'On Extremism', '2022-10-23', 'bundle-1'],
  [12, 'על האהבה', 'On Love', '2022-10-23', 'bundle-1'],
  [13, 'תרבות הביטול', 'Cancel Culture', '2022-10-23', 'bundle-1'],
  [14, 'הטיהור הגדול', 'The Great Purge', '2022-10-23', 'bundle-1'],
  [15, 'לוציפר', 'Lucifer', '2022-10-23', 'bundle-1'],
  [16, 'בחר בחיים', 'Choose Life', '2022-10-23', 'bundle-1'],
  [17, 'הניסוי הגדול', 'The Great Experiment', '2022-10-23', 'bundle-1'],
  [18, 'בני האלוהים', 'Sons of God', '2022-10-23', 'bundle-1'],
  [19, 'אדוני הבריאה', 'Lords of Creation', '2022-10-23', 'bundle-1'],
  [20, 'עתיד האנושות', 'The Future of Mankind', '2022-10-23', 'bundle-1'],
  [21, 'אנטישמיות', 'Antisemitism', '2022-10-23', 'bundle-1'],
  [22, 'המטריקס', 'The Matrix', '2022-10-23', 'bundle-1'],
  [23, 'סינגולריות המידע', 'Singularity of Information', '2022-10-23', 'bundle-1'],
  [24, 'הקונקטום הקוסמי', 'Cosmic Connectome', '2022-10-23', 'bundle-1'],
  [25, 'המפלצת הקוסמית', 'Cosmic Monster', '2022-10-23', 'bundle-1'],
  [26, "לינץ'", 'Lynch', '2022-10-23', 'bundle-1'],
  [27, 'הבעיה הפסיכופיזית (1)', 'The Psychophysical Problem (1)', '2022-10-23', 'bundle-1'],
  [28, 'הבעיה הפסיכופיזית (2)', 'The Psychophysical Problem (2)', '2022-10-23', 'bundle-1'],
  [29, 'הבעיה הפסיכופיזית (3)', 'The Psychophysical Problem (3)', '2022-10-23', 'bundle-1'],
  [30, 'הבעיה הפסיכופיזית (4)', 'The Psychophysical Problem (4)', '2022-10-23', 'bundle-1'],
  [31, 'הבעיה הפסיכופיזית (5)', 'The Psychophysical Problem (5)', '2022-10-23', 'bundle-1'],
  [32, 'חוויה סובייקטיבית אצל הזר (1)', 'Subjective Experience in The Stranger (1)', '2022-10-23', 'bundle-1'],
  [33, 'חוויה סובייקטיבית אצל הזר (2)', 'Subjective Experience in The Stranger (2)', '2022-10-23', 'bundle-1'],
  [34, 'מפגשים מהסוג השלישי', 'Close Encounters of the Third Kind', '2022-10-23', 'bundle-1'],
  [35, 'טכנו-חתימות', 'Techno-Signatures', '2022-10-23', 'bundle-1'],
  [36, 'טיעון מן הבורות', 'Argument from Ignorance', '2024-09-16', 'bundle-2'],
  [37, 'חווית סף מוות (1)', 'Near-Death Experience (1)', '2025-05-26', 'bundle-2'],
  [38, 'חווית סף מוות (2)', 'Near-Death Experience (2)', '2025-05-26', 'bundle-2'],
  [39, 'חווית סף מוות (3)', 'Near-Death Experience (3)', '2025-05-26', 'bundle-2'],
  [40, 'חווית סף מוות (4)', 'Near-Death Experience (4)', '2025-05-26', 'bundle-2'],
  [41, 'שני אלוהים', 'Two Gods', '2025-05-27', 'bundle-2'],
  [42, 'האל הידוע מאוד', 'The Very Well-Known God', '2025-06-04', 'bundle-2'],
  [43, 'האל הבלתי ידוע לחלוטין', 'The Completely Unknown God', '2025-06-04', 'bundle-2'],
  [44, 'משמעות (1)', 'Meaning (1)', '2025-06-05', 'bundle-2'],
  [45, 'משמעות (2)', 'Meaning (2)', '2025-06-08', 'bundle-2'],
  [46, 'משמעות (3)', 'Meaning (3)', '2025-06-15', 'bundle-2'],
  [47, 'משמעות (4)', 'Meaning (4)', '2025-06-16', 'bundle-2'],
  [48, 'משמעות עבורי (1)', 'Meaning for Me (1)', '2025-07-02', 'bundle-2'],
  [49, 'משמעות עבורי (2)', 'Meaning for Me (2)', '2025-07-02', 'bundle-2'],
  [50, 'משמעות עבורי (3)', 'Meaning for Me (3)', '2025-07-02', 'bundle-2'],
  [51, 'משמעות עבורי (4)', 'Meaning for Me (4)', '2025-07-02', 'bundle-2'],
  [52, 'אלצהיימר ואהבה', 'Alzheimer and Love', '2025-07-27', 'bundle-2'],
  [53, 'תיבת נוח (1)', "Noah's Ark (1)", '2025-07-13', 'bundle-2'],
  [54, 'תיבת נוח (2)', "Noah's Ark (2)", '2025-07-15', 'bundle-2'],
  [55, 'תיבת נוח (3)', "Noah's Ark (3)", '2025-07-17', 'bundle-2'],
  [56, 'תיבת נוח (4)', "Noah's Ark (4)", '2025-07-24', 'bundle-2'],
  [57, 'אהבה (1)', 'Love (1)', '2025-07-28', 'bundle-2'],
  [58, 'אהבה (2)', 'Love (2)', '2025-08-01', 'bundle-2'],
  [59, 'אהבה (3)', 'Love (3)', '2025-08-27', 'bundle-2'],
  [60, 'אהבה (4)', 'Love (4)', '2025-08-29', 'bundle-2'],
  [61, 'הדתות האברהמיות והאהבה', 'Abrahamic Religions and Love', '2025-09-02', 'bundle-2'],
  [62, 'ישו מול יהוה', 'Jesus vs. Jehovah', '2025-09-04', 'bundle-2'],
  [63, 'קופים וחזירים', 'Apes and Pigs', '2025-09-25', 'bundle-2'],
  [64, 'אקסטזה של דם', 'Ecstasy of Blood', '2025-10-06', 'bundle-2'],
  [65, 'הוראות הפעלה', 'Operating Instructions', '2025-10-12', 'bundle-2'],
  [66, 'הנביא', 'The Prophet', '2025-10-16', 'bundle-2'],
  [67, 'דוגמה אישית', 'Good Example', '2025-10-19', 'bundle-2'],
  [68, 'דאר אל־חרב', 'Dar al-Harb', '2025-10-20', 'bundle-2'],
  [69, '29.5.1453', '29.5.1453', '2025-10-23', 'bundle-2'],
  [70, 'הפלישה הגדולה', 'The Great Invasion', '2025-10-25', 'bundle-2'],
  [71, 'תרדמת עמוקה', 'Deep Coma', '2025-10-27', 'bundle-2'],
  [72, 'מץ יגרן', 'Mets Yeghern', '2025-11-05', 'bundle-2'],
  [73, '15.7.1099', '15.7.1099', '2025-11-10', 'bundle-2'],
  [74, 'הדרשה על ההר', 'Sermon on the Mount', '2025-11-13', 'bundle-2'],
  [75, 'הצלב והסהר', 'The Cross and the Crescent', '2025-11-16', 'bundle-2'],
  [76, "אלצהיימר ומלאכים", "Alzheimer's and Angels", '2025-12-07', 'single'],
  [77, 'מלאך עם כנף שבורה', 'An Angel with a Broken Wing', '2025-12-19', 'single'],
  [78, 'חוסר קוהרנטיות', 'Incoherence', '2025-12-19', 'single'],
  [79, 'חוסר קוהרנטיות (2)', 'Incoherence (2)', '2025-12-21', 'single'],
  [80, 'חוסר קוהרנטיות (3)', 'Incoherence (3)', '2025-12-22', 'single'],
  [81, 'ווק', 'Woke', '2026-01-06', 'single'],
  [82, 'קווירים למען פלסטין', 'Queers for Palestine', '2026-01-10', 'single'],
  [83, 'האלימות של הנאורים', 'The Violence of the Enlightened', '2026-01-15', 'single'],
  [84, 'עוד על הצביעות', 'More about Hypocrisy', '2026-01-19', 'single'],
  [85, 'בית המקדש הפסיכולוגי', 'Psychological Holy Temple', '2026-01-22', 'single'],
  [86, 'עוף מוזר', 'Strange Bird', '2026-01-22', 'single'],
  [87, 'המדריך הקליני', 'The Clinical Guide', '2026-01-25', 'single'],
  [88, 'ידע נשגב', 'Sublime Knowledge', '2026-01-27', 'single'],
  [89, 'הערפל', 'The Fog', '2026-02-01', 'single'],
  [90, 'הזיה', 'Reverie', '2026-02-01', 'single'],
  [91, 'פוירשטיין', 'Feuerstein', '2026-02-03', 'single'],
  [92, 'תסביך נחיתות קוונטי', 'Quantum Inferiority Complex', '2026-02-06', 'single'],
  [93, 'אמונת התמימים', 'Faith of the Innocents', '2026-02-10', 'single'],
  [94, 'מלחמות הדת', 'Wars of Religion', '2026-03-09', 'single'],
];

// ===== Books (ARKO trilogy — real data from uwleo.com) =====
const BOOKS = [
  {
    id: 'arko-1',
    title_he: 'ARKO: איחוד האפלה',
    title_en: 'ARKO: The Dark Union',
    subtitle_he: 'סדרת מדע בדיוני · ספר ראשון',
    subtitle_en: 'A Sci-Fi Adventure Series · Book One',
    desc_he: 'קבוצת בני נוער מגלים את התגלית החשובה ביותר בהיסטוריה העולמית, שנועדה להציל את המין האנושי...מעצמו. אריאל היידן בן ה-12 וחבריו מצטרפים אל הוריהם, חלק מהמדענים המובילים בעולם, למסע ליוקטן, שם ד"ר היידן עורך מחקר עבור ממשלת מקסיקו. בסיורם של הילדים באתרי המאיה הקדומים הסמוכים, הם מגלים מבנה דמוי מחשב מתקדם להפליא, שהוסתר במשך מיליוני שנים בבטן האדמה — והוא האחראי על העבר, ועל העתיד, של העולם כפי שאנו מכירים אותו.',
    desc_en: "A group of tweens unearth the most significant discovery in world history, designed to save the human species…from itself. Twelve-year-old Ariel Hyden and his friends accompany their parents, some of the world's top scientists, on a trip to the Yucatán where Dr. Hyden is conducting research for the Mexican government. On the kids' exploration of nearby old Mayan grounds, they discover an impossibly advanced computer-like structure hidden for millions of years in the bowels of the earth that is responsible for the past—and future—of the world as we know it.",
    amazon_url: 'https://www.amazon.com/dp/B09NB1S7LB',
    cover_url: 'https://uploads-ssl.webflow.com/618c35de072487acef0ce111/61a666579d842d49f0b91e68_ARKO%201%20Book%20mockup%20v3.png',
    reviews: [
      { source: 'Kirkus Reviews', quote_en: 'An engaging tale of reemerging dinosaurs and superb tween heroes.', quote_he: 'סיפור סוחף על דינוזאורים השבים לחיים וגיבורים מתבגרים מצוינים.' },
      { source: 'BookLife by Publishers Weekly', quote_en: 'ARKO: The Dark Union is an essential addition to the young adult library with dynamic characters, an emphasis on scientific realism, important themes for today\'s audiences, and an exciting story with enormous stakes.', quote_he: 'ARKO: איחוד האפלה היא תוספת חיונית לספריית הנוער, עם דמויות דינמיות, דגש על ריאליזם מדעי, נושאים חשובים לקהל של ימינו, וסיפור מותח עם סיכונים עצומים.' },
      { source: 'Online Book Club', quote_en: 'I give Arko a rating of 4 out of 4 stars. This book is delightful, subtly educative, brilliantly written, and an absolute gem.', quote_he: 'אני נותן ל-Arko דירוג של 4 מתוך 4 כוכבים. הספר מקסים, מחנך בעדינות, כתוב בברק ויהלום של ממש.' },
      { source: "Readers' Favorite", quote_en: "Fits the bill with its blend of Indiana Jones-style action and sci-fi thriller.", quote_he: 'עומד במשימה עם השילוב שלו בין אקשן בסגנון אינדיאנה ג\'ונס לבין מתח מדע בדיוני.' },
      { source: 'Midwest Book Review', quote_en: 'Both exciting and informative, perfect for school and entertainment alike.', quote_he: 'גם מרתק וגם מלמד, מושלם לבית הספר ולבידור כאחד.' },
      { source: "Children's Literature (Heidi Green)", quote_en: 'A fascinating first book in a genre-bending new series that draws upon sci-fi, religion, and philosophy and encourages readers to think big thoughts and ask big questions.', quote_he: 'ספר ראשון מרתק בסדרה חדשה החוצה ז\'אנרים, השואבת ממדע בדיוני, דת ופילוסופיה ומעודדת קוראים לחשוב מחשבות גדולות ולשאול שאלות גדולות.' },
    ],
  },
  {
    id: 'arko-2',
    title_he: 'ARKO: הסדר הקוסמי',
    title_en: 'ARKO: The Cosmic Order',
    subtitle_he: 'סדרת מדע בדיוני · ספר שני',
    subtitle_en: 'A Sci-Fi Adventure Series · Book Two',
    desc_he: 'הארקונוטים המתבגרים שבים, ושליחותם לקדם את האנושות נתקלת בהתנגדות קטלנית. חמש שנים חלפו מאז התגלית פורצת הדרך של הארקונוטים, ומשימתם — לשקם את כדור הארץ ולפתח טכנולוגיות שישפרו את יכולותיהם של בני האדם ובעלי החיים, כולל הדינוזאורים — פורחת. אבל לא כולם מתלהבים מהקידום, וקבוצת הנערים מוצאת את עצמה במשימת חילוץ בין-גלקטית של מנהיגם בן, ובקרב להציל את משימתם, את הפלנטה ואת עצמם.',
    desc_en: "The teen Arkonots are back and their mission to evolve humankind is being met with deadly opposition. Five years have passed since the Arkonots' world-changing discovery, and their mission of restoring the Earth and developing technology to enhance the capabilities of humans and animals, including dinosaurs, has flourished. But not everyone is on board with their advancements, and the group of teens find themselves on a galactic rescue mission for their leader Ben and in a battle to save their mission, the planet, and themselves.",
    amazon_url: 'https://www.amazon.com/dp/B09QLL1BFY',
    cover_url: 'https://uploads-ssl.webflow.com/618c35de072487acef0ce111/61a6665707d180e6c73d6ac7_ARKO%202%20Book%20mockup%20v3.png',
    reviews: [
      { source: 'Kirkus Reviews', quote_en: 'Memorable characters navigate this brisk, entertaining futuristic tale.', quote_he: 'דמויות בלתי-נשכחות מנווטות בתוך סיפור עתידני, סוחף ומשעשע.' },
      { source: 'BookLife by Publishers Weekly', quote_en: 'This upbeat, science-minded SF adventure pits eco-minded teens against the powers that be — and an intergalactic mystery.', quote_he: 'הרפתקת מדע בדיוני אופטימית ומדעית, המעמידה בני נוער שוחרי-סביבה מול הכוחות שמעליהם — ומול תעלומה בין-גלקטית.' },
      { source: 'Midwest Book Review', quote_en: 'Exciting sci-fi adventure steeped in humor and action.', quote_he: 'הרפתקת מדע בדיוני מותחת, ספוגה בהומור ובאקשן.' },
      { source: "Readers' Favorite", quote_en: 'U.W. Leo certainly knows how to tell a thrilling young adult tale.', quote_he: 'U.W. Leo יודע ללא ספק לספר סיפור נוער מותח.' },
    ],
  },
  {
    id: 'arko-3',
    title_he: 'ARKO: שחר הארקונוט',
    title_en: 'ARKO: Dawn of the Arkonot',
    subtitle_he: 'סדרת מדע בדיוני · ספר שלישי',
    subtitle_en: 'A Sci-Fi Adventure Series · Book Three',
    desc_he: 'הספר השלישי בטרילוגיית ARKO — סוגר את הסאגה של הארקונוטים המתבגרים, ויחד עמה את החקירה הגדולה של פלאי היקום, האחריות האנושית, ושאלות הבריאה והאל שמלוות את הסדרה כולה.',
    desc_en: 'The third book in the ARKO trilogy — closing the saga of the teen Arkonots, and with it the great inquiry into the wonders of the universe, human responsibility, and the questions of creation and God that run through the entire series.',
    amazon_url: '#',
    cover_url: null,
    cover_text: 'DAWN OF THE\nARKONOT',
    status_en: 'Coming Soon',
    status_he: 'בקרוב',
    reviews: [],
  },
];

function jsString(s) {
  if (s === null || s === undefined) return 'null';
  return '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

function jsonInline(s) {
  return JSON.stringify(s);
}

// ===== Generate ===========================================================
const titleByNum = Object.fromEntries(ARTICLES_META.map(([n, h]) => [n, h]));

const lines = [];
lines.push('// UW Leo articles index');
lines.push('// Auto-generated by scripts/rebuild_articles.js — do not edit by hand.');
lines.push('// Edit extracted/articles_he.json or extracted/translations_en.json then re-run.');
lines.push('window.UWLEO_ARTICLES = [');
for (const [num, title_he, title_en, date, source] of ARTICLES_META) {
  const heEntry = HE[String(num)];
  const enEntry = EN[String(num)];
  const body_he = cleanHe(heEntry?.text_he, [title_he, title_en]);
  const body_en = cleanEn(enEntry);
  const parts = [
    `num: ${num}`,
    `title_he: ${jsonInline(title_he)}`,
    `title_en: ${jsonInline(title_en)}`,
    `date: ${jsonInline(date)}`,
    `source: ${jsonInline(source)}`,
    `body_he: ${body_he === null ? 'null' : jsString(body_he)}`,
    `body_en: ${body_en === null ? 'null' : jsString(body_en)}`,
  ];
  lines.push('  { ' + parts.join(', ') + ' },');
}
lines.push('];');
lines.push('');
lines.push('window.UWLEO_BOOKS = ' + JSON.stringify(BOOKS, null, 2).replace(/\n/g, '\n') + ';');
lines.push('');

fs.writeFileSync(path.join(ROOT, 'data', 'articles.js'), lines.join('\n'), 'utf8');

const filledHe = ARTICLES_META.filter(([n]) => HE[n] && HE[n].text_he).length;
const filledEn = ARTICLES_META.filter(([n]) => EN[n]).length;
console.log(`✅ Rebuilt data/articles.js`);
console.log(`   Articles: ${ARTICLES_META.length}`);
console.log(`   With body_he: ${filledHe}`);
console.log(`   With body_en: ${filledEn}`);
console.log(`   Books: ${BOOKS.length}`);
