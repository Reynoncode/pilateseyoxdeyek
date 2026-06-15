/**
 * onboarding.js
 * 5 addımlı ilkin qurulum axını.
 * Hər addımdan data toplanır, 5-ci addımda plan hesablanıb göstərilir.
 */

/* ── State ────────────────────────────────── */
const state = {
  name:           '',
  age:            null,
  gender:         null,
  height:         null,
  weight:         null,
  goalWeight:     null,
  activityLevel:  null,
  goal:           null,
};

const TOTAL_STEPS = 5;
let currentStep = 1;

/* ── DOM hazır ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showStep(1);
  initActivityGroup();
  initGoalGroup();
});

/* ── Addım göstər / gizlət ────────────────── */
function showStep(n) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const card = document.getElementById('step' + i);
    if (card) card.classList.toggle('active', i === n);
  }
  currentStep = n;
  updateProgress(n);
}

function updateProgress(n) {
  const bar = document.getElementById('progressBar');
  const lbl = document.getElementById('stepLabel');
  const labels = [
    'Addım 1/5 · Sən kimsən',
    'Addım 2/5 · Bədən ölçüləri',
    'Addım 3/5 · Fəaliyyət',
    'Addım 4/5 · Hədəf',
    'Addım 5/5 · Planın',
  ];
  if (bar) bar.style.width = ((n / TOTAL_STEPS) * 100) + '%';
  if (lbl) lbl.textContent = labels[n - 1] || '';
}

/* ── Növbəti addım ────────────────────────── */
function nextStep(from) {
  if (!validateStep(from)) return;
  collectStep(from);

  if (from === 4) {
    buildPlan();
  }
  showStep(from + 1);
}

function prevStep(from) {
  if (from > 1) showStep(from - 1);
}

/* ── Validation ───────────────────────────── */
function validateStep(n) {
  if (n === 1) {
    const name = document.getElementById('name').value.trim();
    const age  = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('#genderGroup .pill-btn.active')?.dataset.val;

    if (!name)                       { UI.toast('Ad daxil et'); return false; }
    if (!age || age < 10 || age > 100) { UI.toast('Düzgün yaş daxil et'); return false; }
    if (!gender)                     { UI.toast('Cins seç'); return false; }
  }

  if (n === 2) {
    const h = parseFloat(document.getElementById('height').value);
    const w = parseFloat(document.getElementById('currentWeight').value);
    const t = parseFloat(document.getElementById('targetWeight').value);

    if (!h || h < 100 || h > 250) { UI.toast('Düzgün boy daxil et (100–250 sm)'); return false; }
    if (!w || w < 30  || w > 300) { UI.toast('Düzgün çəki daxil et'); return false; }
    if (!t || t < 30  || t > 300) { UI.toast('Hədəf çəki daxil et'); return false; }
  }

  if (n === 3) {
    const act = document.querySelector('#activityGroup .activity-item.active')?.dataset.val;
    if (!act) { UI.toast('Fəaliyyət səviyyəsini seç'); return false; }
  }

  if (n === 4) {
    const goal = document.querySelector('#goalGroup .goal-item.active')?.dataset.val;
    if (!goal) { UI.toast('Hədəfini seç'); return false; }
  }

  return true;
}

/* ── Data topla ───────────────────────────── */
function collectStep(n) {
  if (n === 1) {
    state.name   = document.getElementById('name').value.trim();
    state.age    = parseInt(document.getElementById('age').value);
    state.gender = document.querySelector('#genderGroup .pill-btn.active').dataset.val;
  }
  if (n === 2) {
    state.height     = parseFloat(document.getElementById('height').value);
    state.weight     = parseFloat(document.getElementById('currentWeight').value);
    state.goalWeight = parseFloat(document.getElementById('targetWeight').value);
  }
  if (n === 3) {
    state.activityLevel = document.querySelector('#activityGroup .activity-item.active').dataset.val;
  }
  if (n === 4) {
    state.goal = document.querySelector('#goalGroup .goal-item.active').dataset.val;
  }
}

/* ── Plan qur ─────────────────────────────── */
function buildPlan() {
  const result = Calculator.calcAll(state);

  document.getElementById('planKcal').textContent    = result.dailyTarget + ' kkal';
  document.getElementById('planProtein').textContent = result.macros.protein + ' q';
  document.getElementById('planCarb').textContent    = result.macros.carbs   + ' q';
  document.getElementById('planFat').textContent     = result.macros.fat     + ' q';
  document.getElementById('planWater').textContent   = result.macros.water   + ' L';
  document.getElementById('planBMR').textContent     = 'BMR ' + result.bmr;
  document.getElementById('planTDEE').textContent    = 'TDEE ' + result.tdee;
}

/* ── Bitir ────────────────────────────────── */
function finishOnboarding() {
  const result = Calculator.calcAll(state);

  Storage.saveProfile({
    ...state,
    bmr:         result.bmr,
    tdee:        result.tdee,
    dailyTarget: result.dailyTarget,
    macros:      result.macros,
    createdAt:   new Date().toISOString(),
  });

  window.location.replace('dashboard.html');
}

/* ── Fəaliyyət siyahısı ───────────────────── */
function initActivityGroup() {
  const group = document.getElementById('activityGroup');
  if (!group) return;
  group.querySelectorAll('.activity-item').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.activity-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ── Hədəf siyahısı ───────────────────────── */
function initGoalGroup() {
  const group = document.getElementById('goalGroup');
  if (!group) return;
  group.querySelectorAll('.goal-item').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.goal-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ── Pill qrupu (cins) ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const genderGroup = document.getElementById('genderGroup');
  if (genderGroup) {
    UI.initPillGroup(genderGroup, () => {});
  }
});
