// ── Language Detection ──
const LANGS = ['en', 'zh', 'zht'];

const ACTIVITY_ICONS = ['🤿', '🎣', '⛳', '🏝️'];

function detectLang() {
  const saved = localStorage.getItem('rc_lang');
  if (saved && LANGS.includes(saved)) return saved;
  const b = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (b.startsWith('zh-tw') || b.startsWith('zh-hk') || b.startsWith('zh-mo')) return 'zht';
  if (b.startsWith('zh')) return 'zh';
  return 'en';
}

function setLang(lang) {
  if (!LANGS.includes(lang)) lang = 'en';
  localStorage.setItem('rc_lang', lang);
  applyTranslations(lang);
  updateLangButtons(lang);
}

function updateLangButtons(lang) {
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });
}

function applyTranslations(lang) {
  const t = T[lang] || T.en;

  document.title = t.pageTitle;
  setMeta('description', t.metaDesc);

  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (t[key] !== undefined && typeof t[key] === 'string') {
      el.innerHTML = t[key];
    }
  });

  document.querySelectorAll('[data-t-ph]').forEach(el => {
    const key = el.dataset.tPh;
    if (t[key]) el.placeholder = t[key];
  });

  const sel = document.getElementById('inquiry-select');
  if (sel && t.formInquiryOpts) {
    sel.innerHTML = t.formInquiryOpts.map(o => `<option>${o}</option>`).join('');
  }

  renderActivities(t);

  const htmlEl = document.documentElement;
  htmlEl.lang = lang === 'zh' ? 'zh-Hans' : lang === 'zht' ? 'zh-Hant' : 'en';
}

function renderActivities(t) {
  const grid = document.getElementById('activities-grid');
  if (!grid) return;

  const keys = [
    { title: 'act1Title', desc: 'act1Desc', link: 'act1Link', icon: ACTIVITY_ICONS[0] },
    { title: 'act2Title', desc: 'act2Desc', link: 'act2Link', icon: ACTIVITY_ICONS[1] },
    { title: 'act3Title', desc: 'act3Desc', link: 'act3Link', icon: ACTIVITY_ICONS[2] },
    { title: 'act4Title', desc: 'act4Desc', link: 'act4Link', icon: ACTIVITY_ICONS[3] },
  ];

  grid.innerHTML = keys.map(k => {
    const isContact = t[k.link] === '#contact';
    const ctaText = isContact ? t.actCtaContact : t.actCta;
    return `
      <a href="${t[k.link]}" class="activity-card" ${!isContact ? 'target="_blank"' : ''}>
        <span class="activity-icon">${k.icon}</span>
        <div class="activity-title">${t[k.title] || ''}</div>
        <p class="activity-desc">${t[k.desc] || ''}</p>
        <span class="activity-cta">${ctaText || ''}</span>
      </a>`;
  }).join('');
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute('content', content);
}

// ── Nav scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 20);
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08 });

// ── FAQ ──
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
  });
}

// ── Form ──
function submitForm(e) {
  e.preventDefault();
  const btn = e.target;
  const lang = localStorage.getItem('rc_lang') || 'en';
  btn.textContent = (T[lang] || T.en).formSent;
  btn.style.background = 'var(--green)';
  btn.disabled = true;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const lang = detectLang();
  setLang(lang);
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  initFaq();
});
