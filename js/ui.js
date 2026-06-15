/**
 * ui.js
 * DOM köməkçiləri, toast, animasiya, format funksiyaları.
 */

const UI = (() => {

  /* ── DOM Seçicilər ────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Format köməkçiləri ───────────────────── */

  /** 1234 → "1 234" */
  function fmtNum(n) {
    return Math.round(n).toLocaleString('az-AZ');
  }

  /** 0.9 → "0.9 L", 2.4 → "2.4 L" */
  function fmtWater(glasses) {
    const liters = (glasses * 0.25).toFixed(1);
    return liters + ' L';
  }

  /** "2025-06-15" → "15 İyun, Bazar ertəsi" */
  function fmtDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });
  }

  /** "2025-06-15" → "Bu gün" / "Dünən" / "15 İyun" */
  function fmtDateShort(dateStr) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Bu gün';
    if (dateStr === yesterday) return 'Dünən';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
  }

  /** Öğün adı */
  const MEAL_LABELS = {
    breakfast: 'Səhər yeməyi',
    lunch:     'Nahar',
    dinner:    'Axşam yeməyi',
    snack:     'Snack',
  };

  function fmtMealType(type) {
    return MEAL_LABELS[type] || type;
  }

  /* ── Toast ────────────────────────────────── */
  let _toastTimer = null;

  function toast(msg, duration = 2500) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  }

  /* ── Progress bar ─────────────────────────── */
  function setProgress(barEl, step, total) {
    const pct = Math.round((step / total) * 100);
    const fill = barEl.querySelector('.progress-bar__fill');
    if (fill) fill.style.width = pct + '%';
  }

  /* ── Dairəvi kalori ring (SVG) ────────────── */
  /**
   * @param {Element} container - .ring-wrap elementi
   * @param {number}  consumed  - yeyilmiş kalori
   * @param {number}  target    - hədəf kalori
   */
  function updateRing(container, consumed, target) {
    const fillEl   = container.querySelector('.ring-fill');
    const numEl    = container.querySelector('.ring-center__number');
    const labelEl  = container.querySelector('.ring-center__label');

    if (!fillEl) return;

    const radius = parseFloat(fillEl.getAttribute('r') || 54);
    const circ   = 2 * Math.PI * radius;
    const ratio  = Math.min(consumed / (target || 1), 1);
    const offset = circ - ratio * circ;

    fillEl.style.strokeDasharray  = circ;
    fillEl.style.strokeDashoffset = offset;

    const remaining = Math.max(0, target - consumed);
    if (numEl)   numEl.textContent  = fmtNum(remaining);
    if (labelEl) labelEl.textContent = consumed >= target ? 'Hədəf doldu!' : 'kkal qalıb';

    // Rəng dəyişimi: yaşıl → sarı → qırmızı
    if (ratio < 0.8)       fillEl.style.stroke = 'var(--clr-primary-dark)';
    else if (ratio < 1.0)  fillEl.style.stroke = 'var(--clr-warning)';
    else                   fillEl.style.stroke = 'var(--clr-danger)';
  }

  /* ── Makro mini progress bar ──────────────── */
  function updateMacroBar(container, value, target) {
    const bar = container.querySelector('.macro-mini-fill');
    if (!bar) return;
    const pct = Math.min(100, Math.round((value / (target || 1)) * 100));
    bar.style.width = pct + '%';
  }

  /* ── Pill seçim qrupu ─────────────────────── */
  /**
   * Pill düymələrinə click handler əlavə et.
   * @param {Element} groupEl - .pill-group
   * @param {Function} onChange - (value) => void
   */
  function initPillGroup(groupEl, onChange) {
    const pills = $$('.pill-btn', groupEl);
    pills.forEach(btn => {
      btn.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        onChange && onChange(btn.dataset.value);
      });
    });
  }

  /** Pill qrupunda müəyyən dəyəri seç */
  function selectPill(groupEl, value) {
    const pills = $$('.pill-btn', groupEl);
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.value === value);
    });
  }

  /** Aktiv pill dəyərini qaytar */
  function getActivePill(groupEl) {
    const active = $('.pill-btn.active', groupEl);
    return active ? active.dataset.value : null;
  }

  /* ── Input validation vizuallığı ─────────── */
  function setInputError(inputEl, msg) {
    inputEl.classList.add('error');
    const errEl = inputEl.closest('.form-group')?.querySelector('.form-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }

  function clearInputError(inputEl) {
    inputEl.classList.remove('error');
    const errEl = inputEl.closest('.form-group')?.querySelector('.form-error');
    if (errEl) errEl.classList.remove('visible');
  }

  /* ── Səhifə keçid animasiyası ─────────────── */
  function animateIn(el) {
    el.classList.remove('page-enter');
    void el.offsetWidth; // reflow
    el.classList.add('page-enter');
  }

  /* ── HTML escape ──────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ── Debounce ─────────────────────────────── */
  function debounce(fn, ms = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  /* ── Public API ───────────────────────────── */
  return {
    $, $$,
    fmtNum, fmtWater, fmtDate, fmtDateShort, fmtMealType,
    toast,
    setProgress,
    updateRing,
    updateMacroBar,
    initPillGroup, selectPill, getActivePill,
    setInputError, clearInputError,
    animateIn,
    esc,
    debounce,
    MEAL_LABELS,
  };

})();
