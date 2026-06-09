// rebuild_articles.js — regenerate data/articles.js from the v2 corpus.
//
// Sources:
//   scripts/articles_meta_v2.json     → titles (HE + EN) per article
//   extracted/articles_v2.json        → Hebrew body text from .docx files
//   extracted/translations_en.json    → English translations (legacy file;
//                                         keys are article num as string)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const META = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'articles_meta_v2.json'), 'utf8'));
const V2   = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'articles_v2.json'), 'utf8'));
const EN   = fs.existsSync(path.join(ROOT, 'extracted', 'translations_en.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted', 'translations_en.json'), 'utf8'))
  : {};

function cleanHe(raw) {
  if (!raw) return null;
  let t = raw.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return t || null;
}
function cleanEn(raw) {
  if (!raw) return null;
  return raw.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() || null;
}

// ===== Books (ARKO trilogy) =====
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
      { source: "Children's Literature (Heidi Green)", quote_en: 'A fascinating first book in a genre-bending new series that draws upon sci-fi, religion, and philosophy and encourages readers to think big thoughts and ask big questions.', quote_he: 'ספר ראשון מרתק בסדרה חדשה החוצה ז\'אנרים, השואבת ממדע בדיוני, דת ופילוסופיה ומעודדת קוראים לחשוב מחשבות גדולות ולשאול שאלות גדולות.' }
    ]
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
      { source: "Readers' Favorite", quote_en: 'U.W. Leo certainly knows how to tell a thrilling young adult tale.', quote_he: 'U.W. Leo יודע ללא ספק לספר סיפור נוער מותח.' }
    ]
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
    reviews: []
  }
];

function jsString(s) {
  if (s === null || s === undefined) return 'null';
  return '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}
function jsonInline(s) { return JSON.stringify(s); }

const numbers = Object.keys(META).map(Number).sort((a, b) => a - b);
const lines = [];
lines.push('// UW Leo articles index');
lines.push('// Auto-generated by scripts/rebuild_articles.js — do not edit by hand.');
lines.push('window.UWLEO_ARTICLES = [');

let withHe = 0, withEn = 0;
for (const num of numbers) {
  const meta = META[String(num)];
  const v2 = V2[String(num)];
  const enTrans = EN[String(num)];

  const date = v2?.date_in_doc || null;
  const body_he = cleanHe(v2?.body_he);
  const body_en = cleanEn(enTrans);
  const source = num <= 35 ? 'bundle-1' : num <= 75 ? 'bundle-2' : 'single';

  if (body_he) withHe++;
  if (body_en) withEn++;

  const parts = [
    `num: ${num}`,
    `title_he: ${jsonInline(meta.title_he)}`,
    `title_en: ${jsonInline(meta.title_en)}`,
    `date: ${jsonInline(date)}`,
    `source: ${jsonInline(source)}`,
    `body_he: ${body_he === null ? 'null' : jsString(body_he)}`,
    `body_en: ${body_en === null ? 'null' : jsString(body_en)}`
  ];
  lines.push('  { ' + parts.join(', ') + ' },');
}
lines.push('];');
lines.push('');
lines.push('window.UWLEO_BOOKS = ' + JSON.stringify(BOOKS, null, 2) + ';');
lines.push('');

fs.writeFileSync(path.join(ROOT, 'data', 'articles.js'), lines.join('\n'), 'utf8');

console.log(`✅ Rebuilt data/articles.js`);
console.log(`   Articles: ${numbers.length}`);
console.log(`   With body_he: ${withHe}`);
console.log(`   With body_en: ${withEn}`);
console.log(`   Books: ${BOOKS.length}`);
