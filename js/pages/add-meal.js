/**
 * add-meal.js
 * Yemək axtarışı, seçim, porsiya, əl ilə əlavə.
 */

let selectedFood  = null;
let currentMealType = 'breakfast';

document.addEventListener('DOMContentLoaded', () => {
  initMealTypePills();
  initSearch();
  setDefaultMealType();
});

/* ── Öyün pill seçimi ─────────────────────── */
function initMealTypePills() {
  const group = document.getElementById('mealTypeGroup');
  if (!group) return;
  group.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMealType = btn.dataset.val;
    });
  });
}

function setDefaultMealType() {
  const hour = new Date().getHours();
  let def = 'breakfast';
  if (hour >= 11 && hour < 15) def = 'lunch';
  else if (hour >= 15 && hour < 20) def = 'dinner';
  else if (hour >= 20) def = 'snack';

  currentMealType = def;
  const group = document.getElementById('mealTypeGroup');
  if (!group) return;
  group.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.val === def);
  });
}

/* ── Axtarış ──────────────────────────────── */
function initSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  if (!input) return;

  const doSearch = UI.debounce(query => {
    if (!query) {
      document.getElementById('searchResults').innerHTML = '';
      return;
    }
    const results = FoodDB.search(query);
    renderResults(results, query);
  }, 250);

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (clearBtn) clearBtn.style.display = q ? '' : 'none';
    doSearch(q);
  });
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  if (input) { input.value = ''; input.focus(); }
  if (clearBtn) clearBtn.style.display = 'none';
  document.getElementById('searchResults').innerHTML = '';
}

function renderResults(foods, query) {
  const list = document.getElementById('searchResults');
  if (!list) return;

  if (!foods || foods.length === 0) {
    list.innerHTML = `<div class="search-empty">«${UI.esc(query)}» üçün nəticə tapılmadı</div>`;
    return;
  }

  list.innerHTML = foods.slice(0, 12).map(f => `
    <div class="search-result-item" onclick="selectFood('${f.id}')">
      <div class="result-name">${UI.esc(f.name)}</div>
      <div class="result-meta">${f.calories} kkal · ${f.protein}q protein · 100q</div>
    </div>
  `).join('');
}

/* ── Yemək seç ────────────────────────────── */
function selectFood(foodId) {
  const food = FoodDB.getById(foodId);
  if (!food) return;

  selectedFood = food;

  document.getElementById('selectedFoodName').textContent    = food.name;
  document.getElementById('previewKcal').textContent         = food.calories;
  document.getElementById('previewProtein').textContent      = food.protein + 'q';
  document.getElementById('previewCarb').textContent         = food.carbs   + 'q';
  document.getElementById('previewFat').textContent          = food.fat     + 'q';
  document.getElementById('portionInput').value              = 100;
  document.getElementById('selectedFoodCard').style.display  = '';

  updateTotalPreview();

  // axtarış gizlət
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchInput').value = '';
  const clearBtn = document.getElementById('clearSearch');
  if (clearBtn) clearBtn.style.display = 'none';

  document.getElementById('selectedFoodCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearSelectedFood() {
  selectedFood = null;
  document.getElementById('selectedFoodCard').style.display = 'none';
}

/* ── Porsiya ──────────────────────────────── */
function adjustPortion(delta) {
  const input = document.getElementById('portionInput');
  const cur   = parseInt(input.value) || 100;
  input.value = Math.max(1, cur + delta);
  updateTotalPreview();
}

document.addEventListener('DOMContentLoaded', () => {
  const portInput = document.getElementById('portionInput');
  if (portInput) portInput.addEventListener('input', updateTotalPreview);
});

function updateTotalPreview() {
  if (!selectedFood) return;
  const grams  = parseInt(document.getElementById('portionInput').value) || 100;
  const kcal   = Calculator.calcFoodCalories(
    { calories: selectedFood.calories }, grams
  );
  document.getElementById('totalKcal').textContent = kcal;
}

/* ── Əlavə et ─────────────────────────────── */
function addMeal() {
  if (!selectedFood) return;

  const grams  = parseInt(document.getElementById('portionInput').value) || 100;
  const macros = Calculator.calcFoodMacros(
    { protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat },
    grams
  );
  const kcal = Calculator.calcFoodCalories({ calories: selectedFood.calories }, grams);

  Storage.addMeal(Storage.todayStr(), {
    foodId:   selectedFood.id,
    foodName: selectedFood.name,
    mealType: currentMealType,
    grams,
    calories: kcal,
    protein:  macros.protein,
    carbs:    macros.carbs,
    fat:      macros.fat,
  });

  UI.toast('✅ ' + selectedFood.name + ' əlavə edildi');
  clearSelectedFood();

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}

/* ── Əl ilə əlavə ─────────────────────────── */
function toggleManual() {
  const form  = document.getElementById('manualForm');
  const arrow = document.getElementById('manualArrow');
  const open  = form.style.display === 'none' || form.style.display === '';
  form.style.display  = open ? 'block' : 'none';
  if (arrow) arrow.textContent = open ? '▴' : '▾';
}

function addManualMeal() {
  const name    = document.getElementById('manualName').value.trim();
  const kcal    = parseFloat(document.getElementById('manualKcal').value)    || 0;
  const protein = parseFloat(document.getElementById('manualProtein').value) || 0;
  const carbs   = parseFloat(document.getElementById('manualCarb').value)    || 0;
  const fat     = parseFloat(document.getElementById('manualFat').value)     || 0;

  if (!name)   { UI.toast('Yemək adı daxil et'); return; }
  if (kcal <= 0) { UI.toast('Kalori daxil et');   return; }

  Storage.addMeal(Storage.todayStr(), {
    foodId:   null,
    foodName: name,
    mealType: currentMealType,
    grams:    null,
    calories: Math.round(kcal),
    protein,
    carbs,
    fat,
  });

  UI.toast('✅ ' + name + ' əlavə edildi');

  // formu təmizlə
  ['manualName','manualKcal','manualProtein','manualCarb','manualFat']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}
