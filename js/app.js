/**
 * app.js
 * Tətbiqin başlama nöqtəsi.
 * - Profil yoxlama → yönləndirmə
 * - Bottom nav işə salma
 * - Aktiv nav item göstərmə
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Profil yoxla ─────────────────────────── */
  // index.html açıldıqda profil varmı yoxlanır
  // Bu funksiya index.html-də çağrılır
  if (typeof initIndexRedirect === 'function') {
    initIndexRedirect();
  }

  /* ── Bottom nav ───────────────────────────── */
  initBottomNav();

  /* ── Aktiv səhifəni işarələ ───────────────── */
  highlightActiveNav();

});

/* ── Profil yoxla → yönləndir ─────────────── */
function initIndexRedirect() {
  if (Storage.hasProfile()) {
    window.location.replace('dashboard.html');
  } else {
    window.location.replace('onboarding.html');
  }
}

/* ── Bottom nav qurulumu ──────────────────── */
function initBottomNav() {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item, .nav-add');
    if (!item) return;

    const page = item.dataset.page;
    if (page) {
      window.location.href = page + '.html';
    }
  });
}

/* ── Aktiv nav item ───────────────────────── */
function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop().replace('.html','');
  const items = document.querySelectorAll('.nav-item[data-page]');
  items.forEach(item => {
    item.classList.toggle('active', item.dataset.page === current);
  });
}

/* ── Global köməkçi: back button ─────────── */
function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    history.back();
  } else {
    window.location.href = 'dashboard.html';
  }
}
