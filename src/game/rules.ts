import {
  ACHIEVEMENTS,
  ALL_RECIPE_IDS,
  CUSTOMERS,
  DEFAULT_UNLOCKED_RECIPES,
  MENU_BY_ID,
  MENU_ITEMS,
  SECRET_RECIPES,
  SECRET_RECIPE_BY_ID,
  UPGRADES,
  VIP_BY_ID,
  VIP_CUSTOMER_IDS,
} from './data';
import {
  AccuracyTier,
  AchievementDef,
  AchievementId,
  CookingStationId,
  CookingStatus,
  CustomerArchetype,
  CustomerArchetypeId,
  CustomerOrder,
  DailySummary,
  GameMode,
  GameSaveState,
  KitchenSlotState,
  MenuItemId,
  OrderEvaluation,
  OrderPatternType,
  PlayerStats,
  RequestedServingPrefs,
  SecretRecipe,
  SecretRecipeId,
  ServedRecord,
  ServingOptions,
  UpgradeId,
  VipCustomerId,
  WeatherType,
} from './types';

export const STARTER_PORTION_STOCK = 4;
export const COOK_BATCH_YIELD = 4;
export const COBEK_MAX_GRINDS = 6;
export const COBEK_MATANG_GRINDS = 5;
export const FRESHLY_COOKED_BONUS_PER_ITEM = 2000;
export const ZEN_CHEAT_CODE = 'WARUNGSULTAN';
export const ZEN_SIGN_CLICK_TARGET = 7;

export const SAVE_STORAGE_KEY = 'warung_rasa_nusantara_save_v1';
export const DEFAULT_WARUNG_NAME = 'WARUNG RASA NUSANTARA';

export const DEFAULT_SERVING_OPTIONS: ServingOptions = {
  soupStyle: 'pisah',
  iceLevel: 'normal',
  sweetness: 'manis',
};

export const WEATHER_SEQUENCE: WeatherType[] = [
  'pagi_cerah',
  'sore_senja',
  'hujan_rintik',
];

export const WEATHER_INFO: Record<
  WeatherType,
  { label: string; atmosphereNote: string }
> = {
  pagi_cerah: {
    label: 'Pagi Cerah',
    atmosphereNote: 'Sinar pagi hangat menyapa warung.',
  },
  sore_senja: {
    label: 'Sore Senja',
    atmosphereNote: 'Langit jingga senja menemani makan malam.',
  },
  hujan_rintik: {
    label: 'Hujan Rintik',
    atmosphereNote: 'Gerimis syahdu, pelanggan cari yang hangat & pedas.',
  },
};

// 48+ varied cozy order dialogue templates across 5 order patterns
export const ORDER_DIALOGUE_TEMPLATES: Record<OrderPatternType, string[]> = {
  langsung: [
    'Saya pesan {items} ya.',
    'Boleh minta tolong racikkan {items} untuk sekarang?',
    'Kali ini saya pengen makan {items} aja, Kak.',
    'Buatkan satu porsi {items} ya, nggak usah buru-buru.',
    'Lagi kangen masakan rumahan, pesan {items} ya.',
    'Tolong siapkan {items} ya, mumpung masih hangat.',
    'Saya ambil {items} buat makan santai di sini.',
    'Pesenannya {items} aja ya, sesuai selera warteg.',
    'Hari ini menunya {items} ya Kak, kelihatan menggoda semua.',
    'Bungkus semangat makan siang dengan {items} ya!',
    'Minta diracik {items} dong, aromanya bikin laper.',
    'Satu set {items} ya Kak, terima kasih sebelumnya.',
  ],
  teka_teki: [
    'Lagi pengen {clues}, coba tebak dari etalase ya!',
    'Hari ini nggak mau sebut nama menu ah, kasih aja {clues}.',
    'Menu santai buat nebak: saya mau {clues}.',
    'Cariin yang cocok buat selera sekarang: {clues}.',
    'Teka-teki makan siang nih: tolong racikkan {clues}.',
    'Biar seru, pesanannya {clues} ya Kak.',
    'Pengen kombinasi yang pas: {clues}.',
    'Kasih saya {clues}, Kak pasti langsung paham maksudnya!',
    'Lagi ngidam {clues} nih, kira-kira yang mana ya?',
    'Coba pilihkan {clues} dari etalase hijau itu.',
    'Mood makan hari ini maunya {clues}.',
    'Racikkan pesanan rahasia kecil: {clues}.',
  ],
  porsi_ekstra: [
    'Perut lagi keroncongan banget! Kasih porsi ekstra dobel lauk ya: {items}.',
    'Habis kerja keras nih, minta porsi kuli isi {items} ya Bos!',
    'Lagi laper berat! Tolong penuhi piring dengan {items}.',
    'Butuh tenaga penuh hari ini, buatkan porsi ekstra {items} ya.',
    'Nggak cukup satu lauk kalau sekarang, pesan komplit {items}!',
    'Porsi jagoan dong Kak, isinya {items} biar puas.',
    'Lagi pengen makan puas tanpa sisa, kasih {items} ya.',
    'Tambah lauk biar mantap! Saya pesan {items}.',
    'Biar kenyang sampai malam, racikkan {items} ya.',
    'Hari ini traktir diri sendiri, pesan ekstra {items}!',
  ],
  cuaca: [
    'Cuaca {weather} begini paling pas menyantap {items} nih.',
    'Suasana {weather} bikin perut manggil-manggil {items} ya.',
    'Ditemani hawa {weather}, tolong buatkan {items} dong.',
    'Melihat langit {weather} di jendela, jadi pengen banget {items}.',
    'Pas banget lagi {weather}, rasanya nikmat kalau makan {items}.',
    'Biar makin klop sama suasana {weather}, saya pesan {items}.',
    'Hawa {weather} begini enaknya ditemani {items} yang mantap.',
    'Cocok sama cuaca {weather} hari ini, racikkan {items} ya.',
    'Kalau lagi {weather}, andalanku selalu {items}.',
    'Nikmatnya suasana {weather} sambil menyantap {items}!',
  ],
  resep_rahasia: [
    'Saya mau pesan Resep Rahasia "{secretName}" ya!',
    'Kangen racikan istimewa "{secretName}", buatkan satu ya!',
    'Seperti biasa langganan akrab, pesan "{secretName}" dong!',
    'Hari ini waktunya menikmati Resep Rahasia "{secretName}"!',
  ],
};

export function createDefaultVipHearts(): Record<VipCustomerId, number> {
  return {
    bang_jaka: 1,
    dinda: 1,
    riko: 1,
    bu_tejo: 1,
    pak_darman: 1,
    koh_hendra: 1,
    teh_sari: 1,
    kang_ujang: 1,
  };
}

export function createDefaultStats(): PlayerStats {
  return {
    perfectServedCount: 0,
    spicyServedCount: 0,
    prefMatchedCount: 0,
    servedPakDarmanNight: false,
  };
}

export function sanitizeWarungName(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim().slice(0, 28);
  return cleaned.length > 0 ? cleaned.toUpperCase() : DEFAULT_WARUNG_NAME;
}

export function getWeatherForDay(day: number): WeatherType {
  const idx = Math.max(0, day - 1) % WEATHER_SEQUENCE.length;
  return WEATHER_SEQUENCE[idx];
}

export function getWeatherForEndless(servedCount: number): WeatherType {
  const idx = Math.floor(Math.max(0, servedCount) / 3) % WEATHER_SEQUENCE.length;
  return WEATHER_SEQUENCE[idx];
}

export function createDefaultItemStock(): Record<MenuItemId, number> {
  const stock = {} as Record<MenuItemId, number>;
  for (const item of MENU_ITEMS) {
    stock[item.id] =
      item.cookingStation === 'instan' ? 99 : STARTER_PORTION_STOCK;
  }
  return stock;
}

export function createInitialKitchenSlots(): Record<
  CookingStationId,
  KitchenSlotState
> {
  const mk = (station: CookingStationId): KitchenSlotState => ({
    station,
    itemId: null,
    progress: 0,
    grindCount: 0,
    stirBoostCount: 0,
    lastActionAt: 0,
    dingPlayed: false,
    burntSoundPlayed: false,
  });
  return {
    goreng: mk('goreng'),
    rebus: mk('rebus'),
    tumis: mk('tumis'),
    cobek: mk('cobek'),
  };
}

export function getCookingStatus(slot: KitchenSlotState): CookingStatus {
  if (slot.station === 'cobek') {
    return slot.grindCount >= COBEK_MATANG_GRINDS ? 'matang' : 'mentah';
  }
  if (slot.progress < 50) return 'mentah';
  if (slot.progress <= 85) return 'matang';
  return 'gosong';
}

export function isApproachingBurn(slot: KitchenSlotState): boolean {
  return (
    slot.station !== 'cobek' &&
    slot.itemId !== null &&
    slot.progress >= 76 &&
    slot.progress <= 85
  );
}

export function getSlotDisplayPercent(slot: KitchenSlotState): number {
  if (!slot.itemId) return 0;
  if (slot.station === 'cobek') {
    return Math.min(100, Math.round((slot.grindCount / COBEK_MAX_GRINDS) * 100));
  }
  return Math.min(100, Math.max(0, Math.round(slot.progress)));
}

export function startCookingInSlot(
  slots: Record<CookingStationId, KitchenSlotState>,
  station: CookingStationId,
  itemId: MenuItemId,
  resumeProgress = 0
): Record<CookingStationId, KitchenSlotState> {
  const clampedProgress = Math.max(0, Math.min(48, resumeProgress));
  return {
    ...slots,
    [station]: {
      station,
      itemId,
      progress: station === 'cobek' ? 0 : clampedProgress,
      grindCount: 0,
      stirBoostCount: 0,
      lastActionAt: Date.now(),
      dingPlayed: false,
      burntSoundPlayed: false,
    },
  };
}

export function advanceKitchenSlots(
  slots: Record<CookingStationId, KitchenSlotState>,
  dtSec: number
): {
  slots: Record<CookingStationId, KitchenSlotState>;
  dingStations: CookingStationId[];
  burntStations: CookingStationId[];
} {
  const rates: Record<Exclude<CookingStationId, 'cobek'>, number> = {
    goreng: 5.2, // ~9.6s to 50%, ~6.7s Matang window (50-85%), cozy & responsive
    rebus: 4.5, // ~11.1s to 50%, ~7.8s Matang window
    tumis: 3.0, // slower passive rate so "Aduk Spatula" meaningfully accelerates cooking
  };

  let changed = false;
  const nextSlots = { ...slots };
  const dingStations: CookingStationId[] = [];
  const burntStations: CookingStationId[] = [];

  for (const station of ['goreng', 'rebus', 'tumis'] as const) {
    const slot = slots[station];
    if (!slot.itemId || slot.progress >= 100) continue;

    changed = true;
    const nextProg = Math.min(100, slot.progress + rates[station] * dtSec);
    let dingPlayed = slot.dingPlayed;
    let burntSoundPlayed = slot.burntSoundPlayed;

    if (nextProg >= 50 && nextProg <= 85 && !dingPlayed) {
      dingPlayed = true;
      dingStations.push(station);
    }
    if (nextProg > 85 && !burntSoundPlayed) {
      burntSoundPlayed = true;
      burntStations.push(station);
    }

    nextSlots[station] = {
      ...slot,
      progress: nextProg,
      dingPlayed,
      burntSoundPlayed,
    };
  }

  return {
    slots: changed ? nextSlots : slots,
    dingStations,
    burntStations,
  };
}

export function stirTumisSlot(
  slots: Record<CookingStationId, KitchenSlotState>,
  now = Date.now()
): {
  slots: Record<CookingStationId, KitchenSlotState>;
  reachedMatang: boolean;
  burned: boolean;
} {
  const slot = slots.tumis;
  if (!slot.itemId || getCookingStatus(slot) === 'gosong') {
    return { slots, reachedMatang: false, burned: false };
  }
  const nextProg = Math.min(99, slot.progress + 14);
  const reachedMatang = nextProg >= 50 && nextProg <= 85 && !slot.dingPlayed;
  const burned = nextProg > 85 && !slot.burntSoundPlayed;

  return {
    slots: {
      ...slots,
      tumis: {
        ...slot,
        progress: nextProg,
        stirBoostCount: slot.stirBoostCount + 1,
        lastActionAt: now,
        dingPlayed: slot.dingPlayed || reachedMatang,
        burntSoundPlayed: slot.burntSoundPlayed || burned,
      },
    },
    reachedMatang,
    burned,
  };
}

export function poundCobekSlot(
  slots: Record<CookingStationId, KitchenSlotState>,
  now = Date.now()
): {
  slots: Record<CookingStationId, KitchenSlotState>;
  reachedMatang: boolean;
} {
  const slot = slots.cobek;
  if (!slot.itemId || slot.grindCount >= COBEK_MAX_GRINDS) {
    return { slots, reachedMatang: false };
  }
  const nextGrind = Math.min(COBEK_MAX_GRINDS, slot.grindCount + 1);
  const reachedMatang = nextGrind >= COBEK_MATANG_GRINDS && !slot.dingPlayed;
  return {
    slots: {
      ...slots,
      cobek: {
        ...slot,
        grindCount: nextGrind,
        progress: Math.round((nextGrind / COBEK_MAX_GRINDS) * 100),
        lastActionAt: now,
        dingPlayed: slot.dingPlayed || reachedMatang,
      },
    },
    reachedMatang,
  };
}

export function liftFromSlot(
  slots: Record<CookingStationId, KitchenSlotState>,
  station: CookingStationId
): {
  slots: Record<CookingStationId, KitchenSlotState>;
  outcome: 'empty' | 'mentah' | 'matang' | 'gosong';
  itemId: MenuItemId | null;
  progress: number;
} {
  const slot = slots[station];
  if (!slot.itemId) {
    return { slots, outcome: 'empty', itemId: null, progress: 0 };
  }
  const status = getCookingStatus(slot);
  if (status === 'gosong') {
    return {
      slots,
      outcome: 'gosong',
      itemId: slot.itemId,
      progress: slot.progress,
    };
  }

  const cleared: KitchenSlotState = {
    station,
    itemId: null,
    progress: 0,
    grindCount: 0,
    stirBoostCount: 0,
    lastActionAt: 0,
    dingPlayed: false,
    burntSoundPlayed: false,
  };

  return {
    slots: {
      ...slots,
      [station]: cleared,
    },
    outcome: status,
    itemId: slot.itemId,
    progress: slot.progress,
  };
}

export function discardBurntFromSlot(
  slots: Record<CookingStationId, KitchenSlotState>,
  station: CookingStationId,
  mode: GameMode
): {
  slots: Record<CookingStationId, KitchenSlotState>;
  discardedItemId: MenuItemId | null;
  wasteCost: number;
} {
  const slot = slots[station];
  if (!slot.itemId || getCookingStatus(slot) !== 'gosong') {
    return { slots, discardedItemId: null, wasteCost: 0 };
  }
  const item = MENU_BY_ID[slot.itemId];
  const wasteCost =
    mode === 'harian' && item ? Math.round(item.cost * 0.5) : 0;

  return {
    slots: {
      ...slots,
      [station]: {
        station,
        itemId: null,
        progress: 0,
        grindCount: 0,
        stirBoostCount: 0,
        lastActionAt: 0,
        dingPlayed: false,
        burntSoundPlayed: false,
      },
    },
    discardedItemId: slot.itemId,
    wasteCost,
  };
}

export function consumeStockForOrder(
  stock: Record<MenuItemId, number>,
  platedItems: MenuItemId[]
): Record<MenuItemId, number> {
  const next = { ...stock };
  for (const id of platedItems) {
    const item = MENU_BY_ID[id];
    if (!item || item.cookingStation === 'instan') continue;
    next[id] = Math.max(0, (next[id] ?? 0) - 1);
  }
  return next;
}

export function isZenModeUnlocked(save: GameSaveState): boolean {
  return (
    Boolean(save.zenModeUnlocked) ||
    save.unlockedRecipes.length >= MENU_ITEMS.length
  );
}

export function unlockZenModeViaCheat(save: GameSaveState): GameSaveState {
  if (save.zenModeUnlocked) return save;
  return {
    ...save,
    zenModeUnlocked: true,
  };
}

export function createDefaultSave(
  warungName = DEFAULT_WARUNG_NAME
): GameSaveState {
  return {
    warungName: sanitizeWarungName(warungName),
    day: 1,
    balance: 0,
    unlockedRecipes: [...DEFAULT_UNLOCKED_RECIPES],
    unlockedUpgrades: [],
    totalCustomersServed: 0,
    vipHearts: createDefaultVipHearts(),
    unlockedSecretRecipes: [],
    unlockedAchievements: [],
    stats: createDefaultStats(),
    itemStock: createDefaultItemStock(),
    zenModeUnlocked: false,
  };
}

export function getCustomersQuotaForDay(day: number): number {
  return Math.min(6, 4 + Math.floor((day - 1) / 2));
}

export function getAvailableRecipes(
  unlockedRecipes: MenuItemId[],
  mode: GameMode
): MenuItemId[] {
  if (mode === 'endless') {
    return [...ALL_RECIPE_IDS];
  }
  return unlockedRecipes.length > 0
    ? unlockedRecipes
    : [...DEFAULT_UNLOCKED_RECIPES];
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  const idx = Math.floor(rng() * arr.length);
  return arr[Math.max(0, Math.min(arr.length - 1, idx))];
}

function formatIndonesianList(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} sama ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, sama ${names[names.length - 1]}`;
}

function selectCustomerForVisit(
  customerIndex: number,
  weather: WeatherType,
  rng: () => number
): CustomerArchetype {
  const vips = CUSTOMERS.filter((c) => c.isVip);
  const regulars = CUSTOMERS.filter((c) => !c.isVip);

  // Weather-favored VIPs visit slightly more often during matching weather
  if (
    (weather === 'hujan_rintik' || weather === 'sore_senja') &&
    rng() < 0.24
  ) {
    const nightOrRainIds: CustomerArchetypeId[] =
      weather === 'hujan_rintik'
        ? ['pak_darman', 'teh_sari', 'mas_indie']
        : ['pak_darman', 'kang_ujang', 'mas_indie'];
    const targetId = pickRandom(nightOrRainIds, rng);
    const match = CUSTOMERS.find((c) => c.id === targetId);
    if (match) return match;
  }

  // ~52% VIP visits, ~48% diverse townfolk visits so all 20 characters rotate regularly
  if (rng() < 0.52) {
    return vips[(customerIndex + Math.floor(rng() * vips.length)) % vips.length];
  }

  return regulars[
    (customerIndex + Math.floor(rng() * regulars.length)) % regulars.length
  ];
}

const RICE_IDS: MenuItemId[] = [
  'nasi_putih',
  'nasi_uduk',
  'nasi_kuning',
  'nasi_merah',
];

const SPICY_ITEM_IDS: MenuItemId[] = [
  'sambal_terasi',
  'sambal_ijo',
  'sambal_matah',
];

const SOUP_AND_WET_VEG_IDS: MenuItemId[] = [
  'sayur_sop',
  'sayur_asem',
  'sayur_lodeh',
  'kuah_gulai',
  'tumis_kangkung',
  'tumis_toge_tahu',
];

const SNACK_SIDE_IDS: MenuItemId[] = [
  'perkedel',
  'tahu_goreng',
  'bakwan_jagung',
  'tempe_mendoan',
  'kerupuk',
  'peyek_kacang',
];

const WARM_DRINK_IDS: MenuItemId[] = [
  'kopi_hitam',
  'wedang_jahe',
  'teh_tawar_hangat',
];

function pickAvailableFrom(
  candidates: MenuItemId[],
  available: Set<MenuItemId>,
  rng: () => number,
  exclude: MenuItemId[] = []
): MenuItemId | null {
  const pool = candidates.filter(
    (id) => available.has(id) && !exclude.includes(id)
  );
  if (pool.length === 0) return null;
  return pickRandom(pool, rng);
}

export function generateCustomerOrder(
  day: number,
  unlockedRecipes: MenuItemId[],
  mode: GameMode,
  customerIndex: number,
  weather: WeatherType = 'pagi_cerah',
  rng: () => number = Math.random,
  unlockedSecretRecipes: SecretRecipeId[] = []
): CustomerOrder {
  const available = new Set(getAvailableRecipes(unlockedRecipes, mode));
  const customer = selectCustomerForVisit(customerIndex, weather, rng);
  const greeting = pickRandom(customer.greetings, rng);

  // 1. Unlocked Secret Recipe Chance (~24% when unlocked recipes' ingredients are available)
  const playableSecrets = unlockedSecretRecipes
    .map((id) => SECRET_RECIPE_BY_ID[id])
    .filter((r) => r && r.ingredients.every((ing) => available.has(ing)));

  if (playableSecrets.length > 0 && rng() < 0.24) {
    const chosenSecret = pickRandom(playableSecrets, rng);
    const prefs: RequestedServingPrefs = chosenSecret.requiredPrefs
      ? { ...chosenSecret.requiredPrefs }
      : {};
    const prefNote =
      prefs.soupStyle === 'siram'
        ? ' Jangan lupa kuahnya disiram ke nasi ya!'
        : prefs.iceLevel === 'tanpa_es' && prefs.sweetness === 'tawar'
        ? ' Minumnya tanpa es dan tawar ya!'
        : '';
    const template = pickRandom(
      ORDER_DIALOGUE_TEMPLATES.resep_rahasia,
      rng
    ).replace('{secretName}', chosenSecret.name);
    return {
      id: `ord-${day}-${customerIndex}-${Math.floor(rng() * 100000)}`,
      customer,
      items: [...chosenSecret.ingredients],
      requestedPrefs: prefs,
      secretRecipeId: chosenSecret.id,
      patternType: 'resep_rahasia',
      isRiddle: false,
      dialogue: `${greeting} ${template}${prefNote}`,
      hintText: `Resep Rahasia ${chosenSecret.name}: cek komposisinya di Buku Catatan jika perlu!`,
    };
  }

  const byCat = (cat: string) =>
    MENU_ITEMS.filter((m) => m.category === cat && available.has(m.id));

  const karboList = byCat('karbo').map((m) => m.id);
  const mainList = byCat('lauk_utama').map((m) => m.id);
  const sideList = byCat('lauk_pendamping').map((m) => m.id);
  const vegList = SOUP_AND_WET_VEG_IDS.filter((id) => available.has(id));
  const sambalList = SPICY_ITEM_IDS.filter((id) => available.has(id));
  const drinkList = byCat('minuman').map((m) => m.id);

  const isRainy = weather === 'hujan_rintik';
  const isEvening = weather === 'sore_senja';

  // Determine order pattern naturally based on customer archetype, weather, & progression
  let patternType: OrderPatternType = 'langsung';
  const canExtraPortion =
    mode === 'endless' || day >= 2 || mainList.length >= 2;
  const allowRiddle =
    mode === 'endless' || day >= 2 || customer.id === 'dinda' || customer.id === 'ibu_guru';

  const patternRoll = rng();
  if (
    canExtraPortion &&
    (customer.id === 'bapak_proyek' ||
      customer.id === 'bang_jaka' ||
      customer.id === 'kang_ujang') &&
    patternRoll < 0.55
  ) {
    patternType = 'porsi_ekstra';
  } else if (
    allowRiddle &&
    (customer.id === 'dinda' || customer.id === 'ibu_guru' || customer.id === 'mas_indie') &&
    patternRoll < 0.62
  ) {
    patternType = 'teka_teki';
  } else if (
    (isRainy || isEvening) &&
    (customer.id === 'pak_darman' ||
      customer.id === 'teh_sari' ||
      customer.id === 'mbak_perawat' ||
      patternRoll < 0.28)
  ) {
    patternType = 'cuaca';
  } else if (allowRiddle && patternRoll < 0.42) {
    patternType = 'teka_teki';
  } else if (canExtraPortion && patternRoll > 0.78) {
    patternType = 'porsi_ekstra';
  } else if (patternRoll > 0.64) {
    patternType = 'cuaca';
  }

  const chosen: MenuItemId[] = [];
  const addIfAvail = (id: MenuItemId | null) => {
    if (id && available.has(id) && !chosen.includes(id)) {
      chosen.push(id);
    }
  };

  // Curated themed riddle combos when all items are unlocked (and customer isn't Anak Kecil)
  let customCuratedRiddleDialogue: string | null = null;
  if (
    patternType === 'teka_teki' &&
    customer.id !== 'anak_kecil' &&
    rng() < 0.35
  ) {
    if (
      available.has('nasi_merah') &&
      available.has('sayur_sop') &&
      available.has('teh_tawar_hangat') &&
      (customer.id === 'mas_pelari' || customer.id === 'teh_sari' || rng() < 0.4)
    ) {
      addIfAvail('nasi_merah');
      if (available.has('ayam_bakar')) addIfAvail('ayam_bakar');
      else addIfAvail('tahu_goreng');
      addIfAvail('sayur_sop');
      addIfAvail('teh_tawar_hangat');
      customCuratedRiddleDialogue =
        'Menu diet sehat dong: nasinya yang merah berserat, sayurnya bening wortel kentang, plus minumnya teh hangat tawar aja.';
    } else if (
      available.has('sayur_lodeh') &&
      available.has('ayam_bakar') &&
      available.has('es_sirup')
    ) {
      addIfAvail('nasi_putih');
      addIfAvail('ayam_bakar');
      addIfAvail('sayur_lodeh');
      addIfAvail('es_sirup');
      customCuratedRiddleDialogue =
        'Lagi pengen yang kuahnya santan gurih, lauknya ayam bakar kecap manis, sama minumnya yang merah manis dingin.';
    }
  }

  // Build item composition per customer personality (20 archetypes)
  if (chosen.length === 0) {
    switch (customer.id) {
      case 'anak_kecil': {
        // Snacks / gorengan + sweet drink
        addIfAvail(
          pickAvailableFrom(
            ['bakwan_jagung', 'perkedel', 'tahu_goreng', 'tempe_mendoan'],
            available,
            rng
          )
        );
        addIfAvail(
          pickAvailableFrom(['kerupuk', 'peyek_kacang', 'kentang_mustofa'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['es_sirup', 'es_cendol', 'es_teh', 'es_jeruk'], available, rng)
        );
        break;
      }

      case 'mas_pelari': {
        addIfAvail(
          pickAvailableFrom(['nasi_merah', 'nasi_putih'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(
            ['ayam_bakar', 'telur_balado', 'tongkol_suwir', 'ayam_goreng'],
            available,
            rng
          )
        );
        addIfAvail(
          pickAvailableFrom(
            ['tumis_toge_tahu', 'tumis_kangkung', 'sayur_sop'],
            available,
            rng
          )
        );
        addIfAvail(
          pickAvailableFrom(['teh_tawar_hangat', 'es_jeruk', 'es_teh'], available, rng)
        );
        break;
      }

      case 'teh_sari': {
        addIfAvail(
          pickAvailableFrom(['nasi_merah', 'nasi_putih'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['ayam_bakar', 'ikan_pesmol', 'telur_balado'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['sayur_sop', 'sayur_asem', 'tumis_toge_tahu'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(
            isRainy
              ? ['wedang_jahe', 'teh_tawar_hangat']
              : ['teh_tawar_hangat', 'wedang_jahe', 'es_jeruk'],
            available,
            rng
          )
        );
        break;
      }

      case 'koh_hendra': {
        addIfAvail(
          pickAvailableFrom(['nasi_kuning', 'nasi_uduk', 'nasi_putih'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['ikan_pesmol', 'rendang', 'ayam_bakar', 'lele_goreng'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['bakwan_jagung', 'peyek_kacang', 'perkedel'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['sambal_matah', 'sambal_ijo', 'sambal_terasi'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['es_cendol', 'es_jeruk', 'kopi_hitam'], available, rng)
        );
        break;
      }

      case 'kang_ujang': {
        addIfAvail(
          pickAvailableFrom(['nasi_uduk', 'nasi_putih'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['rendang', 'ayam_goreng', 'tongkol_suwir'], available, rng)
        );
        if (patternType === 'porsi_ekstra') {
          addIfAvail(
            pickAvailableFrom(['telur_dadar_padang', 'ati_ampela', 'telur_balado'], available, rng, chosen)
          );
        }
        addIfAvail(
          pickAvailableFrom(['kuah_gulai', 'sayur_lodeh', 'tumis_kangkung'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['sambal_ijo', 'sambal_terasi', 'sambal_matah'], available, rng)
        );
        addIfAvail(
          pickAvailableFrom(['kopi_hitam', 'es_cendol', 'es_teh'], available, rng)
        );
        break;
      }

      case 'bapak_proyek': {
        addIfAvail(pickAvailableFrom(['nasi_putih', 'nasi_uduk'], available, rng));
        addIfAvail(pickAvailableFrom(mainList, available, rng));
        addIfAvail(
          pickAvailableFrom(
            [...mainList, 'tempe_mendoan', 'perkedel', 'tempe_orek'],
            available,
            rng,
            chosen
          )
        );
        if (rng() < 0.7) {
          addIfAvail(pickAvailableFrom(['kuah_gulai', 'sayur_lodeh', 'sayur_sop'], available, rng));
        }
        addIfAvail(pickAvailableFrom(sambalList, available, rng));
        addIfAvail(pickAvailableFrom(['es_teh', 'kopi_hitam', 'es_jeruk'], available, rng));
        break;
      }

      case 'pak_darman': {
        if (rng() < 0.7) addIfAvail('nasi_putih');
        if (rng() < 0.6) {
          addIfAvail(pickAvailableFrom(['lele_goreng', 'tongkol_suwir', 'ati_ampela'], available, rng));
        }
        addIfAvail(pickAvailableFrom(['tahu_goreng', 'tempe_mendoan', 'perkedel'], available, rng));
        if (isRainy) {
          addIfAvail(pickAvailableFrom(sambalList, available, rng));
        }
        addIfAvail(
          pickAvailableFrom(['wedang_jahe', 'kopi_hitam', 'teh_tawar_hangat'], available, rng)
        );
        break;
      }

      case 'riko': {
        addIfAvail('nasi_putih');
        if (rng() < 0.5) {
          addIfAvail(pickAvailableFrom(['telur_balado', 'telur_dadar_padang'], available, rng));
        }
        addIfAvail(pickAvailableFrom(['tempe_orek', 'kentang_mustofa', 'tahu_goreng'], available, rng));
        addIfAvail(pickAvailableFrom(['kerupuk', 'peyek_kacang'], available, rng));
        addIfAvail(pickAvailableFrom(['es_teh', 'teh_tawar_hangat'], available, rng));
        break;
      }

      case 'bu_tejo': {
        addIfAvail(pickAvailableFrom(['nasi_uduk', 'nasi_putih'], available, rng));
        addIfAvail(pickAvailableFrom(mainList, available, rng));
        addIfAvail(pickAvailableFrom(['perkedel', 'bakwan_jagung', 'peyek_kacang'], available, rng));
        addIfAvail(pickAvailableFrom(['sayur_lodeh', 'sayur_asem', 'sayur_sop', 'tumis_kangkung'], available, rng));
        addIfAvail(pickAvailableFrom(sambalList, available, rng));
        addIfAvail(pickAvailableFrom(['es_teh', 'teh_tawar_hangat', 'es_jeruk'], available, rng));
        break;
      }

      case 'bang_jaka': {
        addIfAvail(pickAvailableFrom(['nasi_uduk', 'nasi_kuning', 'nasi_putih'], available, rng));
        addIfAvail(pickAvailableFrom(['ayam_goreng', 'ayam_bakar', 'rendang'], available, rng));
        if (patternType === 'porsi_ekstra') {
          addIfAvail(pickAvailableFrom(['tempe_orek', 'perkedel', 'kentang_mustofa'], available, rng, chosen));
        }
        addIfAvail(pickAvailableFrom(sambalList, available, rng));
        addIfAvail(pickAvailableFrom(['es_jeruk', 'es_cendol', 'es_teh'], available, rng));
        break;
      }

      case 'nenek_ramah': {
        addIfAvail(pickAvailableFrom(['nasi_putih', 'nasi_merah'], available, rng));
        addIfAvail(pickAvailableFrom(['telur_balado', 'telur_dadar_padang', 'ikan_pesmol'], available, rng));
        addIfAvail(pickAvailableFrom(['sayur_sop', 'sayur_lodeh', 'tumis_toge_tahu'], available, rng));
        addIfAvail(pickAvailableFrom(['teh_tawar_hangat', 'wedang_jahe'], available, rng));
        break;
      }

      case 'mbak_perawat': {
        addIfAvail(pickAvailableFrom(['nasi_merah', 'nasi_putih'], available, rng));
        addIfAvail(pickAvailableFrom(['ayam_bakar', 'telur_balado', 'ikan_pesmol'], available, rng));
        addIfAvail(pickAvailableFrom(['sayur_sop', 'tumis_toge_tahu', 'tumis_kangkung'], available, rng));
        addIfAvail(pickAvailableFrom(['wedang_jahe', 'teh_tawar_hangat', 'es_jeruk'], available, rng));
        break;
      }

      case 'bapak_angkot': {
        addIfAvail(pickAvailableFrom(['nasi_putih', 'nasi_uduk'], available, rng));
        addIfAvail(pickAvailableFrom(['tongkol_suwir', 'lele_goreng', 'ati_ampela'], available, rng));
        addIfAvail(pickAvailableFrom(['tempe_mendoan', 'bakwan_jagung', 'tahu_goreng'], available, rng));
        addIfAvail(pickAvailableFrom(['sambal_terasi', 'sambal_ijo', 'sambal_matah'], available, rng));
        addIfAvail(pickAvailableFrom(['kopi_hitam', 'es_teh'], available, rng));
        break;
      }

      case 'mas_kurir': {
        addIfAvail(pickAvailableFrom(['nasi_kuning', 'nasi_uduk', 'nasi_putih'], available, rng));
        addIfAvail(pickAvailableFrom(['ayam_goreng', 'telur_dadar_padang', 'ayam_bakar'], available, rng));
        addIfAvail(pickAvailableFrom(['kentang_mustofa', 'tempe_orek', 'kerupuk'], available, rng));
        addIfAvail(pickAvailableFrom(['es_jeruk', 'es_sirup', 'es_cendol', 'es_teh'], available, rng));
        break;
      }

      case 'pelajar_sma': {
        addIfAvail(pickAvailableFrom(['nasi_putih', 'nasi_uduk'], available, rng));
        addIfAvail(pickAvailableFrom(['ayam_goreng', 'telur_balado', 'telur_dadar_padang'], available, rng));
        addIfAvail(pickAvailableFrom(SNACK_SIDE_IDS, available, rng));
        addIfAvail(pickAvailableFrom(['es_sirup', 'es_teh', 'es_cendol'], available, rng));
        break;
      }

      case 'ibu_pasar': {
        addIfAvail(pickAvailableFrom(['nasi_putih', 'nasi_kuning'], available, rng));
        addIfAvail(pickAvailableFrom(['ikan_pesmol', 'lele_goreng', 'tongkol_suwir'], available, rng));
        addIfAvail(pickAvailableFrom(['sayur_asem', 'sayur_lodeh', 'tumis_kangkung'], available, rng));
        addIfAvail(pickAvailableFrom(['peyek_kacang', 'tempe_mendoan', 'kerupuk'], available, rng));
        addIfAvail(pickAvailableFrom(['es_jeruk', 'teh_tawar_hangat'], available, rng));
        break;
      }

      case 'mas_indie': {
        addIfAvail(pickAvailableFrom(['nasi_uduk', 'nasi_putih'], available, rng));
        addIfAvail(pickAvailableFrom(['ayam_bakar', 'telur_balado', 'rendang'], available, rng));
        addIfAvail(pickAvailableFrom(['tempe_mendoan', 'bakwan_jagung', 'kentang_mustofa'], available, rng));
        addIfAvail(pickAvailableFrom(['kopi_hitam', 'wedang_jahe', 'es_teh'], available, rng));
        break;
      }

      default: {
        // mas_karyawan, dinda, ibu_guru
        addIfAvail(pickAvailableFrom(karboList, available, rng));
        addIfAvail(pickAvailableFrom(mainList, available, rng));
        if (patternType === 'porsi_ekstra') {
          addIfAvail(
            pickAvailableFrom([...mainList, ...sideList], available, rng, chosen)
          );
        } else if (sideList.length > 0 && rng() < 0.72) {
          addIfAvail(pickAvailableFrom(sideList, available, rng));
        }

        const vegChance = isRainy ? 0.78 : 0.5;
        if (vegList.length > 0 && rng() < vegChance) {
          if (isRainy) {
            addIfAvail(
              pickAvailableFrom(
                ['kuah_gulai', 'sayur_sop', 'sayur_lodeh', ...vegList],
                available,
                rng
              )
            );
          } else {
            addIfAvail(pickAvailableFrom(vegList, available, rng));
          }
        }
        const sambalChance = isRainy ? 0.75 : 0.55;
        if (sambalList.length > 0 && rng() < sambalChance) {
          addIfAvail(pickAvailableFrom(sambalList, available, rng));
        }
        if (drinkList.length > 0 && rng() < 0.88) {
          if (isRainy && rng() < 0.65) {
            addIfAvail(
              pickAvailableFrom([...WARM_DRINK_IDS, ...drinkList], available, rng)
            );
          } else {
            addIfAvail(pickAvailableFrom(drinkList, available, rng));
          }
        }
        break;
      }
    }
  }

  // Guarantee at least 2 items on extra portion or standard orders if small pool
  if (patternType === 'porsi_ekstra') {
    const laukCount = chosen.filter(
      (id) =>
        MENU_BY_ID[id].category === 'lauk_utama' ||
        MENU_BY_ID[id].category === 'lauk_pendamping'
    ).length;
    if (laukCount < 2) {
      addIfAvail(
        pickAvailableFrom([...mainList, ...sideList], available, rng, chosen)
      );
    }
  }

  if (chosen.length < 2) {
    addIfAvail(pickAvailableFrom(karboList, available, rng, chosen));
    addIfAvail(pickAvailableFrom([...mainList, ...sideList], available, rng, chosen));
    addIfAvail(pickAvailableFrom(drinkList, available, rng, chosen));
  }

  const prefBuild = buildServingPrefs(
    chosen,
    day,
    mode,
    isRainy,
    customer.id,
    rng
  );

  if (patternType === 'teka_teki') {
    const clueParts = chosen.map((id) =>
      pickRandom(MENU_BY_ID[id].riddleClues, rng)
    );
    const body =
      customCuratedRiddleDialogue ??
      pickRandom(ORDER_DIALOGUE_TEMPLATES.teka_teki, rng).replace(
        '{clues}',
        formatIndonesianList(clueParts)
      );
    return {
      id: `ord-${day}-${customerIndex}-${Math.floor(rng() * 100000)}`,
      customer,
      items: chosen,
      requestedPrefs: prefBuild.prefs,
      patternType: 'teka_teki',
      isRiddle: true,
      dialogue: `${greeting} ${body}${prefBuild.suffix}`,
      hintText:
        'Pesanan teka-teki santai: cocokkan petunjuk rasa & detail penyajian.',
    };
  }

  const directNames = chosen.map((id) => MENU_BY_ID[id].name);
  const formattedItems = formatIndonesianList(directNames);
  const templateList = ORDER_DIALOGUE_TEMPLATES[patternType];
  const body = pickRandom(templateList, rng)
    .replace('{items}', formattedItems)
    .replace('{weather}', WEATHER_INFO[weather].label.toLowerCase());

  const hintText =
    Object.keys(prefBuild.prefs).length > 0
      ? 'Perhatikan juga detail penyajian (kuah / es / gula) yang diminta.'
      : patternType === 'porsi_ekstra'
      ? 'Pesanan porsi ekstra: pastikan semua lauk & pendamping terbawa.'
      : patternType === 'cuaca'
      ? `Pesanan bernuansa ${WEATHER_INFO[weather].label}: cocokkan seluruh menu.`
      : 'Pesanan langsung: racik sesuai daftar menu yang disebutkan.';

  return {
    id: `ord-${day}-${customerIndex}-${Math.floor(rng() * 100000)}`,
    customer,
    items: chosen,
    requestedPrefs: prefBuild.prefs,
    patternType,
    isRiddle: false,
    dialogue: `${greeting} ${body}${prefBuild.suffix}`,
    hintText,
  };
}

function buildServingPrefs(
  items: MenuItemId[],
  day: number,
  mode: GameMode,
  isRainy: boolean,
  customerId: string,
  rng: () => number
): { prefs: RequestedServingPrefs; suffix: string } {
  const prefs: RequestedServingPrefs = {};
  const sentences: string[] = [];

  const hasRice = items.some((id) => RICE_IDS.includes(id));
  const bowlItemId = items.find(
    (id) => MENU_BY_ID[id]?.platingZone === 'bowl'
  );
  const soupLabel = bowlItemId ? `${MENU_BY_ID[bowlItemId].name}nya` : null;

  const coldDrinkId = items.find((id) => MENU_BY_ID[id]?.isColdDrink);
  const coldDrinkLabel = coldDrinkId
    ? `${MENU_BY_ID[coldDrinkId].name}nya`
    : null;

  const baseChance =
    customerId === 'bu_tejo'
      ? 0.85
      : day === 1 && mode === 'harian'
      ? 0.35
      : 0.45;

  if (hasRice && soupLabel && rng() < baseChance) {
    if (rng() < 0.65) {
      prefs.soupStyle = 'siram';
      sentences.push(`${soupLabel} siram langsung ke nasi ya`);
    } else {
      prefs.soupStyle = 'pisah';
      sentences.push(`${soupLabel} pisah mangkuk aja ya`);
    }
  }

  if (coldDrinkLabel && rng() < (isRainy ? 0.58 : baseChance)) {
    const pick = rng();
    if (pick < 0.45) {
      prefs.iceLevel = 'tanpa_es';
      sentences.push(`${coldDrinkLabel} tanpa es ya, lagi agak radang`);
    } else if (pick < 0.8) {
      prefs.sweetness = 'tawar';
      sentences.push(`${coldDrinkLabel} bikin tawar aja nggak usah terlalu manis`);
    } else {
      prefs.iceLevel = 'tanpa_es';
      prefs.sweetness = 'tawar';
      sentences.push(`${coldDrinkLabel} tanpa es dan tawar aja ya`);
    }
  }

  return {
    prefs,
    suffix: sentences.length > 0 ? ` ${sentences.join(', ')}.` : '',
  };
}

export function evaluateOrder(
  orderItems: MenuItemId[],
  platedItems: MenuItemId[],
  unlockedUpgrades: UpgradeId[],
  requestedPrefs: RequestedServingPrefs = {},
  servingOptions: ServingOptions = DEFAULT_SERVING_OPTIONS,
  freshlyCookedItems: MenuItemId[] = []
): OrderEvaluation {
  const orderSet = new Set(orderItems);
  const platedSet = new Set(platedItems);

  const matchedItems = orderItems.filter((id) => platedSet.has(id));
  const missingItems = orderItems.filter((id) => !platedSet.has(id));
  const extraItems = platedItems.filter((id) => !orderSet.has(id));

  const mismatchedPrefs: string[] = [];
  const hasSoupOnBoth = orderItems.some(
    (id) => MENU_BY_ID[id]?.platingZone === 'bowl' && platedSet.has(id)
  );
  const hasColdDrinkOnBoth = orderItems.some(
    (id) => Boolean(MENU_BY_ID[id]?.isColdDrink) && platedSet.has(id)
  );

  if (
    requestedPrefs.soupStyle &&
    hasSoupOnBoth &&
    servingOptions.soupStyle !== requestedPrefs.soupStyle
  ) {
    mismatchedPrefs.push(
      requestedPrefs.soupStyle === 'siram'
        ? 'kuah/sayur disiram ke nasi'
        : 'kuah dipisah mangkuk'
    );
  }
  if (
    requestedPrefs.iceLevel &&
    hasColdDrinkOnBoth &&
    servingOptions.iceLevel !== requestedPrefs.iceLevel
  ) {
    mismatchedPrefs.push(
      requestedPrefs.iceLevel === 'tanpa_es' ? 'minuman tanpa es' : 'es normal'
    );
  }
  if (
    requestedPrefs.sweetness &&
    hasColdDrinkOnBoth &&
    servingOptions.sweetness !== requestedPrefs.sweetness
  ) {
    mismatchedPrefs.push(
      requestedPrefs.sweetness === 'tawar' ? 'minuman tawar' : 'minuman manis'
    );
  }

  let tier: AccuracyTier;
  if (
    missingItems.length === 0 &&
    extraItems.length === 0 &&
    mismatchedPrefs.length === 0
  ) {
    tier = 'sempurna';
  } else if (
    matchedItems.length > 0 &&
    missingItems.length <= 1 &&
    extraItems.length <= 1
  ) {
    tier = 'kurang_tepat';
  } else {
    tier = 'salah';
  }

  const matchedRevenue = matchedItems.reduce(
    (sum, id) => sum + MENU_BY_ID[id].price,
    0
  );
  const ingredientCost = platedItems.reduce(
    (sum, id) => sum + MENU_BY_ID[id].cost,
    0
  );

  let baseRevenue = 0;
  let tipAmount = 0;

  if (tier === 'sempurna') {
    baseRevenue = orderItems.reduce((sum, id) => sum + MENU_BY_ID[id].price, 0);
    tipAmount = 3000;
  } else if (tier === 'kurang_tepat') {
    baseRevenue = Math.max(2000, Math.round(matchedRevenue * 0.85));
    tipAmount = 1000;
  } else {
    baseRevenue = Math.round(matchedRevenue * 0.5);
    tipAmount = 0;
  }

  if (tier !== 'salah') {
    if (unlockedUpgrades.includes('poster_warung')) {
      tipAmount += 1500;
    }
    if (unlockedUpgrades.includes('kipas_angin')) {
      tipAmount += 2000;
    }
    if (unlockedUpgrades.includes('radio_retro')) {
      tipAmount += 2500;
    }
    if (
      unlockedUpgrades.includes('rice_cooker') &&
      matchedItems.some((id) => RICE_IDS.includes(id))
    ) {
      tipAmount += 3500;
    }
    if (unlockedUpgrades.includes('etalase_besar')) {
      tipAmount = Math.round(tipAmount * 1.25);
    }
  }

  // Freshly Cooked bonus tip when serving matched dishes cooked in Dapur Masak
  const freshlySet = new Set(freshlyCookedItems);
  const freshMatchCount =
    tier === 'salah'
      ? 0
      : matchedItems.filter((id) => freshlySet.has(id)).length;
  const freshlyCookedBonus = freshMatchCount * FRESHLY_COOKED_BONUS_PER_ITEM;
  tipAmount += freshlyCookedBonus;

  let reactionDialogue: string;
  if (tier === 'sempurna') {
    reactionDialogue =
      freshlyCookedBonus > 0
        ? 'Wah, pas banget! Lauknya masih hangat baru diangkat dari dapur lagi, nikmat sekali!'
        : 'Wah, pas banget! Detail racikan dan penyajiannya sesuai keinginan, terima kasih banyak ya!';
  } else if (tier === 'kurang_tepat') {
    const missingNames = missingItems.map((id) => MENU_BY_ID[id].name);
    const extraNames = extraItems.map((id) => MENU_BY_ID[id].name);
    if (
      missingNames.length === 0 &&
      extraNames.length === 0 &&
      mismatchedPrefs.length > 0
    ) {
      reactionDialogue = `Lauknya sudah pas, cuma tadi saya minta ${mismatchedPrefs.join(' & ')} ya. Nggak apa-apa, tetap enak kok!`;
    } else if (missingNames.length > 0 && extraNames.length === 0) {
      reactionDialogue = `Hmm enak sih, cuma kurang ${missingNames.join(', ')} aja nih. Nggak apa-apa, tetap saya nikmati!`;
    } else if (extraNames.length > 0 && missingNames.length === 0) {
      reactionDialogue = `Wah ada bonus ${extraNames.join(', ')} ya? Agak beda dari pesanan, tapi tetap enak kok!`;
    } else {
      reactionDialogue =
        'Agak keliru dikit nih, tapi rasanya tetap sedap. Makasih ya!';
    }
  } else {
    reactionDialogue =
      'Waduh, sepertinya tertukar sama pesanan orang lain nih. Lain kali dicek lagi ya, tetap saya bayar sebagian deh.';
  }

  return {
    tier,
    matchedItems,
    missingItems,
    extraItems,
    mismatchedPrefs,
    baseRevenue,
    ingredientCost,
    tipAmount,
    freshlyCookedBonus,
    totalPaid: baseRevenue + tipAmount,
    reactionDialogue,
  };
}

export interface ProgressUpdateResult {
  save: GameSaveState;
  vipHeartUp?: {
    vipId: VipCustomerId;
    vipName: string;
    newHearts: number;
    milestoneStory?: string;
    unlockedSecretRecipe?: SecretRecipe;
  };
  newAchievements: AchievementDef[];
}

export function applyServedProgress(
  save: GameSaveState,
  order: CustomerOrder,
  evaluation: OrderEvaluation,
  weather: WeatherType,
  balanceDelta: number
): ProgressUpdateResult {
  const nextStats: PlayerStats = { ...save.stats };
  if (evaluation.tier === 'sempurna') {
    nextStats.perfectServedCount += 1;
  }
  if (evaluation.matchedItems.some((id) => SPICY_ITEM_IDS.includes(id))) {
    nextStats.spicyServedCount += 1;
  }
  if (
    evaluation.tier === 'sempurna' &&
    Object.keys(order.requestedPrefs).length > 0
  ) {
    nextStats.prefMatchedCount += 1;
  }
  if (
    order.customer.id === 'pak_darman' &&
    evaluation.tier !== 'salah' &&
    (weather === 'sore_senja' || weather === 'hujan_rintik')
  ) {
    nextStats.servedPakDarmanNight = true;
  }

  const nextVipHearts = { ...save.vipHearts };
  const nextSecretRecipes = [...save.unlockedSecretRecipes];
  let vipHeartUp: ProgressUpdateResult['vipHeartUp'] = undefined;

  if (order.customer.isVip && evaluation.tier === 'sempurna') {
    const vipId = order.customer.id as VipCustomerId;
    const prevHearts = nextVipHearts[vipId] ?? 1;
    const nextHearts = Math.min(5, prevHearts + 1);
    nextVipHearts[vipId] = nextHearts;

    if (nextHearts > prevHearts) {
      const profile = VIP_BY_ID[vipId];
      let milestoneStory: string | undefined;
      let unlockedSecretRecipe: SecretRecipe | undefined;

      if (nextHearts === 3 || nextHearts === 5) {
        milestoneStory =
          nextHearts === 3 ? profile.heart3Story : profile.heart5Story;
        const matchingSecret = SECRET_RECIPES.find(
          (r) => r.vipId === vipId && r.unlockAtHearts === nextHearts
        );
        if (matchingSecret) {
          unlockedSecretRecipe = matchingSecret;
          if (!nextSecretRecipes.includes(matchingSecret.id)) {
            nextSecretRecipes.push(matchingSecret.id);
          }
        }
      }

      vipHeartUp = {
        vipId,
        vipName: profile.name,
        newHearts: nextHearts,
        milestoneStory,
        unlockedSecretRecipe,
      };
    }
  }

  const nextBalance = Math.max(0, save.balance + balanceDelta);
  const nextServedTotal = save.totalCustomersServed + 1;

  // Evaluate achievements
  const ownedAchievements = new Set<AchievementId>(save.unlockedAchievements);
  const newAchievements: AchievementDef[] = [];

  const checkAch = (id: AchievementId, condition: boolean) => {
    if (condition && !ownedAchievements.has(id)) {
      ownedAchievements.add(id);
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) newAchievements.push(def);
    }
  };

  checkAch('pelanggan_pertama', nextServedTotal >= 1);
  checkAch('racikan_sempurna', nextStats.perfectServedCount >= 5);
  checkAch('pecinta_pedas', nextStats.spicyServedCount >= 5);
  checkAch('sahabat_anak_kos', (nextVipHearts.riko ?? 1) >= 3);
  checkAch('penjaga_malam', nextStats.servedPakDarmanNight);
  checkAch('ahli_penyajian', nextStats.prefMatchedCount >= 3);
  checkAch(
    'juragan_warteg',
    nextBalance >= 150000 || save.unlockedRecipes.length >= MENU_ITEMS.length
  );
  checkAch(
    'keluarga_warung',
    VIP_CUSTOMER_IDS.some((id) => (nextVipHearts[id] ?? 1) >= 5)
  );

  const updatedSave: GameSaveState = {
    ...save,
    balance: nextBalance,
    totalCustomersServed: nextServedTotal,
    vipHearts: nextVipHearts,
    unlockedSecretRecipes: nextSecretRecipes,
    unlockedAchievements: Array.from(ownedAchievements),
    stats: nextStats,
  };

  return {
    save: updatedSave,
    vipHeartUp,
    newAchievements,
  };
}

export function calculateDailySummary(
  day: number,
  records: ServedRecord[]
): DailySummary {
  const totalRevenue = records.reduce((s, r) => s + r.baseRevenue, 0);
  const totalCost = records.reduce((s, r) => s + r.ingredientCost, 0);
  const totalTips = records.reduce((s, r) => s + r.tipAmount, 0);
  const netProfit = totalRevenue + totalTips - totalCost;

  return {
    day,
    customersServed: records.length,
    perfectCount: records.filter((r) => r.tier === 'sempurna').length,
    partialCount: records.filter((r) => r.tier === 'kurang_tepat').length,
    wrongCount: records.filter((r) => r.tier === 'salah').length,
    totalRevenue,
    totalCost,
    totalTips,
    netProfit,
  };
}

export function purchaseRecipe(
  save: GameSaveState,
  recipeId: MenuItemId
): { ok: boolean; save: GameSaveState; message: string } {
  if (save.unlockedRecipes.includes(recipeId)) {
    return { ok: false, save, message: 'Resep sudah terbuka.' };
  }
  const item = MENU_BY_ID[recipeId];
  if (!item) {
    return { ok: false, save, message: 'Resep tidak ditemukan.' };
  }
  if (save.balance < item.unlockCost) {
    return { ok: false, save, message: 'Saldo belum mencukupi.' };
  }
  const nextUnlocked = [...save.unlockedRecipes, recipeId];
  const unlockedAllNow = nextUnlocked.length >= MENU_ITEMS.length;
  const zenNow = Boolean(save.zenModeUnlocked) || unlockedAllNow;

  return {
    ok: true,
    save: {
      ...save,
      balance: save.balance - item.unlockCost,
      unlockedRecipes: nextUnlocked,
      itemStock: {
        ...save.itemStock,
        [recipeId]:
          item.cookingStation === 'instan' ? 99 : STARTER_PORTION_STOCK,
      },
      zenModeUnlocked: zenNow,
    },
    message: unlockedAllNow
      ? `Resep ${item.name} dibuka! Semua ${MENU_ITEMS.length} menu lengkap — Mode Zen terbuka permanen!`
      : `Resep ${item.name} berhasil dibuka!`,
  };
}

export function purchaseUpgrade(
  save: GameSaveState,
  upgradeId: UpgradeId
): { ok: boolean; save: GameSaveState; message: string } {
  if (save.unlockedUpgrades.includes(upgradeId)) {
    return { ok: false, save, message: 'Fasilitas sudah dimiliki.' };
  }
  const upg = UPGRADES.find((u) => u.id === upgradeId);
  if (!upg) {
    return { ok: false, save, message: 'Upgrade tidak ditemukan.' };
  }
  if (save.balance < upg.cost) {
    return { ok: false, save, message: 'Saldo belum mencukupi.' };
  }
  return {
    ok: true,
    save: {
      ...save,
      balance: save.balance - upg.cost,
      unlockedUpgrades: [...save.unlockedUpgrades, upgradeId],
    },
    message: `${upg.name} terpasang di warung!`,
  };
}

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const abs = Math.abs(rounded);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return rounded < 0 ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function loadSaveFromStorage(): {
  save: GameSaveState;
  hasSavedData: boolean;
} {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { save: createDefaultSave(), hasSavedData: false };
    }
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) {
      return { save: createDefaultSave(), hasSavedData: false };
    }
    const parsed = JSON.parse(raw) as Partial<GameSaveState>;
    const validRecipes = Array.isArray(parsed.unlockedRecipes)
      ? parsed.unlockedRecipes.filter((id): id is MenuItemId =>
          Boolean(MENU_BY_ID[id as MenuItemId])
        )
      : [...DEFAULT_UNLOCKED_RECIPES];
    const mergedRecipes = Array.from(
      new Set<MenuItemId>([...DEFAULT_UNLOCKED_RECIPES, ...validRecipes])
    );
    const validUpgrades = Array.isArray(parsed.unlockedUpgrades)
      ? parsed.unlockedUpgrades.filter((id): id is UpgradeId =>
          UPGRADES.some((u) => u.id === id)
        )
      : [];

    const defaultHearts = createDefaultVipHearts();
    const vipHearts = { ...defaultHearts };
    if (parsed.vipHearts && typeof parsed.vipHearts === 'object') {
      for (const id of VIP_CUSTOMER_IDS) {
        const val = parsed.vipHearts[id];
        if (typeof val === 'number') {
          vipHearts[id] = Math.max(1, Math.min(5, Math.floor(val)));
        }
      }
    }

    const validSecrets = Array.isArray(parsed.unlockedSecretRecipes)
      ? parsed.unlockedSecretRecipes.filter((id): id is SecretRecipeId =>
          Boolean(SECRET_RECIPE_BY_ID[id as SecretRecipeId])
        )
      : [];

    const validAchievements = Array.isArray(parsed.unlockedAchievements)
      ? parsed.unlockedAchievements.filter((id): id is AchievementId =>
          ACHIEVEMENTS.some((a) => a.id === id)
        )
      : [];

    const defStats = createDefaultStats();
    const stats: PlayerStats = {
      perfectServedCount:
        typeof parsed.stats?.perfectServedCount === 'number'
          ? parsed.stats.perfectServedCount
          : defStats.perfectServedCount,
      spicyServedCount:
        typeof parsed.stats?.spicyServedCount === 'number'
          ? parsed.stats.spicyServedCount
          : defStats.spicyServedCount,
      prefMatchedCount:
        typeof parsed.stats?.prefMatchedCount === 'number'
          ? parsed.stats.prefMatchedCount
          : defStats.prefMatchedCount,
      servedPakDarmanNight: Boolean(parsed.stats?.servedPakDarmanNight),
    };

    const defaultStock = createDefaultItemStock();
    const itemStock = { ...defaultStock };
    if (parsed.itemStock && typeof parsed.itemStock === 'object') {
      for (const item of MENU_ITEMS) {
        const val = parsed.itemStock[item.id];
        if (typeof val === 'number' && Number.isFinite(val)) {
          itemStock[item.id] =
            item.cookingStation === 'instan'
              ? 99
              : Math.max(0, Math.min(99, Math.floor(val)));
        }
      }
    }

    return {
      hasSavedData: true,
      save: {
        warungName:
          typeof parsed.warungName === 'string'
            ? sanitizeWarungName(parsed.warungName)
            : DEFAULT_WARUNG_NAME,
        day:
          typeof parsed.day === 'number' && parsed.day >= 1
            ? Math.floor(parsed.day)
            : 1,
        balance:
          typeof parsed.balance === 'number' ? Math.round(parsed.balance) : 0,
        unlockedRecipes: mergedRecipes,
        unlockedUpgrades: validUpgrades,
        totalCustomersServed:
          typeof parsed.totalCustomersServed === 'number'
            ? Math.max(0, Math.floor(parsed.totalCustomersServed))
            : 0,
        vipHearts,
        unlockedSecretRecipes: validSecrets,
        unlockedAchievements: validAchievements,
        stats,
        itemStock,
        zenModeUnlocked:
          Boolean(parsed.zenModeUnlocked) ||
          mergedRecipes.length >= MENU_ITEMS.length,
      },
    };
  } catch {
    return { save: createDefaultSave(), hasSavedData: false };
  }
}

export function persistSaveToStorage(save: GameSaveState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(save));
    }
  } catch {
    // Ignore storage quota issues safely
  }
}

export function clearSaveInStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SAVE_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}
