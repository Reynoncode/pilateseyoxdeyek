/**
 * search.js
 * Yemək axtarış səhifəsi: axtarış + kateqoriya + modal.
 */

let activeCat    = 'all';
let selectedFood = null;

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  renderPopular();
  renderCategories();
});

/* ── Kateqoriya pilləri ───────────────────── */
function renderCategories() {
  const scroll = document.getElementById('categoryScroll');
  if (!scroll) return;

  // İlk düymə (hamısı) artıq HTML-dədir; sonrakıları yenilə
  const cats = FoodDB.CATEGORIES;
  // Mövcud pilllərin data-cat-larını düzəlt (HTML-dəki adlar Azerbaijani, db adlar başqadır)
  // Buna görə ən etibarlı yanaşma: öz düymələrimizi yarat
  scroll.innerHTML =
    `<button class="category-pill active" data-cat="all" onclick="filterCat(this,'all')">🍽️ Hamısı</button>` +
    cats.map(c =>
      `<button class="category-pill" data-cat="${c.id}" onclick="filterCat(this,'${c.id}')">${c.emoji} ${c.label}</button>`
    ).join('');
}

function filterCat(btn, cat) {
  activeCat = cat;
  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const input = document.getElementById('searchInput');
  const query = input ? input.value.trim() : '';

  if (query) {
    doSearch(query);
  } else {
    renderByCat(cat);
  }
}

function renderByCat(cat) {
  const popular  = document.getElementById('popularSection');
  const empty    = document.getElementById('emptyState');
  const results  = document.getElementById('resultsList');

  if (popular) popular.style.display = 'none';
  if (empty)   empty.style.display   = 'none';

  const foods = cat === 'all' ? FoodDB.getAll() : FoodDB.getByCategory(cat);
  renderFoodList(foods, results, empty);
}

/* ── Axtarış ──────────────────────────────── */
function initSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  if (!input) return;

  const search = UI.debounce(q => doSearch(q), 250);

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (clearBtn) clearBtn.style.display = q ? '' : 'none';

    if (!q) {
      document.getElementById('resultsList').innerHTML = '';
      const popular = document.getElementById('popularSection');
      const empty   = document.getElementById('emptyState');
      if (popular) popular.style.display = '';
      if (empty)   empty.style.display   = 'none';
      return;
    }
    search(q);
  });
}

function doSearch(query) {
  const popular  = document.getElementById('popularSection');
  const empty    = document.getElementById('emptyState');
  const results  = document.getElementById('resultsList');

  if (popular) popular.style.display = 'none';

  let foods = FoodDB.search(query);

  // kateqoriya filtri tətbiq et
  if (activeCat !== 'all') {
    foods = foods.filter(f => f.cat === activeCat);
  }

  renderFoodList(foods, results, empty);
}

function clearSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const results  = document.getElementById('resultsList');
  const popular  = document.getElementById('popularSection');
  const empty    = document.getElementById('emptyState');

  if (input)    { input.value = ''; input.focus(); }
  if (clearBtn)   clearBtn.style.display = 'none';
  if (results)    results.innerHTML      = '';
  if (popular)    popular.style.display  = '';
  if (empty)      empty.style.display    = 'none';
}

function renderFoodList(foods, listEl, emptyEl) {
  if (!listEl) return;

  if (!foods || foods.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  listEl.innerHTML = foods.map(f => `
    <div class="result-item" onclick="openModal('${f.id}')">
      <div class="result-main">
        <div class="result-name">${UI.esc(f.name)}</div>
        <div class="result-meta">${f.calories} kkal / 100q</div>
      </div>
      <div class="result-macros">
        <span class="protein-color">${f.protein}q</span>
        <span class="carb-color">${f.carbs}q</span>
        <span class="fat-color">${f.fat}q</span>
      </div>
    </div>
  `).join('');
}

/* ── Populyar ─────────────────────────────── */
function renderPopular() {
  const listEl = document.getElementById('popularList');
  if (!listEl) return;

  const popularIds = ['f017','f001','f040','f028','f031','f022','f070','f071'];
  const foods = popularIds.map(id => FoodDB.getById(id)).filter(Boolean);
  renderFoodList(foods, listEl, null);
}

/* ── Modal ────────────────────────────────── */
function openModal(foodId) {
  const food = FoodDB.getById(foodId);
  if (!food) return;
  selectedFood = food;

  document.getElementById('modalFoodName').textContent = food.name;
  document.getElementById('modalKcal').textContent     = food.calories;
  document.getElementById('modalProtein').textContent  = food.protein + 'q';
  document.getElementById('modalCarb').textContent     = food.carbs   + 'q';
  document.getElementById('modalFat').textContent      = food.fat     + 'q';
  document.getElementById('modalPortion').value        = 100;

  // Saatə görə öyün seç
  const hour = new Date().getHours();
  let mealType = 'breakfast';
  if (hour >= 11 && hour < 15)  mealType = 'lunch';
  else if (hour >= 15 && hour < 20) mealType = 'dinner';
  else if (hour >= 20) mealType = 'snack';
  document.getElementById('modalMealType').value = mealType;

  document.getElementById('foodModal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'foodModal') closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('foodModal').classList.remove('open');
  selectedFood = null;
}

function adjustModalPortion(delta) {
  const input = document.getElementById('modalPortion');
  const cur   = parseInt(input.value) || 100;
  input.value = Math.max(1, cur + delta);
}

function addFromModal() {
  if (!selectedFood) return;

  const grams    = parseInt(document.getElementById('modalPortion').value) || 100;
  const mealType = document.getElementById('modalMealType').value;
  const macros   = Calculator.calcFoodMacros(
    { protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat },
    grams
  );
  const kcal = Calculator.calcFoodCalories({ calories: selectedFood.calories }, grams);

  Storage.addMeal(Storage.todayStr(), {
    foodId:   selectedFood.id,
    foodName: selectedFood.name,
    mealType,
    grams,
    calories: kcal,
    protein:  macros.protein,
    carbs:    macros.carbs,
    fat:      macros.fat,
  });

  UI.toast('✅ ' + selectedFood.name + ' əlavə edildi');
  closeModalBtn();

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}
