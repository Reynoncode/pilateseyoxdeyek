/**
 * log.js
 * Keçmiş günlər: tarix seçimi, günlük xülasə, yemək siyahısı, silmə.
 */

/* ── State ────────────────────────────────── */
let selectedDate = Storage.todayStr();
const DAYS_TO_SHOW = 7;

/* ── Init ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const profile = Storage.getProfile();
  if (!profile) {
    window.location.replace('onboarding.html');
    return;
  }

  renderDateTabs();
  renderLogForDate(selectedDate);
});

/* ── Tarix tabları ────────────────────────── */
function renderDateTabs() {
  const container = document.getElementById('dateTabs');
  if (!container) return;

  const days = Storage.lastNDays(DAYS_TO_SHOW);

  container.innerHTML = days.map(dateStr => `
    <button
      class="date-tab ${dateStr === selectedDate ? 'active' : ''}"
      data-date="${dateStr}"
      onclick="selectDate('${dateStr}')"
    >
      <span class="date-tab__day">${UI.fmtDateShort(dateStr)}</span>
      <span class="date-tab__dot ${hasMeals(dateStr) ? 'has-data' : ''}"></span>
    </button>
  `).join('');
}

function hasMeals(dateStr) {
  const day = Storage.getDayLog(dateStr);
  return day.meals && day.meals.length > 0;
}

function selectDate(dateStr) {
  selectedDate = dateStr;
  renderDateTabs();
  renderLogForDate(dateStr);
}

/* ── Günlük loq render ────────────────────── */
function renderLogForDate(dateStr) {
  const profile = Storage.getProfile();
  const dayLog  = Storage.getDayLog(dateStr);
  const totals  = Calculator.sumDay(dayLog.meals);
  const target  = profile.dailyTarget || 2000;
  const macros  = profile.macros || {};

  renderLogHeader(dateStr);
  renderLogSummary(totals, target, macros, dayLog.water || 0);
  renderLogMeals(dayLog.meals, dateStr);
}

/* ── Başlıq ───────────────────────────────── */
function renderLogHeader(dateStr) {
  const el = document.getElementById('logDateTitle');
  if (el) el.textContent = UI.fmtDate(dateStr);
}

/* ── Xülasə kartı ─────────────────────────── */
function renderLogSummary(totals, target, macros, waterGlasses) {
  const calEl  = document.getElementById('logCalories');
  const pctEl  = document.getElementById('logCaloriePct');
  const barEl  = document.getElementById('logCalorieBar');

  const waterL = (waterGlasses * 0.25).toFixed(1);

  if (calEl)  calEl.textContent  = UI.fmtNum(totals.calories) + ' / ' + UI.fmtNum(target) + ' kkal';
  if (pctEl)  pctEl.textContent  = Calculator.pct(totals.calories, target) + '%';
  if (barEl)  barEl.style.width  = Math.min(100, Calculator.pct(totals.calories, target)) + '%';

  // Makrolar
  _setMacroLine('logProtein', totals.protein,  macros.protein, 'q');
  _setMacroLine('logCarbs',   totals.carbs,    macros.carbs,   'q');
  _setMacroLine('logFat',     totals.fat,      macros.fat,     'q');
  _setMacroLine('logWater',   parseFloat(waterL), macros.water, 'L');
}

function _setMacroLine(id, value, target, unit) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = (unit === 'L' ? value : Math.round(value))
    + ' / ' + (target || '–') + ' ' + unit;
}

/* ── Yemək siyahısı ───────────────────────── */
function renderLogMeals(meals, dateStr) {
  const list = document.getElementById('logMealList');
  if (!list) return;

  if (!meals || meals.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">Bu gün heç nə yeyilməyib</div>
      </div>`;
    return;
  }

  // Öğünlərə görə qruplaşdır
  const groups = { breakfast: [], lunch: [], dinner: [], snack: [] };
  meals.forEach(m => {
    const key = groups[m.mealType] ? m.mealType : 'snack';
    groups[key].push(m);
  });

  let html = '';
  Object.entries(groups).forEach(([type, items]) => {
    if (items.length === 0) return;
    const groupTotal = Calculator.sumDay(items);
    html += `
      <div class="meal-group">
        <div class="meal-group__header">
          <span class="meal-group__name">${UI.fmtMealType(type)}</span>
          <span class="meal-group__kcal">${UI.fmtNum(groupTotal.calories)} kkal</span>
        </div>
        ${items.map(m => renderMealItem(m, dateStr)).join('')}
      </div>`;
  });

  list.innerHTML = html;
}

function renderMealItem(m, dateStr) {
  return `
    <div class="meal-item" data-id="${m.id}">
      <div class="meal-item-left">
        <div class="meal-item-name">${UI.esc(m.foodName || m.name || '–')}</div>
        <div class="meal-item-meta">${m.grams || '–'}q · P:${Math.round(m.protein||0)}q K:${Math.round(m.carbs||0)}q Y:${Math.round(m.fat||0)}q</div>
      </div>
      <div class="meal-item-right">
        <div class="meal-item-kcal">${UI.fmtNum(m.calories)} kkal</div>
        <button class="btn-icon btn-delete" onclick="deleteMealEntry('${dateStr}', '${m.id}')" title="Sil">🗑️</button>
      </div>
    </div>`;
}

/* ── Yemək sil ────────────────────────────── */
function deleteMealEntry(dateStr, mealId) {
  if (!confirm('Bu yeməyi silmək istəyirsən?')) return;
  Storage.deleteMeal(dateStr, mealId);
  renderLogForDate(dateStr);
  renderDateTabs(); // dot yenilənsin
  UI.toast('Yemək silindi');
}

/* ── Statistika (son 7 gün) ───────────────── */
function renderWeekStats() {
  const statsEl = document.getElementById('weekStats');
  if (!statsEl) return;

  const days    = Storage.lastNDays(7);
  const profile = Storage.getProfile();
  const target  = profile?.dailyTarget || 2000;

  const rows = days.map(dateStr => {
    const day    = Storage.getDayLog(dateStr);
    const totals = Calculator.sumDay(day.meals);
    const pct    = Calculator.pct(totals.calories, target);
    return `
      <div class="week-row">
        <span class="week-row__date">${UI.fmtDateShort(dateStr)}</span>
        <div class="week-row__bar-wrap">
          <div class="week-row__bar" style="width:${Math.min(100,pct)}%"></div>
        </div>
        <span class="week-row__kcal">${UI.fmtNum(totals.calories)}</span>
      </div>`;
  });

  statsEl.innerHTML = rows.join('');
}
