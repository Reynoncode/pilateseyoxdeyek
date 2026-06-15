/**
 * db.js
 * Offline yemək verilənlər bazası.
 * Hər yemək 100q üçün göstərilir.
 * Firestore inteqrasiyasından sonra bu fayl arxa plana keçəcək.
 *
 * Kateqoriyalar:
 *   taxil, et, toyuq, deniz, sebze, meyve,
 *   sut, paxlali, icecek, fast-food, sehriyyat, yag, qoz
 */

const FoodDB = (() => {

  const foods = [
    /* ── Taxıl / Çörək ──────────────────────── */
    { id:'f001', name:'Düyü (bişmiş)',       cat:'taxil',    calories:130, protein:2.7, carbs:28.2, fat:0.3 },
    { id:'f002', name:'Makaron (bişmiş)',     cat:'taxil',    calories:158, protein:5.8, carbs:30.9, fat:0.9 },
    { id:'f003', name:'Bulqur (bişmiş)',      cat:'taxil',    calories:83, protein:3.1, carbs:18.6, fat:0.2 },
    { id:'f004', name:'Çörək (ağ)',           cat:'taxil',    calories:265, protein:9.0, carbs:49.0, fat:3.2 },
    { id:'f005', name:'Çörək (qara/çovdar)',  cat:'taxil',    calories:259, protein:8.5, carbs:48.3, fat:3.3 },
    { id:'f006', name:'Yulaf ezmesi (bişmiş)',cat:'taxil',    calories:71, protein:2.5, carbs:12.0, fat:1.5 },
    { id:'f007', name:'Lavash',               cat:'taxil',    calories:277, protein:9.1, carbs:54.0, fat:3.2 },
    { id:'f008', name:'Qraham crackeri',      cat:'taxil',    calories:429, protein:7.1, carbs:72.3, fat:10.1},
    { id:'f009', name:'Qarğıdalı (bişmiş)',   cat:'taxil',    calories:96, protein:3.4, carbs:21.0, fat:1.5 },
    { id:'f010', name:'Kartof (bişmiş)',      cat:'sebze',    calories:87, protein:1.9, carbs:20.1, fat:0.1 },

    /* ── Et ──────────────────────────────────── */
    { id:'f011', name:'Dana əti (qızardılmış)',cat:'et',      calories:217, protein:26.0, carbs:0.0, fat:12.0},
    { id:'f012', name:'Quzu əti (bişmiş)',    cat:'et',       calories:258, protein:25.6, carbs:0.0, fat:16.5},
    { id:'f013', name:'Donuz (bişmiş)',        cat:'et',      calories:242, protein:27.0, carbs:0.0, fat:14.0},
    { id:'f014', name:'Dana qiyməsi (bişmiş)',cat:'et',       calories:215, protein:24.2, carbs:0.0, fat:13.0},
    { id:'f015', name:'Kolbasa (dana)',        cat:'et',      calories:290, protein:15.0, carbs:2.0, fat:25.0},
    { id:'f016', name:'Sosis',                cat:'et',       calories:296, protein:13.0, carbs:2.0, fat:26.0},

    /* ── Toyuq / Quş ─────────────────────────── */
    { id:'f017', name:'Toyuq döşü (bişmiş)',  cat:'toyuq',   calories:165, protein:31.0, carbs:0.0, fat:3.6 },
    { id:'f018', name:'Toyuq but (bişmiş)',   cat:'toyuq',   calories:209, protein:26.0, carbs:0.0, fat:10.9},
    { id:'f019', name:'Toyuq qanadı (bişmiş)',cat:'toyuq',   calories:203, protein:30.5, carbs:0.0, fat:8.1 },
    { id:'f020', name:'Toyuq (bütöv, bişmiş)',cat:'toyuq',   calories:239, protein:27.3, carbs:0.0, fat:13.6},
    { id:'f021', name:'Hindi döşü (bişmiş)',  cat:'toyuq',   calories:135, protein:30.1, carbs:0.0, fat:1.0 },

    /* ── Dəniz məhsulları ────────────────────── */
    { id:'f022', name:'Qızılbalıq (bişmiş)',  cat:'deniz',   calories:208, protein:20.4, carbs:0.0, fat:13.4},
    { id:'f023', name:'Ton balığı (konserv)', cat:'deniz',   calories:128, protein:29.1, carbs:0.0, fat:1.0 },
    { id:'f024', name:'Nərə balığı',          cat:'deniz',   calories:163, protein:18.0, carbs:0.0, fat:9.8 },
    { id:'f025', name:'Krevets (bişmiş)',     cat:'deniz',   calories:99, protein:24.0, carbs:0.0, fat:0.3 },
    { id:'f026', name:'Sərdəlya (konserv)',   cat:'deniz',   calories:208, protein:24.6, carbs:0.0, fat:11.5},
    { id:'f027', name:'Karp (bişmiş)',        cat:'deniz',   calories:162, protein:22.9, carbs:0.0, fat:7.2 },

    /* ── Yumurta ─────────────────────────────── */
    { id:'f028', name:'Yumurta (bişmiş)',     cat:'sut',     calories:155, protein:12.6, carbs:1.1, fat:10.6},
    { id:'f029', name:'Yumurta ağı (bişmiş)', cat:'sut',     calories:52, protein:11.0, carbs:0.7, fat:0.2 },
    { id:'f030', name:'Yumurta sarısı',       cat:'sut',     calories:322, protein:15.9, carbs:3.6, fat:26.5},

    /* ── Süd məhsulları ──────────────────────── */
    { id:'f031', name:'Süd (tam yağlı)',      cat:'sut',     calories:61, protein:3.2, carbs:4.8, fat:3.3 },
    { id:'f032', name:'Süd (yağsız)',         cat:'sut',     calories:34, protein:3.4, carbs:4.9, fat:0.1 },
    { id:'f033', name:'Kəsmik (az yağlı)',    cat:'sut',     calories:98, protein:11.1, carbs:3.4, fat:4.3 },
    { id:'f034', name:'Qatıq (sade)',         cat:'sut',     calories:61, protein:3.5, carbs:4.7, fat:3.3 },
    { id:'f035', name:'Qatıq (yağsız)',       cat:'sut',     calories:56, protein:5.7, carbs:7.7, fat:0.4 },
    { id:'f036', name:'Pendir (sarı)',        cat:'sut',     calories:402, protein:25.0, carbs:1.3, fat:33.0},
    { id:'f037', name:'Pendir (ağ/bryndza)',  cat:'sut',     calories:264, protein:18.0, carbs:0.0, fat:21.0},
    { id:'f038', name:'Krem pendir',          cat:'sut',     calories:342, protein:6.2, carbs:4.1, fat:34.0},
    { id:'f039', name:'Qaymaq (30%)',         cat:'sut',     calories:292, protein:2.5, carbs:3.0, fat:30.0},

    /* ── Tərəvəz ─────────────────────────────── */
    { id:'f040', name:'Pomidor',              cat:'sebze',   calories:18, protein:0.9, carbs:3.9, fat:0.2 },
    { id:'f041', name:'Xiyar',               cat:'sebze',   calories:16, protein:0.7, carbs:3.6, fat:0.1 },
    { id:'f042', name:'Kələm (ağ)',           cat:'sebze',   calories:25, protein:1.3, carbs:5.8, fat:0.1 },
    { id:'f043', name:'Yerkökü',             cat:'sebze',   calories:41, protein:0.9, carbs:9.6, fat:0.2 },
    { id:'f044', name:'Soğan (quru)',         cat:'sebze',   calories:40, protein:1.1, carbs:9.3, fat:0.1 },
    { id:'f045', name:'Sarımsaq',            cat:'sebze',   calories:149, protein:6.4, carbs:33.1, fat:0.5 },
    { id:'f046', name:'Bibər (qırmızı)',     cat:'sebze',   calories:31, protein:1.0, carbs:6.0, fat:0.3 },
    { id:'f047', name:'Bibər (yaşıl)',       cat:'sebze',   calories:20, protein:0.9, carbs:4.6, fat:0.2 },
    { id:'f048', name:'Badımcan',            cat:'sebze',   calories:25, protein:1.0, carbs:5.9, fat:0.2 },
    { id:'f049', name:'Balqabaq',            cat:'sebze',   calories:26, protein:1.0, carbs:6.5, fat:0.1 },
    { id:'f050', name:'Göyərti (qarışıq)',   cat:'sebze',   calories:22, protein:2.0, carbs:3.7, fat:0.3 },
    { id:'f051', name:'Ispanak',             cat:'sebze',   calories:23, protein:2.9, carbs:3.6, fat:0.4 },
    { id:'f052', name:'Brokkoli (bişmiş)',   cat:'sebze',   calories:35, protein:2.4, carbs:7.2, fat:0.4 },
    { id:'f053', name:'Kartof (qızardılmış)',cat:'sebze',   calories:312, protein:3.4, carbs:41.4, fat:14.7},

    /* ── Meyvə ───────────────────────────────── */
    { id:'f054', name:'Alma',               cat:'meyve',    calories:52, protein:0.3, carbs:13.8, fat:0.2 },
    { id:'f055', name:'Armud',              cat:'meyve',    calories:57, protein:0.4, carbs:15.2, fat:0.1 },
    { id:'f056', name:'Banan',              cat:'meyve',    calories:89, protein:1.1, carbs:22.8, fat:0.3 },
    { id:'f057', name:'Portağal',           cat:'meyve',    calories:47, protein:0.9, carbs:11.8, fat:0.1 },
    { id:'f058', name:'Üzüm',              cat:'meyve',    calories:69, protein:0.7, carbs:18.1, fat:0.2 },
    { id:'f059', name:'Çiyələk',           cat:'meyve',    calories:32, protein:0.7, carbs:7.7, fat:0.3 },
    { id:'f060', name:'Qarpız',            cat:'meyve',    calories:30, protein:0.6, carbs:7.6, fat:0.2 },
    { id:'f061', name:'Şaftalı',           cat:'meyve',    calories:39, protein:0.9, carbs:9.5, fat:0.3 },
    { id:'f062', name:'Gilas',             cat:'meyve',    calories:63, protein:1.1, carbs:16.0, fat:0.2 },
    { id:'f063', name:'Nar',               cat:'meyve',    calories:83, protein:1.7, carbs:18.7, fat:1.2 },
    { id:'f064', name:'Avokado',           cat:'meyve',    calories:160, protein:2.0, carbs:8.5, fat:14.7},
    { id:'f065', name:'Kivi',              cat:'meyve',    calories:61, protein:1.1, carbs:14.7, fat:0.5 },

    /* ── Paxlalılar ──────────────────────────── */
    { id:'f066', name:'Mərcimək (bişmiş)', cat:'paxlali',  calories:116, protein:9.0, carbs:20.1, fat:0.4 },
    { id:'f067', name:'Lobya (bişmiş)',    cat:'paxlali',  calories:127, protein:8.7, carbs:22.8, fat:0.5 },
    { id:'f068', name:'Noxud (bişmiş)',    cat:'paxlali',  calories:164, protein:8.9, carbs:27.4, fat:2.6 },
    { id:'f069', name:'Soya paxlası',      cat:'paxlali',  calories:173, protein:16.6, carbs:9.9, fat:9.0 },

    /* ── Qoz-fındıq ──────────────────────────── */
    { id:'f070', name:'Badam',             cat:'qoz',      calories:579, protein:21.2, carbs:21.6, fat:49.9},
    { id:'f071', name:'Qoz (ceviz)',       cat:'qoz',      calories:654, protein:15.2, carbs:13.7, fat:65.2},
    { id:'f072', name:'Fıstıq ezmesi',    cat:'qoz',      calories:588, protein:25.1, carbs:20.1, fat:50.4},
    { id:'f073', name:'Susam',             cat:'qoz',      calories:573, protein:17.7, carbs:23.5, fat:49.7},
    { id:'f074', name:'Yer fıstığı',      cat:'qoz',      calories:567, protein:25.8, carbs:16.1, fat:49.2},

    /* ── Yağlar ──────────────────────────────── */
    { id:'f075', name:'Zeytun yağı',      cat:'yag',      calories:884, protein:0.0, carbs:0.0, fat:100.0},
    { id:'f076', name:'Kərə yağı',        cat:'yag',      calories:717, protein:0.9, carbs:0.1, fat:81.1 },
    { id:'f077', name:'Günəbaxan yağı',   cat:'yag',      calories:884, protein:0.0, carbs:0.0, fat:100.0},
    { id:'f078', name:'Maya (zeytun)yağı',cat:'yag',      calories:120, protein:0.0, carbs:0.0, fat:14.0 },

    /* ── İçkilər ─────────────────────────────── */
    { id:'f079', name:'Qara çay',         cat:'icecek',   calories:1, protein:0.0, carbs:0.3, fat:0.0 },
    { id:'f080', name:'Qəhvə (şəkərsiz)', cat:'icecek',   calories:2, protein:0.3, carbs:0.0, fat:0.0 },
    { id:'f081', name:'Portağal şirəsi',  cat:'icecek',   calories:45, protein:0.7, carbs:10.4, fat:0.2 },
    { id:'f082', name:'Alma şirəsi',      cat:'icecek',   calories:46, protein:0.1, carbs:11.4, fat:0.1 },
    { id:'f083', name:'Süd (1%)',          cat:'icecek',   calories:42, protein:3.4, carbs:5.0, fat:1.0 },
    { id:'f084', name:'Ayran',            cat:'icecek',   calories:36, protein:2.9, carbs:3.5, fat:1.0 },
    { id:'f085', name:'Şirin kola',       cat:'icecek',   calories:41, protein:0.0, carbs:10.6, fat:0.0 },
    { id:'f086', name:'Enerji içkisi',    cat:'icecek',   calories:45, protein:0.5, carbs:11.3, fat:0.0 },

    /* ── Şirniyyat ───────────────────────────── */
    { id:'f087', name:'Şokolad (tünd)',   cat:'sehriyyat',calories:546, protein:4.9, carbs:59.4, fat:31.3},
    { id:'f088', name:'Şokolad (südlü)',  cat:'sehriyyat',calories:535, protein:7.7, carbs:59.2, fat:29.7},
    { id:'f089', name:'Bal',              cat:'sehriyyat',calories:304, protein:0.3, carbs:82.4, fat:0.0 },
    { id:'f090', name:'Şəkər',            cat:'sehriyyat',calories:387, protein:0.0, carbs:100.0, fat:0.0 },
    { id:'f091', name:'İdman şokoladı (proteinli)',cat:'sehriyyat',calories:370, protein:30.0, carbs:40.0, fat:8.0},

    /* ── Fast-food ───────────────────────────── */
    { id:'f092', name:'Hamburger (orta)', cat:'fast-food', calories:295, protein:17.0, carbs:24.0, fat:14.0},
    { id:'f093', name:'Pizza (1 dilim)',  cat:'fast-food', calories:266, protein:11.0, carbs:33.0, fat:10.0},
    { id:'f094', name:'Qızardılmış kartof (orta)',cat:'fast-food',calories:312, protein:3.4, carbs:41.4, fat:15.0},
    { id:'f095', name:'Hotdog',           cat:'fast-food', calories:290, protein:10.4, carbs:22.9, fat:16.9},
    { id:'f096', name:'Döner (toyuq)',    cat:'fast-food', calories:220, protein:18.0, carbs:20.0, fat:8.0 },
    { id:'f097', name:'Shawarma (dana)',  cat:'fast-food', calories:245, protein:20.0, carbs:22.0, fat:9.0 },

    /* ── Şəhriyyat / Makaron növləri ─────────── */
    { id:'f098', name:'Spaghetti (bişmiş)',cat:'sehriyyat',calories:158, protein:5.8, carbs:30.9, fat:0.9 },
    { id:'f099', name:'Penne (bişmiş)',   cat:'sehriyyat', calories:158, protein:6.0, carbs:31.0, fat:1.0 },

    /* ── Azərbaycan milli yeməkləri ──────────── */
    { id:'f100', name:'Plov (düyü+ət)',   cat:'taxil',    calories:210, protein:9.0, carbs:28.0, fat:7.0 },
    { id:'f101', name:'Dolma (ətli)',     cat:'et',       calories:155, protein:8.0, carbs:14.0, fat:7.5 },
    { id:'f102', name:'Düşbərə',         cat:'sehriyyat', calories:185, protein:9.5, carbs:22.0, fat:6.5 },
    { id:'f103', name:'Qutab (ətli)',     cat:'taxil',    calories:230, protein:11.0, carbs:26.0, fat:9.0 },
    { id:'f104', name:'Qutab (göyərtili)',cat:'taxil',    calories:165, protein:5.5, carbs:24.0, fat:5.5 },
    { id:'f105', name:'Lavangi (toyuq)',  cat:'toyuq',    calories:275, protein:20.0, carbs:15.0, fat:14.0},
    { id:'f106', name:'Bozbas',           cat:'et',       calories:140, protein:10.0, carbs:12.0, fat:6.0 },
    { id:'f107', name:'Küftə bozbas',    cat:'et',       calories:170, protein:12.0, carbs:14.0, fat:7.5 },
    { id:'f108', name:'Piti',             cat:'et',       calories:195, protein:13.0, carbs:14.0, fat:9.5 },
    { id:'f109', name:'Şorbası (ərəb)',  cat:'et',       calories:125, protein:8.0, carbs:10.0, fat:5.5 },
    { id:'f110', name:'Pakhlava',         cat:'sehriyyat',calories:498, protein:7.0, carbs:55.0, fat:28.0},
    { id:'f111', name:'Şəkərbura',        cat:'sehriyyat',calories:445, protein:6.5, carbs:58.0, fat:22.0},
    { id:'f112', name:'Çəkil qozu',      cat:'qoz',      calories:640, protein:14.0, carbs:20.0, fat:58.0},
    { id:'f113', name:'Qoğal',           cat:'taxil',    calories:385, protein:8.0, carbs:52.0, fat:16.0},
    { id:'f114', name:'Lülə kabab',      cat:'et',       calories:260, protein:22.0, carbs:3.0, fat:18.0},
    { id:'f115', name:'Tike kabab',      cat:'et',       calories:235, protein:25.0, carbs:0.0, fat:15.0},
    { id:'f116', name:'Cücə kabab',      cat:'toyuq',    calories:195, protein:24.0, carbs:2.0, fat:10.0},
    { id:'f117', name:'Ovdux',           cat:'sut',      calories:65, protein:3.5, carbs:4.5, fat:3.5 },
    { id:'f118', name:'Dövğa',           cat:'sut',      calories:58, protein:3.2, carbs:4.0, fat:3.0 },
    { id:'f119', name:'Qənd',            cat:'sehriyyat',calories:400, protein:0.0, carbs:99.8, fat:0.0 },
    { id:'f120', name:'Çörək (tandır)',  cat:'taxil',    calories:250, protein:8.0, carbs:48.0, fat:2.5 },
  ];

  /* ── Funksiyalar ──────────────────────────── */

  /** Ada görə axtarış (case-insensitive) */
  function search(query) {
    if (!query || query.trim().length < 1) return [];
    const q = query.trim().toLowerCase();
    return foods.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.cat.toLowerCase().includes(q)
    ).slice(0, 30);
  }

  /** ID ilə tap */
  function getById(id) {
    return foods.find(f => f.id === id) || null;
  }

  /** Kateqoriyaya görə süzgəc */
  function getByCategory(cat) {
    return foods.filter(f => f.cat === cat);
  }

  /** Bütün yemək bazası (custom + local) */
  function getAll() {
    return [...foods];
  }

  /** Kateqoriya siyahısı */
  const CATEGORIES = [
    { id:'taxil',     label:'Taxıl & Çörək',    emoji:'🌾' },
    { id:'et',        label:'Et',                emoji:'🥩' },
    { id:'toyuq',     label:'Toyuq & Quş',       emoji:'🍗' },
    { id:'deniz',     label:'Dəniz məhsulları',  emoji:'🐟' },
    { id:'sebze',     label:'Tərəvəz',           emoji:'🥦' },
    { id:'meyve',     label:'Meyvə',             emoji:'🍎' },
    { id:'sut',       label:'Süd & Yumurta',     emoji:'🥛' },
    { id:'paxlali',   label:'Paxlalılar',        emoji:'🫘' },
    { id:'qoz',       label:'Qoz-fındıq',        emoji:'🥜' },
    { id:'yag',       label:'Yağlar',            emoji:'🫙' },
    { id:'icecek',    label:'İçkilər',           emoji:'🥤' },
    { id:'sehriyyat', label:'Şirniyyat & Digər', emoji:'🍫' },
    { id:'fast-food', label:'Fast food',         emoji:'🍔' },
  ];

  return {
    search,
    getById,
    getByCategory,
    getAll,
    CATEGORIES,
  };

})();
