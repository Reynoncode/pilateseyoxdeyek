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
    { id:'f001', name:'Düyü (bişmiş)',       cat:'taxil',    cal:130, p:2.7, c:28.2, f:0.3 },
    { id:'f002', name:'Makaron (bişmiş)',     cat:'taxil',    cal:158, p:5.8, c:30.9, f:0.9 },
    { id:'f003', name:'Bulqur (bişmiş)',      cat:'taxil',    cal:83,  p:3.1, c:18.6, f:0.2 },
    { id:'f004', name:'Çörək (ağ)',           cat:'taxil',    cal:265, p:9.0, c:49.0, f:3.2 },
    { id:'f005', name:'Çörək (qara/çovdar)',  cat:'taxil',    cal:259, p:8.5, c:48.3, f:3.3 },
    { id:'f006', name:'Yulaf ezmesi (bişmiş)',cat:'taxil',    cal:71,  p:2.5, c:12.0, f:1.5 },
    { id:'f007', name:'Lavash',               cat:'taxil',    cal:277, p:9.1, c:54.0, f:3.2 },
    { id:'f008', name:'Qraham crackeri',      cat:'taxil',    cal:429, p:7.1, c:72.3, f:10.1},
    { id:'f009', name:'Qarğıdalı (bişmiş)',   cat:'taxil',    cal:96,  p:3.4, c:21.0, f:1.5 },
    { id:'f010', name:'Kartof (bişmiş)',      cat:'sebze',    cal:87,  p:1.9, c:20.1, f:0.1 },

    /* ── Et ──────────────────────────────────── */
    { id:'f011', name:'Dana əti (qızardılmış)',cat:'et',      cal:217, p:26.0,c:0.0,  f:12.0},
    { id:'f012', name:'Quzu əti (bişmiş)',    cat:'et',       cal:258, p:25.6,c:0.0,  f:16.5},
    { id:'f013', name:'Donuz (bişmiş)',        cat:'et',      cal:242, p:27.0,c:0.0,  f:14.0},
    { id:'f014', name:'Dana qiyməsi (bişmiş)',cat:'et',       cal:215, p:24.2,c:0.0,  f:13.0},
    { id:'f015', name:'Kolbasa (dana)',        cat:'et',      cal:290, p:15.0,c:2.0,  f:25.0},
    { id:'f016', name:'Sosis',                cat:'et',       cal:296, p:13.0,c:2.0,  f:26.0},

    /* ── Toyuq / Quş ─────────────────────────── */
    { id:'f017', name:'Toyuq döşü (bişmiş)',  cat:'toyuq',   cal:165, p:31.0,c:0.0,  f:3.6 },
    { id:'f018', name:'Toyuq but (bişmiş)',   cat:'toyuq',   cal:209, p:26.0,c:0.0,  f:10.9},
    { id:'f019', name:'Toyuq qanadı (bişmiş)',cat:'toyuq',   cal:203, p:30.5,c:0.0,  f:8.1 },
    { id:'f020', name:'Toyuq (bütöv, bişmiş)',cat:'toyuq',   cal:239, p:27.3,c:0.0,  f:13.6},
    { id:'f021', name:'Hindi döşü (bişmiş)',  cat:'toyuq',   cal:135, p:30.1,c:0.0,  f:1.0 },

    /* ── Dəniz məhsulları ────────────────────── */
    { id:'f022', name:'Qızılbalıq (bişmiş)',  cat:'deniz',   cal:208, p:20.4,c:0.0,  f:13.4},
    { id:'f023', name:'Ton balığı (konserv)', cat:'deniz',   cal:128, p:29.1,c:0.0,  f:1.0 },
    { id:'f024', name:'Nərə balığı',          cat:'deniz',   cal:163, p:18.0,c:0.0,  f:9.8 },
    { id:'f025', name:'Krevets (bişmiş)',     cat:'deniz',   cal:99,  p:24.0,c:0.0,  f:0.3 },
    { id:'f026', name:'Sərdəlya (konserv)',   cat:'deniz',   cal:208, p:24.6,c:0.0,  f:11.5},
    { id:'f027', name:'Karp (bişmiş)',        cat:'deniz',   cal:162, p:22.9,c:0.0,  f:7.2 },

    /* ── Yumurta ─────────────────────────────── */
    { id:'f028', name:'Yumurta (bişmiş)',     cat:'sut',     cal:155, p:12.6,c:1.1,  f:10.6},
    { id:'f029', name:'Yumurta ağı (bişmiş)', cat:'sut',     cal:52,  p:11.0,c:0.7,  f:0.2 },
    { id:'f030', name:'Yumurta sarısı',       cat:'sut',     cal:322, p:15.9,c:3.6,  f:26.5},

    /* ── Süd məhsulları ──────────────────────── */
    { id:'f031', name:'Süd (tam yağlı)',      cat:'sut',     cal:61,  p:3.2, c:4.8,  f:3.3 },
    { id:'f032', name:'Süd (yağsız)',         cat:'sut',     cal:34,  p:3.4, c:4.9,  f:0.1 },
    { id:'f033', name:'Kəsmik (az yağlı)',    cat:'sut',     cal:98,  p:11.1,c:3.4,  f:4.3 },
    { id:'f034', name:'Qatıq (sade)',         cat:'sut',     cal:61,  p:3.5, c:4.7,  f:3.3 },
    { id:'f035', name:'Qatıq (yağsız)',       cat:'sut',     cal:56,  p:5.7, c:7.7,  f:0.4 },
    { id:'f036', name:'Pendir (sarı)',        cat:'sut',     cal:402, p:25.0,c:1.3,  f:33.0},
    { id:'f037', name:'Pendir (ağ/bryndza)',  cat:'sut',     cal:264, p:18.0,c:0.0,  f:21.0},
    { id:'f038', name:'Krem pendir',          cat:'sut',     cal:342, p:6.2, c:4.1,  f:34.0},
    { id:'f039', name:'Qaymaq (30%)',         cat:'sut',     cal:292, p:2.5, c:3.0,  f:30.0},

    /* ── Tərəvəz ─────────────────────────────── */
    { id:'f040', name:'Pomidor',              cat:'sebze',   cal:18,  p:0.9, c:3.9,  f:0.2 },
    { id:'f041', name:'Xiyar',               cat:'sebze',   cal:16,  p:0.7, c:3.6,  f:0.1 },
    { id:'f042', name:'Kələm (ağ)',           cat:'sebze',   cal:25,  p:1.3, c:5.8,  f:0.1 },
    { id:'f043', name:'Yerkökü',             cat:'sebze',   cal:41,  p:0.9, c:9.6,  f:0.2 },
    { id:'f044', name:'Soğan (quru)',         cat:'sebze',   cal:40,  p:1.1, c:9.3,  f:0.1 },
    { id:'f045', name:'Sarımsaq',            cat:'sebze',   cal:149, p:6.4, c:33.1, f:0.5 },
    { id:'f046', name:'Bibər (qırmızı)',     cat:'sebze',   cal:31,  p:1.0, c:6.0,  f:0.3 },
    { id:'f047', name:'Bibər (yaşıl)',       cat:'sebze',   cal:20,  p:0.9, c:4.6,  f:0.2 },
    { id:'f048', name:'Badımcan',            cat:'sebze',   cal:25,  p:1.0, c:5.9,  f:0.2 },
    { id:'f049', name:'Balqabaq',            cat:'sebze',   cal:26,  p:1.0, c:6.5,  f:0.1 },
    { id:'f050', name:'Göyərti (qarışıq)',   cat:'sebze',   cal:22,  p:2.0, c:3.7,  f:0.3 },
    { id:'f051', name:'Ispanak',             cat:'sebze',   cal:23,  p:2.9, c:3.6,  f:0.4 },
    { id:'f052', name:'Brokkoli (bişmiş)',   cat:'sebze',   cal:35,  p:2.4, c:7.2,  f:0.4 },
    { id:'f053', name:'Kartof (qızardılmış)',cat:'sebze',   cal:312, p:3.4, c:41.4, f:14.7},

    /* ── Meyvə ───────────────────────────────── */
    { id:'f054', name:'Alma',               cat:'meyve',    cal:52,  p:0.3, c:13.8, f:0.2 },
    { id:'f055', name:'Armud',              cat:'meyve',    cal:57,  p:0.4, c:15.2, f:0.1 },
    { id:'f056', name:'Banan',              cat:'meyve',    cal:89,  p:1.1, c:22.8, f:0.3 },
    { id:'f057', name:'Portağal',           cat:'meyve',    cal:47,  p:0.9, c:11.8, f:0.1 },
    { id:'f058', name:'Üzüm',              cat:'meyve',    cal:69,  p:0.7, c:18.1, f:0.2 },
    { id:'f059', name:'Çiyələk',           cat:'meyve',    cal:32,  p:0.7, c:7.7,  f:0.3 },
    { id:'f060', name:'Qarpız',            cat:'meyve',    cal:30,  p:0.6, c:7.6,  f:0.2 },
    { id:'f061', name:'Şaftalı',           cat:'meyve',    cal:39,  p:0.9, c:9.5,  f:0.3 },
    { id:'f062', name:'Gilas',             cat:'meyve',    cal:63,  p:1.1, c:16.0, f:0.2 },
    { id:'f063', name:'Nar',               cat:'meyve',    cal:83,  p:1.7, c:18.7, f:1.2 },
    { id:'f064', name:'Avokado',           cat:'meyve',    cal:160, p:2.0, c:8.5,  f:14.7},
    { id:'f065', name:'Kivi',              cat:'meyve',    cal:61,  p:1.1, c:14.7, f:0.5 },

    /* ── Paxlalılar ──────────────────────────── */
    { id:'f066', name:'Mərcimək (bişmiş)', cat:'paxlali',  cal:116, p:9.0, c:20.1, f:0.4 },
    { id:'f067', name:'Lobya (bişmiş)',    cat:'paxlali',  cal:127, p:8.7, c:22.8, f:0.5 },
    { id:'f068', name:'Noxud (bişmiş)',    cat:'paxlali',  cal:164, p:8.9, c:27.4, f:2.6 },
    { id:'f069', name:'Soya paxlası',      cat:'paxlali',  cal:173, p:16.6,c:9.9,  f:9.0 },

    /* ── Qoz-fındıq ──────────────────────────── */
    { id:'f070', name:'Badam',             cat:'qoz',      cal:579, p:21.2,c:21.6, f:49.9},
    { id:'f071', name:'Qoz (ceviz)',       cat:'qoz',      cal:654, p:15.2,c:13.7, f:65.2},
    { id:'f072', name:'Fıstıq ezmesi',    cat:'qoz',      cal:588, p:25.1,c:20.1, f:50.4},
    { id:'f073', name:'Susam',             cat:'qoz',      cal:573, p:17.7,c:23.5, f:49.7},
    { id:'f074', name:'Yer fıstığı',      cat:'qoz',      cal:567, p:25.8,c:16.1, f:49.2},

    /* ── Yağlar ──────────────────────────────── */
    { id:'f075', name:'Zeytun yağı',      cat:'yag',      cal:884, p:0.0, c:0.0,  f:100.0},
    { id:'f076', name:'Kərə yağı',        cat:'yag',      cal:717, p:0.9, c:0.1,  f:81.1 },
    { id:'f077', name:'Günəbaxan yağı',   cat:'yag',      cal:884, p:0.0, c:0.0,  f:100.0},
    { id:'f078', name:'Maya (zeytun)yağı',cat:'yag',      cal:120, p:0.0, c:0.0,  f:14.0 },

    /* ── İçkilər ─────────────────────────────── */
    { id:'f079', name:'Qara çay',         cat:'icecek',   cal:1,   p:0.0, c:0.3,  f:0.0 },
    { id:'f080', name:'Qəhvə (şəkərsiz)', cat:'icecek',   cal:2,   p:0.3, c:0.0,  f:0.0 },
    { id:'f081', name:'Portağal şirəsi',  cat:'icecek',   cal:45,  p:0.7, c:10.4, f:0.2 },
    { id:'f082', name:'Alma şirəsi',      cat:'icecek',   cal:46,  p:0.1, c:11.4, f:0.1 },
    { id:'f083', name:'Süd (1%)',          cat:'icecek',   cal:42,  p:3.4, c:5.0,  f:1.0 },
    { id:'f084', name:'Ayran',            cat:'icecek',   cal:36,  p:2.9, c:3.5,  f:1.0 },
    { id:'f085', name:'Şirin kola',       cat:'icecek',   cal:41,  p:0.0, c:10.6, f:0.0 },
    { id:'f086', name:'Enerji içkisi',    cat:'icecek',   cal:45,  p:0.5, c:11.3, f:0.0 },

    /* ── Şirniyyat ───────────────────────────── */
    { id:'f087', name:'Şokolad (tünd)',   cat:'sehriyyat',cal:546, p:4.9, c:59.4, f:31.3},
    { id:'f088', name:'Şokolad (südlü)',  cat:'sehriyyat',cal:535, p:7.7, c:59.2, f:29.7},
    { id:'f089', name:'Bal',              cat:'sehriyyat',cal:304, p:0.3, c:82.4, f:0.0 },
    { id:'f090', name:'Şəkər',            cat:'sehriyyat',cal:387, p:0.0, c:100.0,f:0.0 },
    { id:'f091', name:'İdman şokoladı (proteinli)',cat:'sehriyyat',cal:370,p:30.0,c:40.0,f:8.0},

    /* ── Fast-food ───────────────────────────── */
    { id:'f092', name:'Hamburger (orta)', cat:'fast-food', cal:295, p:17.0,c:24.0, f:14.0},
    { id:'f093', name:'Pizza (1 dilim)',  cat:'fast-food', cal:266, p:11.0,c:33.0, f:10.0},
    { id:'f094', name:'Qızardılmış kartof (orta)',cat:'fast-food',cal:312,p:3.4,c:41.4,f:15.0},
    { id:'f095', name:'Hotdog',           cat:'fast-food', cal:290, p:10.4,c:22.9, f:16.9},
    { id:'f096', name:'Döner (toyuq)',    cat:'fast-food', cal:220, p:18.0,c:20.0, f:8.0 },
    { id:'f097', name:'Shawarma (dana)',  cat:'fast-food', cal:245, p:20.0,c:22.0, f:9.0 },

    /* ── Şəhriyyat / Makaron növləri ─────────── */
    { id:'f098', name:'Spaghetti (bişmiş)',cat:'sehriyyat',cal:158, p:5.8, c:30.9, f:0.9 },
    { id:'f099', name:'Penne (bişmiş)',   cat:'sehriyyat', cal:158, p:6.0, c:31.0, f:1.0 },

    /* ── Azərbaycan milli yeməkləri ──────────── */
    { id:'f100', name:'Plov (düyü+ət)',   cat:'taxil',    cal:210, p:9.0, c:28.0, f:7.0 },
    { id:'f101', name:'Dolma (ətli)',     cat:'et',       cal:155, p:8.0, c:14.0, f:7.5 },
    { id:'f102', name:'Düşbərə',         cat:'sehriyyat', cal:185, p:9.5, c:22.0, f:6.5 },
    { id:'f103', name:'Qutab (ətli)',     cat:'taxil',    cal:230, p:11.0,c:26.0, f:9.0 },
    { id:'f104', name:'Qutab (göyərtili)',cat:'taxil',    cal:165, p:5.5, c:24.0, f:5.5 },
    { id:'f105', name:'Lavangi (toyuq)',  cat:'toyuq',    cal:275, p:20.0,c:15.0, f:14.0},
    { id:'f106', name:'Bozbas',           cat:'et',       cal:140, p:10.0,c:12.0, f:6.0 },
    { id:'f107', name:'Küftə bozbas',    cat:'et',       cal:170, p:12.0,c:14.0, f:7.5 },
    { id:'f108', name:'Piti',             cat:'et',       cal:195, p:13.0,c:14.0, f:9.5 },
    { id:'f109', name:'Şorbası (ərəb)',  cat:'et',       cal:125, p:8.0, c:10.0, f:5.5 },
    { id:'f110', name:'Pakhlava',         cat:'sehriyyat',cal:498, p:7.0, c:55.0, f:28.0},
    { id:'f111', name:'Şəkərbura',        cat:'sehriyyat',cal:445, p:6.5, c:58.0, f:22.0},
    { id:'f112', name:'Çəkil qozu',      cat:'qoz',      cal:640, p:14.0,c:20.0, f:58.0},
    { id:'f113', name:'Qoğal',           cat:'taxil',    cal:385, p:8.0, c:52.0, f:16.0},
    { id:'f114', name:'Lülə kabab',      cat:'et',       cal:260, p:22.0,c:3.0,  f:18.0},
    { id:'f115', name:'Tike kabab',      cat:'et',       cal:235, p:25.0,c:0.0,  f:15.0},
    { id:'f116', name:'Cücə kabab',      cat:'toyuq',    cal:195, p:24.0,c:2.0,  f:10.0},
    { id:'f117', name:'Ovdux',           cat:'sut',      cal:65,  p:3.5, c:4.5,  f:3.5 },
    { id:'f118', name:'Dövğa',           cat:'sut',      cal:58,  p:3.2, c:4.0,  f:3.0 },
    { id:'f119', name:'Qənd',            cat:'sehriyyat',cal:400, p:0.0, c:99.8, f:0.0 },
    { id:'f120', name:'Çörək (tandır)',  cat:'taxil',    cal:250, p:8.0, c:48.0, f:2.5 },
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
