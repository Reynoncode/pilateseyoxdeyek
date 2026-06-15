/**
 * dashboard.js
 * Ana ekran: kalori ring, makro barlar, su, yemək siyahısı.
 */

document.addEventListener('DOMContentLoaded', initDashboard);

function initDashboard() {
  const profile = Storage.getProfile();
  if (!profile) {
    window.location.replace('onboarding.html');
    return;
  }

  renderGreeting(profile);
  renderDate();
  renderDayData();
}

/* ── Salam ────────────────────────────────── */
function renderGreeting(profile) {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Sabahınız xeyir' : hour < 18 ? 'Günortanız xeyir' : 'Axşamınız xeyir';
  el.textContent = greet + (profile.name ? ', ' + profile.name : '') + ' 👋';
}

/* ── Tarix ────────────────────────────────── */
function renderDate() {
  const el = document.getElementById('todayDate');
  if (!el) return;
  el.textContent = UI.fmtDate(Storage.todayStr());
}

/* ── Günlük məlumatlar ────────────────────── */
function renderDayData() {
  const profile  = Storage.getProfile();
  const today    = Storage.todayStr();
  const dayLog   = Storage.getDayLog(today);
  const totals   = Calculator.sumDay(dayLog.meals);
  const macros   = profile.macros || {};
  const target   = profile.dailyTarget || 2000;

  /* Kalori ring */
  const ringWrap = document.querySelector('.calorie-ring-wrap');

  const ringFill     = document.getElementById('ringFill');
  const ringRemaining = document.getElementById('ringRemaining');
  const ringLabel    = document.querySelector('.ring-label');

  if (ringFill) {
    const r     = 52;
    const circ  = 2 * Math.PI * r;
    const ratio = Math.min(totals.calories / (target || 1), 1);
    const offset = circ - ratio * circ;
    ringFill.style.strokeDasharray  = circ;
    ringFill.style.strokeDashoffset = offset;

    if (ratio < 0.8)      ringFill.style.stroke = 'var(--clr-primary)';
    else if (ratio < 1.0) ringFill.style.stroke = 'var(--clr-warning, #f59e0b)';
    else                  ringFill.style.stroke = 'var(--clr-danger, #ef4444)';
  }

  if (ringRemaining) {
    const rem = Math.max(0, target - totals.calories);
    ringRemaining.textContent = UI.fmtNum(rem);
  }
  if (ringLabel) {
    ringLabel.textContent = totals.calories >= target ? 'Hədəf doldu!' : 'qalıb';
  }

  /* Stat rəqəmləri */
  const statGoal = document.getElementById('statGoal');
  const statConsumed = document.getElementById('statConsumed');
  if (statGoal) statGoal.textContent = UI.fmtNum(target);
  if (statConsumed) statConsumed.textContent = UI.fmtNum(totals.calories);

  /* Makro barlar */
  renderMacroBar('macroProtein', 'barProtein', totals.protein,   macros.protein, 'q');
  renderMacroBar('macroCarb',    'barCarb',    totals.carbs,     macros.carbs,   'q');
  renderMacroBar('macroFat',     'macroFat',   totals.fat,       macros.fat,     'q');

  /* Su */
  const waterGlasses = dayLog.water || 0;
  const waterLiters  = (waterGlasses * 0.25).toFixed(1);
  const waterTarget  = macros.water || 2;
  const waterPct     = Math.min(100, Math.round((parseFloat(waterLiters) / waterTarget) * 100));

  const macroWaterEl = document.getElementById('macroWater');
  const barWaterEl   = document.getElementById('barWater');
  if (macroWaterEl) macroWaterEl.textContent = waterLiters + ' / ' + waterTarget + ' L';
  if (barWaterEl)   barWaterEl.style.width   = waterPct + '%';

  /* Yemək siyahısı */
  renderMealList(dayLog.meals);
}

function renderMacroBar(valElId, barElId, value, target, unit) {
  const valEl = document.getElementById(valElId);
  const barEl = document.getElementById(barElId);
  if (valEl) valEl.textContent = Math.round(value) + ' / ' + (target || '–') + ' ' + unit;
  if (barEl) {
    const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
    barEl.style.width = pct + '%';
  }
}

/* ── Yemək siyahısı ───────────────────────── */
function renderMealList(meals) {
  const list = document.getElementById('mealList');
  if (!list) return;

  if (!meals || meals.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <div class="empty-text">Hələ yemək yoxdur</div>
        <div class="empty-sub">Aşağıdakı + düyməsinə bas</div>
      </div>`;
    return;
  }

  // Son 5 yemək (ən son üstdə)
  const recent = [...meals].reverse().slice(0, 5);
  list.innerHTML = recent.map(m => `
    <div class="meal-item">
      <div class="meal-item-left">
        <div class="meal-item-name">${UI.esc(m.foodName || m.name || '–')}</div>
        <div class="meal-item-meta">${UI.fmtMealType(m.mealType)} · ${m.grams || '–'}q</div>
      </div>
      <div class="meal-item-kcal">${UI.fmtNum(m.calories)} kkal</div>
    </div>
  `).join('');
}

/* ── Su əlavə et ──────────────────────────── */
function addWater(liters) {
  const today = Storage.todayStr();
  const day   = Storage.getDayLog(today);
  const glasses = liters / 0.25; // 1 stəkan = 250ml
  Storage.updateWater(today, (day.water || 0) + glasses);
  renderDayData();
  UI.toast('💧 Su əlavə edildi');
}
