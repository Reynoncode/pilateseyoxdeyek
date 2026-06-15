/**
 * storage.js
 * localStorage ilə bütün məlumat əməliyyatları.
 * Firestore-a keçiddə bu faylı dəyişmək kifayətdir.
 *
 * Açarlar:
 *   ct_profile        → istifadəçi profili
 *   ct_log            → günlük yemək loqları
 *   ct_custom_foods   → istifadəçinin öz əlavə etdiyi yeməklər
 */

const Storage = (() => {

  const KEYS = {
    PROFILE:       'ct_profile',
    LOG:           'ct_log',
    CUSTOM_FOODS:  'ct_custom_foods',
  };

  /* ── Köməkçi funksiyalar ──────────────────── */

  function _get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      console.error('Storage yazma xətası:', key);
      return false;
    }
  }

  /* ── Profil ───────────────────────────────── */

  /**
   * @returns {Object|null}
   * {
   *   name, age, gender,        // addım 1
   *   height, weight, goalWeight,// addım 2
   *   activityLevel,            // addım 3: sedentary|light|moderate|active|athlete
   *   goal,                     // addım 4: lose|maintain|gain
   *   bmr, tdee, dailyTarget,   // hesablanmış
   *   macros: { protein, carbs, fat, water },
   *   createdAt
   * }
   */
  function getProfile() {
    return _get(KEYS.PROFILE);
  }

  function saveProfile(data) {
    const existing = getProfile() || {};
    return _set(KEYS.PROFILE, {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  function hasProfile() {
    const p = getProfile();
    return !!(p && p.dailyTarget);
  }

  function clearProfile() {
    localStorage.removeItem(KEYS.PROFILE);
  }

  /* ── Günlük log ───────────────────────────── */

  /**
   * Bütün log obyekti:
   * {
   *   "2025-06-15": {
   *     meals: [
   *       {
   *         id, foodId, foodName,
   *         mealType: breakfast|lunch|dinner|snack,
   *         grams, calories, protein, carbs, fat,
   *         addedAt
   *       }
   *     ],
   *     water: 0   // içilmiş su (stəkan sayı, 1 stəkan = 250ml)
   *   }
   * }
   */
  function getAllLogs() {
    return _get(KEYS.LOG) || {};
  }

  function getDayLog(dateStr) {
    const logs = getAllLogs();
    return logs[dateStr] || { meals: [], water: 0 };
  }

  function saveDayLog(dateStr, dayData) {
    const logs = getAllLogs();
    logs[dateStr] = dayData;
    return _set(KEYS.LOG, logs);
  }

  function addMeal(dateStr, mealObj) {
    const day = getDayLog(dateStr);
    const meal = {
      ...mealObj,
      id: _uid(),
      addedAt: new Date().toISOString(),
    };
    day.meals.push(meal);
    saveDayLog(dateStr, day);
    return meal;
  }

  function deleteMeal(dateStr, mealId) {
    const day = getDayLog(dateStr);
    day.meals = day.meals.filter(m => m.id !== mealId);
    return saveDayLog(dateStr, day);
  }

  function updateWater(dateStr, glasses) {
    const day = getDayLog(dateStr);
    day.water = Math.max(0, glasses);
    return saveDayLog(dateStr, day);
  }

  /* ── Öz yeməkləri ─────────────────────────── */

  function getCustomFoods() {
    return _get(KEYS.CUSTOM_FOODS) || [];
  }

  function addCustomFood(food) {
    const foods = getCustomFoods();
    const newFood = {
      ...food,
      id: 'custom_' + _uid(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    foods.push(newFood);
    _set(KEYS.CUSTOM_FOODS, foods);
    return newFood;
  }

  function deleteCustomFood(foodId) {
    const foods = getCustomFoods().filter(f => f.id !== foodId);
    return _set(KEYS.CUSTOM_FOODS, foods);
  }

  /* ── Tarix köməkçisi ──────────────────────── */

  /** "2025-06-15" formatında bugünkü tarix */
  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  /** Son N günün tarix siyahısı (bu gün daxil) */
  function lastNDays(n = 7) {
    const days = [];
    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }

  /* ── Hamısını sil ─────────────────────────── */
  function clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  /* ── UID ──────────────────────────────────── */
  function _uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* ── Public API ───────────────────────────── */
  return {
    // Profil
    getProfile,
    saveProfile,
    hasProfile,
    clearProfile,
    // Log
    getAllLogs,
    getDayLog,
    addMeal,
    deleteMeal,
    updateWater,
    // Öz yeməkləri
    getCustomFoods,
    addCustomFood,
    deleteCustomFood,
    // Köməkçi
    todayStr,
    lastNDays,
    clearAll,
  };

})();
