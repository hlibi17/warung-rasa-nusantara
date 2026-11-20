export type CategoryId =
  | 'karbo'
  | 'lauk_utama'
  | 'lauk_pendamping'
  | 'sayur_sambal'
  | 'minuman';

export type MenuItemId =
  // Karbo (4)
  | 'nasi_putih'
  | 'nasi_uduk'
  | 'nasi_kuning'
  | 'nasi_merah'
  // Lauk Utama (9)
  | 'ayam_goreng'
  | 'lele_goreng'
  | 'telur_balado'
  | 'telur_dadar_padang'
  | 'rendang'
  | 'tongkol_suwir'
  | 'ayam_bakar'
  | 'ati_ampela'
  | 'ikan_pesmol'
  // Lauk Pendamping & Gorengan (8)
  | 'tempe_orek'
  | 'tahu_goreng'
  | 'perkedel'
  | 'kerupuk'
  | 'bakwan_jagung'
  | 'tempe_mendoan'
  | 'kentang_mustofa'
  | 'peyek_kacang'
  // Sayur, Kuah & Sambal (9)
  | 'tumis_kangkung'
  | 'sayur_sop'
  | 'sambal_terasi'
  | 'sambal_ijo'
  | 'sayur_asem'
  | 'sayur_lodeh'
  | 'tumis_toge_tahu'
  | 'sambal_matah'
  | 'kuah_gulai'
  // Minuman (7)
  | 'es_teh'
  | 'es_jeruk'
  | 'kopi_hitam'
  | 'teh_tawar_hangat'
  | 'es_sirup'
  | 'wedang_jahe'
  | 'es_cendol';

export type UpgradeId =
  | 'kipas_angin'
  | 'poster_warung'
  | 'radio_retro'
  | 'rice_cooker'
  | 'etalase_besar';

export type WeatherType = 'pagi_cerah' | 'sore_senja' | 'hujan_rintik';

export type SoupStyle = 'pisah' | 'siram';
export type IceLevel = 'normal' | 'tanpa_es';
export type SweetnessLevel = 'manis' | 'tawar';

export interface ServingOptions {
  soupStyle: SoupStyle;
  iceLevel: IceLevel;
  sweetness: SweetnessLevel;
}

export interface RequestedServingPrefs {
  soupStyle?: SoupStyle;
  iceLevel?: IceLevel;
  sweetness?: SweetnessLevel;
}

export type PlatingZone = 'plate' | 'bowl' | 'cup';
export type SoundKind = 'rice' | 'fry' | 'pour' | 'scoop';
export type CookingStationId = 'goreng' | 'rebus' | 'tumis' | 'cobek';
export type CookableCategory = CookingStationId | 'instan';
export type CookingStatus = 'mentah' | 'matang' | 'gosong';

export interface KitchenSlotState {
  station: CookingStationId;
  itemId: MenuItemId | null;
  progress: number;
  grindCount: number;
  stirBoostCount: number;
  lastActionAt: number;
  dingPlayed: boolean;
  burntSoundPlayed: boolean;
}

export interface RawTrayItem {
  id: string;
  itemId: MenuItemId;
  progress: number;
  station: CookingStationId;
}

export interface MenuItem {
  id: MenuItemId;
  name: string;
  category: CategoryId;
  price: number;
  cost: number;
  unlockCost: number;
  defaultUnlocked: boolean;
  platingZone: PlatingZone;
  cookingStation: CookableCategory;
  isColdDrink?: boolean;
  soundKind: SoundKind;
  shortDesc: string;
  riddleClues: string[];
}

export interface UpgradeItem {
  id: UpgradeId;
  name: string;
  cost: number;
  description: string;
  effectLabel: string;
}

export type RegularCustomerId =
  | 'mas_karyawan'
  | 'ibu_pasar'
  | 'bapak_proyek'
  | 'pelajar_sma'
  | 'mas_pelari'
  | 'nenek_ramah'
  | 'mas_kurir'
  | 'mbak_perawat'
  | 'bapak_angkot'
  | 'anak_kecil'
  | 'mas_indie'
  | 'ibu_guru';

export type VipCustomerId =
  | 'bang_jaka'
  | 'dinda'
  | 'riko'
  | 'bu_tejo'
  | 'pak_darman'
  | 'koh_hendra'
  | 'teh_sari'
  | 'kang_ujang';

export type CustomerArchetypeId = RegularCustomerId | VipCustomerId;

export interface CustomerArchetype {
  id: CustomerArchetypeId;
  name: string;
  role: string;
  isVip?: boolean;
  greetings: string[];
}

export type SecretRecipeId =
  | 'paket_gaspol_ojol'
  | 'nasi_komplit_jagoan'
  | 'nasi_uduk_skripsi'
  | 'menu_praktis_kampus'
  | 'kombo_tanggal_tua'
  | 'paket_anak_kos_spesial'
  | 'lodeh_spesial_bu_tejo'
  | 'nasi_siram_spesial'
  | 'kopi_begadang_pos_ronda'
  | 'paket_ronda_hangat'
  | 'pesmol_sultan'
  | 'pesta_lauk_koh_hendra'
  | 'paket_sehat_anti_masuk_angin'
  | 'menu_bugar_teh_sari'
  | 'rendang_pedas_bengkel'
  | 'porsi_tenaga_bengkel';

export interface SecretRecipe {
  id: SecretRecipeId;
  name: string;
  vipId: VipCustomerId;
  unlockAtHearts: 3 | 5;
  ingredients: MenuItemId[];
  requiredPrefs?: RequestedServingPrefs;
  description: string;
}

export interface VipProfile {
  id: VipCustomerId;
  name: string;
  role: string;
  personality: string;
  favoriteSummary: string;
  favoriteItems: MenuItemId[];
  preferredWeather?: WeatherType[];
  heart3Story: string;
  heart5Story: string;
}

export type AchievementId =
  | 'pelanggan_pertama'
  | 'racikan_sempurna'
  | 'pecinta_pedas'
  | 'sahabat_anak_kos'
  | 'penjaga_malam'
  | 'ahli_penyajian'
  | 'juragan_warteg'
  | 'keluarga_warung';

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
}

export type OrderPatternType =
  | 'langsung'
  | 'teka_teki'
  | 'porsi_ekstra'
  | 'cuaca'
  | 'resep_rahasia';

export interface CustomerOrder {
  id: string;
  customer: CustomerArchetype;
  items: MenuItemId[];
  requestedPrefs: RequestedServingPrefs;
  secretRecipeId?: SecretRecipeId;
  patternType: OrderPatternType;
  isRiddle: boolean;
  dialogue: string;
  hintText: string;
}

export type AccuracyTier = 'sempurna' | 'kurang_tepat' | 'salah';

export interface OrderEvaluation {
  tier: AccuracyTier;
  matchedItems: MenuItemId[];
  missingItems: MenuItemId[];
  extraItems: MenuItemId[];
  mismatchedPrefs: string[];
  baseRevenue: number;
  ingredientCost: number;
  tipAmount: number;
  freshlyCookedBonus: number;
  totalPaid: number;
  reactionDialogue: string;
}

export interface ServedRecord {
  orderId: string;
  customerName: string;
  tier: AccuracyTier;
  baseRevenue: number;
  ingredientCost: number;
  tipAmount: number;
  totalPaid: number;
}

export interface DailySummary {
  day: number;
  customersServed: number;
  perfectCount: number;
  partialCount: number;
  wrongCount: number;
  totalRevenue: number;
  totalCost: number;
  totalTips: number;
  netProfit: number;
}

export type GameMode = 'harian' | 'endless';
export type GameScreenState = 'title' | 'playing' | 'summary';

export interface PlayerStats {
  perfectServedCount: number;
  spicyServedCount: number;
  prefMatchedCount: number;
  servedPakDarmanNight: boolean;
}

export interface GameSaveState {
  warungName: string;
  day: number;
  balance: number;
  unlockedRecipes: MenuItemId[];
  unlockedUpgrades: UpgradeId[];
  totalCustomersServed: number;
  vipHearts: Record<VipCustomerId, number>;
  unlockedSecretRecipes: SecretRecipeId[];
  unlockedAchievements: AchievementId[];
  stats: PlayerStats;
  itemStock: Record<MenuItemId, number>;
  zenModeUnlocked: boolean;
}
