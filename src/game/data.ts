import {
  AchievementDef,
  CategoryId,
  CookingStationId,
  CustomerArchetype,
  MenuItem,
  MenuItemId,
  SecretRecipe,
  UpgradeItem,
  VipCustomerId,
  VipProfile,
} from './types';

export interface CookingStationDef {
  id: CookingStationId;
  title: string;
  shortLabel: string;
  description: string;
  actionHint: string;
}

export const COOKING_STATIONS: CookingStationDef[] = [
  {
    id: 'goreng',
    title: 'Wajan Penggorengan',
    shortLabel: 'Wajan Goreng',
    description: 'Goreng lauk & gorengan renyah hingga cokelat keemasan (50%–85%).',
    actionHint: 'Masukkan bahan, tunggu matang keemasan, angkat sebelum gosong.',
  },
  {
    id: 'rebus',
    title: 'Panci Kuah & Ungkep',
    shortLabel: 'Panci Rebus',
    description: 'Didihkan sayur kuah, semur/rendang ungkep, pesmol, dan wedang jahe.',
    actionHint: 'Rebus hingga mendidih harum (50%–85%), lalu angkat ke etalase.',
  },
  {
    id: 'tumis',
    title: 'Wajan Tumis',
    shortLabel: 'Wajan Tumis',
    description: 'Tumis cepat sayuran & suwiran berbumbu dengan spatula aktif.',
    actionHint: 'Klik "Aduk Spatula" berkala untuk mempercepat kematangan merata.',
  },
  {
    id: 'cobek',
    title: 'Cobek & Ulekan Batu',
    shortLabel: 'Cobek Sambal',
    description: 'Ulek cabai, bawang & terasi di cobek batu (tanpa risiko gosong).',
    actionHint: 'Klik "Ulek!" 5–6 kali hingga halus merata sebelum diangkat.',
  },
];

export const CATEGORY_TABS: { id: CategoryId; label: string }[] = [
  { id: 'karbo', label: 'Karbo' },
  { id: 'lauk_utama', label: 'Lauk Utama' },
  { id: 'lauk_pendamping', label: 'Lauk Pendamping' },
  { id: 'sayur_sambal', label: 'Sayur, Kuah & Sambal' },
  { id: 'minuman', label: 'Minuman' },
];

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // 1. KARBO (4 ITEM: 2 Default, 2 Unlockable)
  // ==========================================
  {
    id: 'nasi_putih',
    name: 'Nasi Putih',
    category: 'karbo',
    price: 5000,
    cost: 1500,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'rice',
    shortDesc: 'Nasi putih pulen hangat mengepul.',
    riddleClues: ['nasi putih biasa', 'karbo yang polos pulen'],
  },
  {
    id: 'nasi_uduk',
    name: 'Nasi Uduk',
    category: 'karbo',
    price: 7000,
    cost: 2200,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'rice',
    shortDesc: 'Nasi gurih santan bertabur bawang goreng.',
    riddleClues: [
      'nasi yang gurih wangi santan',
      'nasi berbumbu tabur bawang goreng',
    ],
  },
  {
    id: 'nasi_kuning',
    name: 'Nasi Kuning',
    category: 'karbo',
    price: 8000,
    cost: 2500,
    unlockCost: 28000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'rice',
    shortDesc: 'Nasi kuning kunyit cerah dengan irisan telur dadar tipis.',
    riddleClues: [
      'nasi warna kuning cerah wangi kunyit',
      'nasi selamatan dengan suwiran telur tipis',
    ],
  },
  {
    id: 'nasi_merah',
    name: 'Nasi Merah',
    category: 'karbo',
    price: 7500,
    cost: 2400,
    unlockCost: 30000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'rice',
    shortDesc: 'Nasi beras merah cokelat kemerahan yang sehat & berserat.',
    riddleClues: [
      'nasinya yang merah sehat buat diet',
      'nasi berserat warna cokelat kemerahan',
    ],
  },

  // ==========================================
  // 2. LAUK UTAMA (9 ITEM: 3 Default, 6 Unlockable)
  // ==========================================
  {
    id: 'ayam_goreng',
    name: 'Ayam Goreng Lengkuas',
    category: 'lauk_utama',
    price: 12000,
    cost: 4500,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Paha ayam bumbu lengkuas goreng renyah dengan serundeng.',
    riddleClues: [
      'ayam goreng bumbu lengkuas yang renyah',
      'lauk unggas goreng keemasan',
    ],
  },
  {
    id: 'lele_goreng',
    name: 'Ikan Lele Goreng',
    category: 'lauk_utama',
    price: 11000,
    cost: 4000,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Lele goreng garing khas warung malam.',
    riddleClues: [
      'ikan berkumis goreng garing',
      'lauk ikan air tawar yang renyah',
    ],
  },
  {
    id: 'telur_balado',
    name: 'Telur Balado',
    category: 'lauk_utama',
    price: 8000,
    cost: 2800,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'rebus',
    soundKind: 'scoop',
    shortDesc: 'Telur rebus berselimut sambal merah.',
    riddleClues: ['lauknya telur pedas', 'telur bulat bumbu balado merah'],
  },
  {
    id: 'telur_dadar_padang',
    name: 'Telur Dadar Padang',
    category: 'lauk_utama',
    price: 9000,
    cost: 3000,
    unlockCost: 32000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Telur dadar tebal berlapis daun bawang & cabai merah.',
    riddleClues: [
      'telur dadar yang tebal berlapis',
      'olahan telur goreng tebal khas Padang',
    ],
  },
  {
    id: 'rendang',
    name: 'Rendang Daging',
    category: 'lauk_utama',
    price: 16000,
    cost: 6500,
    unlockCost: 60000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'rebus',
    soundKind: 'scoop',
    shortDesc: 'Daging empuk bumbu rempah santan cokelat gelap.',
    riddleClues: [
      'daging empuk bumbu rempah cokelat tua',
      'lauk daging khas Minang yang gurih pekat',
    ],
  },
  {
    id: 'tongkol_suwir',
    name: 'Tongkol Suwir Pedas',
    category: 'lauk_utama',
    price: 10500,
    cost: 3800,
    unlockCost: 38000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'tumis',
    soundKind: 'scoop',
    shortDesc: 'Ikan tongkol suwir tumis cabai dan kemangi pedas.',
    riddleClues: [
      'ikan laut suwir yang pedas wangi kemangi',
      'suwiran tongkol berbumbu cabai merah',
    ],
  },
  {
    id: 'ayam_bakar',
    name: 'Ayam Bakar Kecap',
    category: 'lauk_utama',
    price: 13500,
    cost: 5000,
    unlockCost: 48000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Ayam panggang karamel bumbu kecap manis smokey.',
    riddleClues: [
      'lauknya ayam bakar cokelat karamel',
      'ayam panggang oles kecap manis gurih',
    ],
  },
  {
    id: 'ati_ampela',
    name: 'Ati Ampela Goreng',
    category: 'lauk_utama',
    price: 9500,
    cost: 3400,
    unlockCost: 34000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Ati ampela ungkep bumbu kuning goreng gurih.',
    riddleClues: [
      'jeroan ayam ungkep yang digoreng gurih',
      'lauk ati ampela bumbu kuning',
    ],
  },
  {
    id: 'ikan_pesmol',
    name: 'Ikan Kembung Pesmol',
    category: 'lauk_utama',
    price: 13000,
    cost: 4800,
    unlockCost: 52000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'rebus',
    soundKind: 'scoop',
    shortDesc: 'Ikan kembung berkuah kuning bumbu acar kunyit segar.',
    riddleClues: [
      'ikan laut berbumbu acar kuning segar',
      'ikan kembung kuah kuning rempah',
    ],
  },

  // ==========================================
  // 3. LAUK PENDAMPING & GORENGAN (8 ITEM: 4 Default, 4 Unlockable)
  // ==========================================
  {
    id: 'tempe_orek',
    name: 'Tempe Orek Basah',
    category: 'lauk_pendamping',
    price: 5000,
    cost: 1500,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'tumis',
    soundKind: 'scoop',
    shortDesc: 'Tempe potong dadu tumis kecap manis gurih.',
    riddleClues: [
      'potongan kedelai tumis kecap manis',
      'lauk pendamping tempe orek basah',
    ],
  },
  {
    id: 'tahu_goreng',
    name: 'Tahu Goreng',
    category: 'lauk_pendamping',
    price: 4000,
    cost: 1200,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Tahu kuning lembut digoreng hangat.',
    riddleClues: [
      'tahu kuning kotak goreng hangat',
      'lauk pendamping kedelai putih lembut',
    ],
  },
  {
    id: 'perkedel',
    name: 'Perkedel Kentang',
    category: 'lauk_pendamping',
    price: 5000,
    cost: 1600,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Kentang tumbuk gurih goreng balut telur.',
    riddleClues: [
      'bulatan kentang goreng yang lembut',
      'gorengan kentang tumbuk berbumbu seledri',
    ],
  },
  {
    id: 'kerupuk',
    name: 'Kerupuk Putih Kaleng',
    category: 'lauk_pendamping',
    price: 2500,
    cost: 700,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'scoop',
    shortDesc: 'Kerupuk kaleng biru renyah pelengkap makan.',
    riddleClues: [
      'yang kriuk-kriuk putih dari kaleng biru',
      'pelengkap renyah biar makannya makin seru',
    ],
  },
  {
    id: 'bakwan_jagung',
    name: 'Bakwan Jagung',
    category: 'lauk_pendamping',
    price: 4500,
    cost: 1400,
    unlockCost: 24000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Gorengan jagung manis renyah dengan daun bawang.',
    riddleClues: [
      'gorengan pipih isi pipilan jagung manis',
      'perkedel jagung renyah keemasan',
    ],
  },
  {
    id: 'tempe_mendoan',
    name: 'Tempe Mendoan',
    category: 'lauk_pendamping',
    price: 5000,
    cost: 1600,
    unlockCost: 26000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'goreng',
    soundKind: 'fry',
    shortDesc: 'Tempe lebar tepung tipis setengah matang dengan daun bawang.',
    riddleClues: [
      'tempe lebar bertepung lembut bertabur daun bawang',
      'gorengan khas Banyumas yang empuk hangat',
    ],
  },
  {
    id: 'kentang_mustofa',
    name: 'Kentang Mustofa',
    category: 'lauk_pendamping',
    price: 5500,
    cost: 1800,
    unlockCost: 28000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'scoop',
    shortDesc: 'Serutan kentang goreng kering balado renyah manis pedas.',
    riddleClues: [
      'kentang serut goreng kering balado renyah',
      'lauk kering pedas manis dari kentang tipis',
    ],
  },
  {
    id: 'peyek_kacang',
    name: 'Peyek Kacang',
    category: 'lauk_pendamping',
    price: 3500,
    cost: 1000,
    unlockCost: 22000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'instan',
    soundKind: 'scoop',
    shortDesc: 'Rempeyek tipis renyah bertabur kacang tanah & daun jeruk.',
    riddleClues: [
      'rempeyek garing bertabur kacang tanah',
      'pelengkap tipis renyah wangi daun jeruk',
    ],
  },

  // ==========================================
  // 4. SAYUR, KUAH & SAMBAL (9 ITEM: 4 Default, 5 Unlockable)
  // ==========================================
  {
    id: 'tumis_kangkung',
    name: 'Tumis Kangkung',
    category: 'sayur_sambal',
    price: 6000,
    cost: 1800,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'bowl',
    cookingStation: 'tumis',
    soundKind: 'fry',
    shortDesc: 'Sayur hijau tumis bawang putih hangat.',
    riddleClues: [
      'sayur hijau tumis bawang putih',
      'cah sayuran daun hijau yang segar',
    ],
  },
  {
    id: 'sayur_sop',
    name: 'Sayur Sop Bening',
    category: 'sayur_sambal',
    price: 7000,
    cost: 2200,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'bowl',
    cookingStation: 'rebus',
    soundKind: 'pour',
    shortDesc: 'Kuah kaldu bening wortel, kentang, dan kol hangat.',
    riddleClues: [
      'sayur kuah bening yang hangat',
      'sayur bening isi wortel sama kentang',
    ],
  },
  {
    id: 'sambal_terasi',
    name: 'Sambal Terasi',
    category: 'sayur_sambal',
    price: 3000,
    cost: 800,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'cobek',
    soundKind: 'scoop',
    shortDesc: 'Sambal merah ulek dengan aroma terasi.',
    riddleClues: ['sambal merah wangi terasi', 'pedas klasik warna merah ulek'],
  },
  {
    id: 'sambal_ijo',
    name: 'Sambal Ijo Padang',
    category: 'sayur_sambal',
    price: 3500,
    cost: 1000,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'plate',
    cookingStation: 'cobek',
    soundKind: 'scoop',
    shortDesc: 'Sambal cabai hijau segar tidak terlalu menyengat.',
    riddleClues: [
      'sambal cabai warna hijau',
      'sambal ijo khas rumah makan Padang',
    ],
  },
  {
    id: 'sayur_asem',
    name: 'Sayur Asem',
    category: 'sayur_sambal',
    price: 7500,
    cost: 2300,
    unlockCost: 30000,
    defaultUnlocked: false,
    platingZone: 'bowl',
    cookingStation: 'rebus',
    soundKind: 'pour',
    shortDesc: 'Kuah asam segar dengan potongan jagung manis dan melinjo.',
    riddleClues: [
      'sayur berkuah asam segar isi jagung manis',
      'kuah bening kemerahan yang asem seger khas Sunda',
    ],
  },
  {
    id: 'sayur_lodeh',
    name: 'Sayur Lodeh',
    category: 'sayur_sambal',
    price: 8000,
    cost: 2500,
    unlockCost: 35000,
    defaultUnlocked: false,
    platingZone: 'bowl',
    cookingStation: 'rebus',
    soundKind: 'pour',
    shortDesc: 'Kuah santan putih kekuningan dengan labu siam & kacang panjang.',
    riddleClues: [
      'yang kuahnya santan gurih putih kekuningan',
      'sayur santan isi labu dan kacang panjang',
    ],
  },
  {
    id: 'tumis_toge_tahu',
    name: 'Tumis Toge Tahu',
    category: 'sayur_sambal',
    price: 6000,
    cost: 1800,
    unlockCost: 26000,
    defaultUnlocked: false,
    platingZone: 'bowl',
    cookingStation: 'tumis',
    soundKind: 'fry',
    shortDesc: 'Toge segar ditumis cepat bersama potongan tahu putih.',
    riddleClues: [
      'oseng kecambah segar pakai potongan tahu',
      'tumisan toge yang renyah gurih',
    ],
  },
  {
    id: 'sambal_matah',
    name: 'Sambal Matah',
    category: 'sayur_sambal',
    price: 4000,
    cost: 1200,
    unlockCost: 28000,
    defaultUnlocked: false,
    platingZone: 'plate',
    cookingStation: 'cobek',
    soundKind: 'scoop',
    shortDesc: 'Irisan bawang merah, serai, dan cabai segar siram minyak hangat.',
    riddleClues: [
      'sambal irisan bawang merah segar khas Bali',
      'sambal mentah wangi serai dan jeruk limau',
    ],
  },
  {
    id: 'kuah_gulai',
    name: 'Kuah Gulai Siram',
    category: 'sayur_sambal',
    price: 5500,
    cost: 1800,
    unlockCost: 36000,
    defaultUnlocked: false,
    platingZone: 'bowl',
    cookingStation: 'rebus',
    soundKind: 'pour',
    shortDesc: 'Kuah santan rempah kunyit kuning pekat penghangat selera.',
    riddleClues: [
      'kuah santan kuning rempah yang kental gurih',
      'saus kuah gulai hangat khas Nusantara',
    ],
  },

  // ==========================================
  // 5. MINUMAN (7 ITEM: 3 Default, 4 Unlockable)
  // ==========================================
  {
    id: 'es_teh',
    name: 'Es Teh Manis',
    category: 'minuman',
    price: 4000,
    cost: 1000,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: true,
    soundKind: 'pour',
    shortDesc: 'Teh seduh manis dingin penuh es batu.',
    riddleClues: [
      'minuman manis dingin warna cokelat',
      'teh dingin penyegar dahaga',
    ],
  },
  {
    id: 'es_jeruk',
    name: 'Es Jeruk Peras',
    category: 'minuman',
    price: 6000,
    cost: 1800,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: true,
    soundKind: 'pour',
    shortDesc: 'Perasan jeruk peras manis asam segar.',
    riddleClues: [
      'minumnya yang asem seger',
      'perasan buah sitrus dingin pakai es',
    ],
  },
  {
    id: 'kopi_hitam',
    name: 'Kopi Hitam Tubruk',
    category: 'minuman',
    price: 5000,
    cost: 1400,
    unlockCost: 0,
    defaultUnlocked: true,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: false,
    soundKind: 'pour',
    shortDesc: 'Kopi tubruk hangat harum mantap tanpa ampas berlebih.',
    riddleClues: [
      'minuman hitam hangat penghilang kantuk',
      'kopi tubruk panas pahit mantap',
    ],
  },
  {
    id: 'teh_tawar_hangat',
    name: 'Teh Tawar Hangat',
    category: 'minuman',
    price: 3000,
    cost: 700,
    unlockCost: 20000,
    defaultUnlocked: false,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: false,
    soundKind: 'pour',
    shortDesc: 'Seduhan teh melati hangat tanpa gula, pas untuk diet & tenggorokan.',
    riddleClues: [
      'minumnya teh hangat tawar aja',
      'minuman teh polos hangat tanpa gula',
    ],
  },
  {
    id: 'es_sirup',
    name: 'Es Sirup Cocopandan',
    category: 'minuman',
    price: 5500,
    cost: 1600,
    unlockCost: 25000,
    defaultUnlocked: false,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: true,
    soundKind: 'pour',
    shortDesc: 'Sirup merah muda manis segar wangi pandan & kelapa.',
    riddleClues: [
      'minumnya yang merah manis dingin',
      'es sirup pink wangi cocopandan segar',
    ],
  },
  {
    id: 'wedang_jahe',
    name: 'Wedang Jahe Hangat',
    category: 'minuman',
    price: 6500,
    cost: 2000,
    unlockCost: 30000,
    defaultUnlocked: false,
    platingZone: 'cup',
    cookingStation: 'rebus',
    isColdDrink: false,
    soundKind: 'pour',
    shortDesc: 'Seduhan jahe bakar cokelat keemasan dengan gula aren & irisan jahe.',
    riddleClues: [
      'minuman rempah jahe hangat anti masuk angin',
      'wedang cokelat keemasan yang menghangatkan badan',
    ],
  },
  {
    id: 'es_cendol',
    name: 'Es Cendol Sederhana',
    category: 'minuman',
    price: 7500,
    cost: 2400,
    unlockCost: 34000,
    defaultUnlocked: false,
    platingZone: 'cup',
    cookingStation: 'instan',
    isColdDrink: true,
    soundKind: 'pour',
    shortDesc: 'Bulir cendol pandan hijau dengan santan gurih dan gula merah.',
    riddleClues: [
      'minuman dingin isi cendol hijau & gula merah',
      'es manis gurih santan dengan dawet pandan',
    ],
  },
];

export const MENU_BY_ID: Record<MenuItemId, MenuItem> = MENU_ITEMS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<MenuItemId, MenuItem>
);

export const DEFAULT_UNLOCKED_RECIPES: MenuItemId[] = MENU_ITEMS.filter(
  (m) => m.defaultUnlocked
).map((m) => m.id);

export const ALL_RECIPE_IDS: MenuItemId[] = MENU_ITEMS.map((m) => m.id);

export const UPGRADES: UpgradeItem[] = [
  {
    id: 'poster_warung',
    name: 'Poster Warung',
    cost: 35000,
    description: 'Poster menu klasik di dinding kayu bikin suasana makin hangat.',
    effectLabel: '+Rp 1.500 tip tiap pesanan akurat',
  },
  {
    id: 'kipas_angin',
    name: 'Kipas Angin Dinding',
    cost: 40000,
    description: 'Angin sepoi-sepoi bikin pelanggan betah duduk santai.',
    effectLabel: '+Rp 2.000 tip tiap pesanan akurat',
  },
  {
    id: 'radio_retro',
    name: 'Radio Retro',
    cost: 55000,
    description: 'Alunan lagu lawas menemani pelanggan menyantap hidangan.',
    effectLabel: '+Rp 2.500 tip tiap pesanan akurat',
  },
  {
    id: 'rice_cooker',
    name: 'Rice Cooker Hangat',
    cost: 70000,
    description: 'Nasi putih, uduk, kuning & merah selalu pulen sempurna.',
    effectLabel: '+Rp 3.500 tip jika ada pesanan nasi tepat',
  },
  {
    id: 'etalase_besar',
    name: 'Etalase Besar',
    cost: 90000,
    description:
      'Etalase kaca hijau berbingkai kuningan yang bikin lauk makin menggoda.',
    effectLabel: '+25% bonus total tip pelanggan',
  },
];

export const VIP_PROFILES: VipProfile[] = [
  {
    id: 'bang_jaka',
    name: 'Bang Jaka',
    role: 'Driver Ojol',
    personality:
      'Ramah & enerjik, selalu butuh porsi mengenyangkan dan minuman segar.',
    favoriteSummary: 'Nasi Uduk, Ayam Goreng, Tempe Orek, Es Teh Manis',
    favoriteItems: ['nasi_uduk', 'ayam_goreng', 'tempe_orek', 'es_teh'],
    heart3Story:
      '“Wah makin akrab aja kita! Nih resep Paket Gaspol Ojol andalan saya biar tarikan orderan lancar terus!”',
    heart5Story:
      '“Kalau lagi capek di jalan, ingetnya pasti masakanmu yang hangat. Ini resep Nasi Komplit Jagoan khusus buat kamu!”',
  },
  {
    id: 'dinda',
    name: 'Dinda',
    role: 'Mahasiswi',
    personality:
      'Ceria dan suka teka-teki pesanan santai dengan menu praktis.',
    favoriteSummary: 'Nasi Uduk, Telur Balado, Tumis Kangkung, Es Jeruk Peras',
    favoriteItems: ['nasi_uduk', 'telur_balado', 'tumis_kangkung', 'es_jeruk'],
    heart3Story:
      '“Kakak selalu hafal seleraku pas lembur tugas! Ini resep Nasi Uduk Skripsi favoritku ya.”',
    heart5Story:
      '“Makasih banget udah jadi penyelamat pas skripsi! Nih resep Menu Praktis Kampus biar semangat nulis terus.”',
  },
  {
    id: 'riko',
    name: 'Riko',
    role: 'Anak Kos',
    personality:
      'Hemat, santai, dan jago meracik kombinasi hemat di akhir bulan.',
    favoriteSummary: 'Nasi Putih, Tempe Orek, Kerupuk Putih, Es Teh Manis',
    favoriteItems: ['nasi_putih', 'tempe_orek', 'kerupuk', 'es_teh'],
    heart3Story:
      '“Bro/Sis, warung ini udah kayak rumah kedua! Cobain nih resep legendaris Kombo Tanggal Tua.”',
    heart5Story:
      '“Tanggal tua pun hati tetap tenang kalau makan di sini. Ini dia Paket Anak Kos Spesial paling mantap!”',
  },
  {
    id: 'bu_tejo',
    name: 'Bu Tejo',
    role: 'Ibu Komplek',
    personality:
      'Teliti soal detail sambal, takaran minuman, dan cara penyajian kuah.',
    favoriteSummary: 'Sayur Lodeh / Tumis Kangkung Siram, Perkedel, Sambal Terasi',
    favoriteItems: ['nasi_putih', 'sayur_lodeh', 'perkedel', 'sambal_terasi'],
    heart3Story:
      '“Ibu paling suka warung yang telaten sama kuah santan dan sambalnya. Ibu bagiin resep Lodeh Spesial Bu Tejo ya!”',
    heart5Story:
      '“Sudah Ibu anggap keluarga sendiri! Ini resep Nasi Siram Spesial andalan keluarga Ibu.”',
  },
  {
    id: 'pak_darman',
    name: 'Pak Darman',
    role: 'Penjaga Malam',
    personality:
      'Tenang dan bijaksana, sering mampir saat sore atau hujan rintik.',
    favoriteSummary: 'Kopi Hitam Tubruk, Tahu Goreng, Perkedel, Lele Goreng',
    favoriteItems: ['tahu_goreng', 'perkedel', 'lele_goreng', 'kopi_hitam'],
    preferredWeather: ['sore_senja', 'hujan_rintik'],
    heart3Story:
      '“Gerimis begini paling nikmat ngopi hangat. Bapak titip resep Kopi Begadang Pos Ronda ya.”',
    heart5Story:
      '“Terima kasih selalu menemani Bapak sebelum keliling ronda. Ini Paket Ronda Hangat istimewa dari Bapak.”',
  },
  {
    id: 'koh_hendra',
    name: 'Koh Hendra',
    role: 'Pemilik Toko',
    personality:
      'Dermawan dan pecinta hidangan ikan bumbu kuning yang berkelas.',
    favoriteSummary: 'Ikan Kembung Pesmol, Nasi Kuning, Sambal Matah',
    favoriteItems: ['nasi_kuning', 'ikan_pesmol', 'sambal_matah', 'es_jeruk'],
    heart3Story:
      '“Wah masakanmu makin mantap saja! Koko bagikan resep Pesmol Sultan kesukaan keluarga Koko ya.”',
    heart5Story:
      '“Sudah langganan sejati nih! Ini dia menu Pesta Lauk Koh Hendra buat merayakan toko ramai.”',
  },
  {
    id: 'teh_sari',
    name: 'Teh Sari',
    role: 'Penjaga Apotek',
    personality:
      'Peduli kesehatan, suka wedang jahe hangat, sayur sop, dan menu rendah minyak.',
    favoriteSummary: 'Nasi Merah, Sayur Sop Bening, Wedang Jahe Hangat',
    favoriteItems: ['nasi_merah', 'sayur_sop', 'tahu_goreng', 'wedang_jahe'],
    preferredWeather: ['hujan_rintik', 'pagi_cerah'],
    heart3Story:
      '“Kalau musim hujan begini harus jaga imun! Teteh kasih resep Paket Sehat Anti Masuk Angin ya.”',
    heart5Story:
      '“Senang banget ada warteg yang bersih dan sehat begini. Ini Menu Bugar Teh Sari andalan Teteh!”',
  },
  {
    id: 'kang_ujang',
    name: 'Kang Ujang',
    role: 'Montir Bengkel',
    personality:
      'Gagah dan doyan pedas, suka rendang, sambal ijo, dan porsi ekstra.',
    favoriteSummary: 'Rendang Daging, Sambal Ijo Padang, Es Cendol / Kopi Hitam',
    favoriteItems: ['nasi_putih', 'rendang', 'sambal_ijo', 'kopi_hitam'],
    heart3Story:
      '“Mantap pisan euy! Habis bongkar mesin, paling pas makan Rendang Pedas Bengkel resep Akang ini!”',
    heart5Story:
      '“Warung juara! Nih Akang kasih Porsi Tenaga Bengkel biar pelanggan makin semangat kerja.”',
  },
];

export const VIP_BY_ID: Record<VipCustomerId, VipProfile> = VIP_PROFILES.reduce(
  (acc, v) => {
    acc[v.id] = v;
    return acc;
  },
  {} as Record<VipCustomerId, VipProfile>
);

export const VIP_CUSTOMER_IDS: VipCustomerId[] = VIP_PROFILES.map((v) => v.id);

export const SECRET_RECIPES: SecretRecipe[] = [
  {
    id: 'paket_gaspol_ojol',
    name: 'Paket Gaspol Ojol',
    vipId: 'bang_jaka',
    unlockAtHearts: 3,
    ingredients: ['nasi_uduk', 'ayam_goreng', 'tempe_orek', 'es_teh'],
    description: 'Porsi penuh tenaga untuk driver yang menembus jalanan.',
  },
  {
    id: 'nasi_komplit_jagoan',
    name: 'Nasi Komplit Jagoan',
    vipId: 'bang_jaka',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_uduk',
      'ayam_goreng',
      'perkedel',
      'sambal_terasi',
      'es_jeruk',
    ],
    description: 'Kombo mewah penuh energi favorit Bang Jaka di akhir pekan.',
  },
  {
    id: 'nasi_uduk_skripsi',
    name: 'Nasi Uduk Skripsi',
    vipId: 'dinda',
    unlockAtHearts: 3,
    ingredients: ['nasi_uduk', 'telur_balado', 'tumis_kangkung', 'es_jeruk'],
    description: 'Gurih pedas segar penambah semangat ngerjain tugas.',
  },
  {
    id: 'menu_praktis_kampus',
    name: 'Menu Praktis Kampus',
    vipId: 'dinda',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_putih',
      'telur_balado',
      'tahu_goreng',
      'kerupuk',
      'es_jeruk',
    ],
    description: 'Praktis, cepat, dan pas untuk jam istirahat kuliah.',
  },
  {
    id: 'kombo_tanggal_tua',
    name: 'Kombo Tanggal Tua',
    vipId: 'riko',
    unlockAtHearts: 3,
    ingredients: ['nasi_putih', 'tempe_orek', 'kerupuk', 'es_teh'],
    description: 'Hemat bersahaja tapi tetap nikmat luar biasa.',
  },
  {
    id: 'paket_anak_kos_spesial',
    name: 'Paket Anak Kos Spesial',
    vipId: 'riko',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_putih',
      'tahu_goreng',
      'tempe_orek',
      'sambal_terasi',
      'kerupuk',
    ],
    description: 'Kombinasi lauk pendamping + sambal renyah andalan Riko.',
  },
  {
    id: 'lodeh_spesial_bu_tejo',
    name: 'Lodeh Spesial Bu Tejo',
    vipId: 'bu_tejo',
    unlockAtHearts: 3,
    ingredients: ['nasi_putih', 'sayur_lodeh', 'perkedel', 'sambal_terasi'],
    requiredPrefs: { soupStyle: 'pisah' },
    description: 'Sayur lodeh santan gurih dipisah mangkuk dengan perkedel.',
  },
  {
    id: 'nasi_siram_spesial',
    name: 'Nasi Siram Spesial',
    vipId: 'bu_tejo',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_putih',
      'tumis_kangkung',
      'perkedel',
      'sambal_terasi',
      'es_teh',
    ],
    requiredPrefs: { soupStyle: 'siram', iceLevel: 'tanpa_es', sweetness: 'tawar' },
    description: 'Nasi siram hangat plus teh tawar tanpa es ala Bu Tejo.',
  },
  {
    id: 'kopi_begadang_pos_ronda',
    name: 'Kopi Begadang Pos Ronda',
    vipId: 'pak_darman',
    unlockAtHearts: 3,
    ingredients: ['tahu_goreng', 'perkedel', 'kopi_hitam'],
    description: 'Sajian gorengan hangat pendamping kopi hitam tanpa rasa kantuk.',
  },
  {
    id: 'paket_ronda_hangat',
    name: 'Paket Ronda Hangat',
    vipId: 'pak_darman',
    unlockAtHearts: 5,
    ingredients: ['nasi_putih', 'lele_goreng', 'sambal_terasi', 'kopi_hitam'],
    description: 'Makan malam mantap plus kopi hitam sebelum keliling komplek.',
  },
  {
    id: 'pesmol_sultan',
    name: 'Pesmol Sultan',
    vipId: 'koh_hendra',
    unlockAtHearts: 3,
    ingredients: ['nasi_kuning', 'ikan_pesmol', 'sambal_matah', 'es_jeruk'],
    description: 'Ikan kembung pesmol kuning bertemu nasi kuning & sambal matah.',
  },
  {
    id: 'pesta_lauk_koh_hendra',
    name: 'Pesta Lauk Koh Hendra',
    vipId: 'koh_hendra',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_kuning',
      'ikan_pesmol',
      'ayam_bakar',
      'bakwan_jagung',
      'es_cendol',
    ],
    description: 'Perjamuan lengkap Nusantara favorit Koh Hendra.',
  },
  {
    id: 'paket_sehat_anti_masuk_angin',
    name: 'Paket Sehat Anti Masuk Angin',
    vipId: 'teh_sari',
    unlockAtHearts: 3,
    ingredients: ['nasi_putih', 'sayur_sop', 'tahu_goreng', 'wedang_jahe'],
    description: 'Kuah sop bening hangat & wedang jahe pengusir hawa dingin.',
  },
  {
    id: 'menu_bugar_teh_sari',
    name: 'Menu Bugar Teh Sari',
    vipId: 'teh_sari',
    unlockAtHearts: 5,
    ingredients: ['nasi_merah', 'ayam_bakar', 'tumis_toge_tahu', 'teh_tawar_hangat'],
    description: 'Tinggi serat, rendah gula, dan seimbang untuk harian.',
  },
  {
    id: 'rendang_pedas_bengkel',
    name: 'Rendang Pedas Bengkel',
    vipId: 'kang_ujang',
    unlockAtHearts: 3,
    ingredients: ['nasi_putih', 'rendang', 'sambal_ijo', 'kopi_hitam'],
    description: 'Bumbu rendang pekat, sambal ijo Padang, dan kopi tubruk.',
  },
  {
    id: 'porsi_tenaga_bengkel',
    name: 'Porsi Tenaga Bengkel',
    vipId: 'kang_ujang',
    unlockAtHearts: 5,
    ingredients: [
      'nasi_uduk',
      'rendang',
      'telur_dadar_padang',
      'kuah_gulai',
      'es_teh',
    ],
    requiredPrefs: { soupStyle: 'siram' },
    description: 'Porsi dobel rendang + telur dadar siram kuah gulai mantap!',
  },
];

export const SECRET_RECIPE_BY_ID = SECRET_RECIPES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<SecretRecipe['id'], SecretRecipe>
);

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'pelanggan_pertama',
    title: 'Pelanggan Pertama',
    description: 'Layani pelanggan pertamamu di Warung Rasa Nusantara.',
  },
  {
    id: 'racikan_sempurna',
    title: 'Racikan Sempurna',
    description: 'Sajikan 5 pesanan dengan tingkat akurasi Sempurna.',
  },
  {
    id: 'pecinta_pedas',
    title: 'Pecinta Pedas',
    description: 'Sajikan 5 pesanan yang menggunakan Sambal Terasi, Ijo, atau Matah.',
  },
  {
    id: 'sahabat_anak_kos',
    title: 'Sahabat Anak Kos',
    description: 'Capai 3 Hati kedekatan dengan Riko dan buka Kombo Tanggal Tua.',
  },
  {
    id: 'penjaga_malam',
    title: 'Teman Jaga Malam',
    description: 'Layani Pak Darman saat cuaca Sore Senja atau Hujan Rintik.',
  },
  {
    id: 'ahli_penyajian',
    title: 'Ahli Penyajian',
    description: 'Penuhi 3 pesanan dengan permintaan detail kuah/es/gula yang tepat.',
  },
  {
    id: 'juragan_warteg',
    title: 'Juragan Warteg',
    description: 'Kumpulkan saldo kas Rp 150.000 atau buka semua 37 menu reguler.',
  },
  {
    id: 'keluarga_warung',
    title: 'Keluarga Besar Warung',
    description: 'Capai 5 Hati kedekatan penuh dengan salah satu pelanggan tetap.',
  },
];

export const CUSTOMERS: CustomerArchetype[] = [
  // 8 VIP Regular Customers
  {
    id: 'bang_jaka',
    name: 'Bang Jaka',
    role: 'Driver Ojol · Langganan',
    isVip: true,
    greetings: [
      'Halo Bos! Abis antar orderan keliling kota, saatnya isi tangki perut nih.',
      'Mampir lagi ya! Lapar banget butuh porsi mantap dan yang seger.',
    ],
  },
  {
    id: 'dinda',
    name: 'Dinda',
    role: 'Mahasiswi · Langganan',
    isVip: true,
    greetings: [
      'Hai Kak! Baru kelar kelas sore, lagi pengen tebak-tebakan menu nih.',
      'Permisi Kak, warteg paling nyaman buat makan santai habis kuliah!',
    ],
  },
  {
    id: 'riko',
    name: 'Riko',
    role: 'Anak Kos · Langganan',
    isVip: true,
    greetings: [
      'Permisi Kak! Anak kos mampir lagi cari menu hemat penyelamat akhir bulan.',
      'Halo Kak, hari ini ada menu yang hemat tapi tetep nendang nggak?',
    ],
  },
  {
    id: 'bu_tejo',
    name: 'Bu Tejo',
    role: 'Ibu Komplek · Langganan',
    isVip: true,
    greetings: [
      'Permisi Nak, Ibu mampir ya. Ibu titip perhatikan sambal sama penyajiannya lho.',
      'Selamat makan! Tolong buatkan sesuai catatan Ibu ya Nak.',
    ],
  },
  {
    id: 'pak_darman',
    name: 'Pak Darman',
    role: 'Penjaga Malam · Langganan',
    isVip: true,
    greetings: [
      'Malam Nak, sebelum Bapak keliling pos ronda, mampir hangatkan badan dulu.',
      'Syukur warungnya masih buka, adem begini enaknya ngopi sama gorengan.',
    ],
  },
  {
    id: 'koh_hendra',
    name: 'Koh Hendra',
    role: 'Pemilik Toko · Langganan',
    isVip: true,
    greetings: [
      'Halo Boss! Toko sebelah lagi rame, Koko cari makan siang yang sedap dulu.',
      'Wah wangi masakannya sampai ke toko Koko nih!',
    ],
  },
  {
    id: 'teh_sari',
    name: 'Teh Sari',
    role: 'Penjaga Apotek · Langganan',
    isVip: true,
    greetings: [
      'Punten Kak, Teteh istirahat jaga apotek dulu cari yang hangat dan sehat.',
      'Halo Kak! Lagi pengen menu bergizi biar tetap bugar jaga apotek.',
    ],
  },
  {
    id: 'kang_ujang',
    name: 'Kang Ujang',
    role: 'Montir Bengkel · Langganan',
    isVip: true,
    greetings: [
      'Sampurasun Bos! Habis turun mesin, butuh porsi bertenaga nih!',
      'Halo Bos, yang pedas-pedas mantap ada kan buat tenaga bengkel?',
    ],
  },

  // 12 Regular Townfolk Customers
  {
    id: 'mas_karyawan',
    name: 'Mas Karyawan Kantoran',
    role: 'Karyawan · Warga',
    greetings: [
      'Siang! Jam istirahat kantor cuma sebentar, pesan paket komplit cepat ya.',
      'Halo Mas/Mbak, pesan makan siang yang rapi sebelum balik rapat.',
    ],
  },
  {
    id: 'ibu_pasar',
    name: 'Ibu Belanja Pasar',
    role: 'Warga Komplek',
    greetings: [
      'Aduh capek habis belanja dari pasar pagi, mampir makan dulu ah.',
      'Permisi Nak, Ibu baru pulang dari pasar, cari sayur segar sama ikan.',
    ],
  },
  {
    id: 'bapak_proyek',
    name: 'Bapak Tukang Proyek',
    role: 'Pekerja Konstruksi',
    greetings: [
      'Siang Bos! Habis ngecor dari pagi, butuh porsi dobel dua lauk nih!',
      'Permisi, masih ada lauk banyak kan? Perut lagi lapar banget!',
    ],
  },
  {
    id: 'pelajar_sma',
    name: 'Pelajar SMA',
    role: 'Siswa Sekolah',
    greetings: [
      'Permisi Kak! Baru pulang sekolah nih, jajan makan siang yang enak ya.',
      'Halo Kak, anak sekolah mampir cari gorengan, telur, sama minuman dingin!',
    ],
  },
  {
    id: 'mas_pelari',
    name: 'Mas Pelari / Anak Gym',
    role: 'Pegiat Olahraga',
    greetings: [
      'Pagi Kak! Habis lari 5K nih, cari menu tinggi protein dan sehat.',
      'Permisi, ada menu diet bersih tanpa terlalu berminyak nggak?',
    ],
  },
  {
    id: 'nenek_ramah',
    name: 'Nenek Ramah',
    role: 'Sesepuh Kampung',
    greetings: [
      'Nak, Nenek mampir beli makan ya, nggak usah buru-buru.',
      'Lampunya hangat sekali, Nenek suka makanan lembut yang berkuah hangat.',
    ],
  },
  {
    id: 'mas_kurir',
    name: 'Mas Kurir Paket',
    role: 'Kurir Ekspedisi',
    greetings: [
      'Paket! Eh salah, saya mau pesan makan siang praktis sama yang dingin seger!',
      'Permisi Kak, abis keliling antar paket di terik matahari nih.',
    ],
  },
  {
    id: 'mbak_perawat',
    name: 'Mbak Perawat',
    role: 'Perawat Klinik',
    greetings: [
      'Halo Kak, habis shift jaga klinik nih, pengen minuman hangat biar rileks.',
      'Permisi Kak, mampir sebentar sebelum lanjut jaga sore di klinik.',
    ],
  },
  {
    id: 'bapak_angkot',
    name: 'Bapak Sopir Angkot',
    role: 'Sopir Angkot',
    greetings: [
      'Ngetem sebentar Bos! Cari lauk pedas mantap sama kopi tubruk dulu.',
      'Permisi Bos, istirahat putaran trayek, isi tenaga dulu ya.',
    ],
  },
  {
    id: 'anak_kecil',
    name: 'Anak Kecil Jajan',
    role: 'Bocah Tetangga',
    greetings: [
      'Kakak! Aku mau beli jajanan gorengan sama minuman yang manis ya!',
      'Permisi Kak, aku bawa uang jajan mau beli kriuk-kriuk sama es!',
    ],
  },
  {
    id: 'mas_indie',
    name: 'Mas Anak Indie',
    role: 'Musisi Kafe',
    greetings: [
      'Yo Kak, baru kelar latihan akustik nih. Pengen sesuatu yang santai dan hangat.',
      'Sore Kak, suasana warungnya syahdu banget buat makan sambil ngopi.',
    ],
  },
  {
    id: 'ibu_guru',
    name: 'Ibu Guru',
    role: 'Guru SD Tetangga',
    greetings: [
      'Selamat siang Nak, Ibu izin pesan dengan teka-teki kecil boleh ya?',
      'Permisi Nak, habis mengajar di kelas, Ibu cari santapan yang menenangkan.',
    ],
  },
];
