/**
 * calculator.js
 * BMR, TDEE, makro və günlük hədəf hesablamaları.
 * Mifflin-St Jeor düsturu istifadə edilir.
 */

const Calculator = (() => {

  /* ── Aktivlik əmsalları ───────────────────── */
  const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,    // Oturaq (idmansız)
    light:     1.375,  // Az aktiv (həftədə 1-3 gün)
    moderate:  1.55,   // Orta (həftədə 3-5 gün)
    active:    1.725,  // Çox aktiv (həftədə 6-7 gün)
    athlete:   1.9,    // Atlet (gündə 2 dəfə)
  };

  /* ── Məqsəd kalori fərqi ──────────────────── */
  const GOAL_DELTA = {
    lose:     -500,  // Arıqlamaq: gündə -500 kkal
    maintain:    0,  // Saxlamaq
    gain:     +300,  // Kilo almaq: gündə +300 kkal
  };

  /**
   * BMR — Bazal Metabolizm Sürəti (Mifflin-St Jeor)
   * @param {number} weight - kg
   * @param {number} height - sm
   * @param {number} age    - il
   * @param {string} gender - 'male' | 'female' | 'other'
   * @returns {number} kkal/gün (tam ədəd)
   */
  function calcBMR(weight, height, age, gender) {
    const base = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'female') return Math.round(base - 161);
    return Math.round(base + 5); // male + other
  }

  /**
   * TDEE — Ümumi Gündəlik Enerji Xərci
   * @param {number} bmr
   * @param {string} activityLevel - sedentary|light|moderate|active|athlete
   * @returns {number} kkal/gün
   */
  function calcTDEE(bmr, activityLevel) {
    const mult = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
    return Math.round(bmr * mult);
  }

  /**
   * Günlük Kalori Hədəfi
   * @param {number} tdee
   * @param {string} goal - lose|maintain|gain
   * @returns {number} kkal/gün
   */
  function calcDailyTarget(tdee, goal) {
    const delta = GOAL_DELTA[goal] || 0;
    const target = tdee + delta;
    return Math.max(1200, target); // minimum 1200 kkal
  }

  /**
   * Makro hesablamaları
   * @param {number} weight        - kg (protein hesabı üçün)
   * @param {number} dailyCalories - günlük hədəf kkal
   * @returns {{ protein, carbs, fat, water }}
   */
  function calcMacros(weight, dailyCalories) {
    // Protein: çəki × 1.4 q/kg
    const protein = Math.round(weight * 1.4);

    // Yağ: kalorin 25%-i, 9 kkal/q
    const fat = Math.round((dailyCalories * 0.25) / 9);

    // Karbohidrat: qalan kalori, 4 kkal/q
    const proteinCal = protein * 4;
    const fatCal     = fat * 9;
    const carbs      = Math.max(0, Math.round((dailyCalories - proteinCal - fatCal) / 4));

    // Su: çəki × 0.033 L (1 onluğa yuvarlaqlaşdır)
    const water = Math.round(weight * 0.033 * 10) / 10;

    return { protein, carbs, fat, water };
  }

  /**
   * Yemək kalorisi (qrama görə)
   * @param {Object} food  - { calories } (100q üçün)
   * @param {number} grams
   * @returns {number} kkal
   */
  function calcFoodCalories(food, grams) {
    return Math.round((food.calories * grams) / 100);
  }

  /**
   * Yemək makrosu (qrama görə)
   * @param {Object} food  - { protein, carbs, fat } (100q üçün)
   * @param {number} grams
   * @returns {{ protein, carbs, fat }}
   */
  function calcFoodMacros(food, grams) {
    const ratio = grams / 100;
    return {
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs:   Math.round(food.carbs   * ratio * 10) / 10,
      fat:     Math.round(food.fat     * ratio * 10) / 10,
    };
  }

  /**
   * Gündəlik loqdan cəm kalori + makro
   * @param {Array} meals
   * @returns {{ calories, protein, carbs, fat }}
   */
  function sumDay(meals) {
    return meals.reduce((acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein:  acc.protein  + (m.protein  || 0),
      carbs:    acc.carbs    + (m.carbs    || 0),
      fat:      acc.fat      + (m.fat      || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  /**
   * Yüzdə (0–100, 100-dən çox ola bilər)
   */
  function pct(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  /**
   * Tam hesablama — onboarding sonu üçün
   * @param {Object} profile - { weight, height, age, gender, activityLevel, goal }
   * @returns {Object} - { bmr, tdee, dailyTarget, macros }
   */
  function calcAll(profile) {
    const { weight, height, age, gender, activityLevel, goal } = profile;
    const bmr         = calcBMR(weight, height, age, gender);
    const tdee        = calcTDEE(bmr, activityLevel);
    const dailyTarget = calcDailyTarget(tdee, goal);
    const macros      = calcMacros(weight, dailyTarget);
    return { bmr, tdee, dailyTarget, macros };
  }

  /* ── Public API ───────────────────────────── */
  return {
    calcBMR,
    calcTDEE,
    calcDailyTarget,
    calcMacros,
    calcFoodCalories,
    calcFoodMacros,
    sumDay,
    pct,
    calcAll,
    ACTIVITY_MULTIPLIERS,
    GOAL_DELTA,
  };

})();
