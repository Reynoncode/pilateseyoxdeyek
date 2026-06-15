/**
 * profile.js
 * Profil məlumatlarını göstər, redaktə et, planı yenidən hesabla.
 */

/* ── Init ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const profile = Storage.getProfile();
  if (!profile) {
    window.location.replace('onboarding.html');
    return;
  }

  loadProfileForm(profile);
  renderCurrentPlan(profile);
  initProfilePills(profile);
});

/* ── Formu doldur ─────────────────────────── */
function loadProfileForm(profile) {
  _setVal('profileName',         profile.name         || '');
  _setVal('profileAge',          profile.age          || '');
  _setVal('profileHeight',       profile.height       || '');
  _setVal('profileWeight',       profile.weight       || '');
  _setVal('profileGoalWeight',   profile.goalWeight   || '');
}

function _setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

/* ── Pill qrupları ────────────────────────── */
function initProfilePills(profile) {
  // Cins
  const genderGroup = document.getElementById('profileGenderGroup');
  if (genderGroup) {
    UI.initPillGroup(genderGroup, () => {});
    UI.selectPill(genderGroup, profile.gender || 'male');
  }

  // Fəaliyyət
  const actGroup = document.getElementById('profileActivityGroup');
  if (actGroup) {
    actGroup.querySelectorAll('.activity-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.val === profile.activityLevel);
      btn.addEventListener('click', () => {
        actGroup.querySelectorAll('.activity-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // Hədəf
  const goalGroup = document.getElementById('profileGoalGroup');
  if (goalGroup) {
    goalGroup.querySelectorAll('.goal-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.val === profile.goal);
      btn.addEventListener('click', () => {
        goalGroup.querySelectorAll('.goal-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
}

/* ── Cari planı göstər ────────────────────── */
function renderCurrentPlan(profile) {
  _setText('planKcal',    (profile.dailyTarget || '–') + ' kkal');
  _setText('planBMR',     'BMR ' + (profile.bmr  || '–'));
  _setText('planTDEE',    'TDEE ' + (profile.tdee || '–'));
  _setText('planProtein', (profile.macros?.protein || '–') + ' q');
  _setText('planCarb',    (profile.macros?.carbs   || '–') + ' q');
  _setText('planFat',     (profile.macros?.fat     || '–') + ' q');
  _setText('planWater',   (profile.macros?.water   || '–') + ' L');
}

function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── Saxla ────────────────────────────────── */
function saveProfile() {
  // Sahələri oxu
  const name       = document.getElementById('profileName')?.value.trim();
  const age        = parseInt(document.getElementById('profileAge')?.value);
  const height     = parseFloat(document.getElementById('profileHeight')?.value);
  const weight     = parseFloat(document.getElementById('profileWeight')?.value);
  const goalWeight = parseFloat(document.getElementById('profileGoalWeight')?.value);

  const genderGroup  = document.getElementById('profileGenderGroup');
  const actGroup     = document.getElementById('profileActivityGroup');
  const goalGroup    = document.getElementById('profileGoalGroup');

  const gender        = UI.getActivePill(genderGroup);
  const activityLevel = actGroup?.querySelector('.activity-item.active')?.dataset.val;
  const goal          = goalGroup?.querySelector('.goal-item.active')?.dataset.val;

  // Validation
  if (!name)                         { UI.toast('Ad daxil et'); return; }
  if (!age || age < 10 || age > 100) { UI.toast('Düzgün yaş daxil et'); return; }
  if (!height || height < 100 || height > 250) { UI.toast('Düzgün boy daxil et (100–250 sm)'); return; }
  if (!weight || weight < 30  || weight > 300) { UI.toast('Düzgün çəki daxil et'); return; }
  if (!goalWeight || goalWeight < 30 || goalWeight > 300) { UI.toast('Hədəf çəki daxil et'); return; }
  if (!gender)        { UI.toast('Cins seç'); return; }
  if (!activityLevel) { UI.toast('Fəaliyyət səviyyəsini seç'); return; }
  if (!goal)          { UI.toast('Hədəf seç'); return; }

  // Yeni plan hesabla
  const updated = { name, age, height, weight, goalWeight, gender, activityLevel, goal };
  const result  = Calculator.calcAll(updated);

  Storage.saveProfile({
    ...updated,
    bmr:         result.bmr,
    tdee:        result.tdee,
    dailyTarget: result.dailyTarget,
    macros:      result.macros,
  });

  // UI yenilə
  renderCurrentPlan(Storage.getProfile());
  UI.toast('✅ Profil yadda saxlandı');
}

/* ── Hesabı sıfırla ───────────────────────── */
function resetAccount() {
  if (!confirm('Bütün məlumatlar silinəcək. Davam etmək istəyirsən?')) return;
  Storage.clearAll();
  window.location.replace('onboarding.html');
}
