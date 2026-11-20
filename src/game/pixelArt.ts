import { MENU_BY_ID } from './data';
import {
  DEFAULT_SERVING_OPTIONS,
  getCookingStatus,
  isApproachingBurn,
} from './rules';
import {
  CookingStatus,
  CustomerArchetypeId,
  KitchenSlotState,
  MenuItemId,
  ServingOptions,
  UpgradeId,
  WeatherType,
} from './types';

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function createOffscreenCanvas(
  width: number,
  height: number
): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(width));
  c.height = Math.max(1, Math.ceil(height));
  return c;
}

const portraitCache = new Map<string, HTMLCanvasElement>();
const warungBackdropCache = new Map<string, HTMLCanvasElement>();
const foodSpriteCache = new Map<string, HTMLCanvasElement>();
const platingBaseCache = new Map<string, HTMLCanvasElement>();

export type CustomerMood = 'neutral' | 'sempurna' | 'kurang_tepat' | 'salah';

type CharacterAccessory =
  | 'ojol_jacket'
  | 'dinda_clip'
  | 'riko_beanie'
  | 'bu_tejo_bun'
  | 'security_cap'
  | 'koh_hendra_glasses'
  | 'teh_sari_hijab'
  | 'kang_ujang_bandana'
  | 'tie'
  | 'market_scarf'
  | 'neck_towel'
  | 'school_uniform'
  | 'sport_headband'
  | 'kebaya_bun'
  | 'courier_cap'
  | 'nurse_cap'
  | 'flat_cap'
  | 'kid_cap'
  | 'indie_beanie'
  | 'hijab_glasses';

interface CharacterPalette {
  skin: string;
  skinShade: string;
  hair: string;
  shirt: string;
  shirtAccent: string;
  accessory: CharacterAccessory;
  accessoryColor: string;
  hasMustache?: boolean;
  hasGlasses?: boolean;
}

const CHARACTER_PALETTES: Record<CustomerArchetypeId, CharacterPalette> = {
  // 8 VIP Customers
  bang_jaka: {
    skin: '#d99b66',
    skinShade: '#b87946',
    hair: '#1e1b18',
    shirt: '#15803d',
    shirtAccent: '#facc15',
    accessory: 'ojol_jacket',
    accessoryColor: '#16a34a',
  },
  dinda: {
    skin: '#ecc198',
    skinShade: '#cfa074',
    hair: '#2a1812',
    shirt: '#e07a5f',
    shirtAccent: '#f4f1de',
    accessory: 'dinda_clip',
    accessoryColor: '#f59e0b',
  },
  riko: {
    skin: '#e0ac7c',
    skinShade: '#bd8758',
    hair: '#1f1a17',
    shirt: '#3d5a80',
    shirtAccent: '#98c1d9',
    accessory: 'riko_beanie',
    accessoryColor: '#c93b2b',
  },
  bu_tejo: {
    skin: '#dfae82',
    skinShade: '#bc885d',
    hair: '#221c1a',
    shirt: '#0f766e',
    shirtAccent: '#fcd34d',
    accessory: 'bu_tejo_bun',
    accessoryColor: '#f59e0b',
  },
  pak_darman: {
    skin: '#c48756',
    skinShade: '#9e673a',
    hair: '#94a3b8',
    shirt: '#1e3a5f',
    shirtAccent: '#f8fafc',
    accessory: 'security_cap',
    accessoryColor: '#0f172a',
    hasMustache: true,
  },
  koh_hendra: {
    skin: '#f0cbb0',
    skinShade: '#d5a88a',
    hair: '#2c2724',
    shirt: '#991b1b',
    shirtAccent: '#fbbf24',
    accessory: 'koh_hendra_glasses',
    accessoryColor: '#1f2937',
    hasGlasses: true,
  },
  teh_sari: {
    skin: '#e7b58b',
    skinShade: '#c69065',
    hair: '#231915',
    shirt: '#ecfdf5',
    shirtAccent: '#10b981',
    accessory: 'teh_sari_hijab',
    accessoryColor: '#6ee7b7',
  },
  kang_ujang: {
    skin: '#c98e5d',
    skinShade: '#9f683c',
    hair: '#181412',
    shirt: '#1d4ed8',
    shirtAccent: '#f97316',
    accessory: 'kang_ujang_bandana',
    accessoryColor: '#ea580c',
    hasMustache: true,
  },

  // 12 Regular Townfolk Customers
  mas_karyawan: {
    skin: '#e0ad7d',
    skinShade: '#bd8758',
    hair: '#1e1b18',
    shirt: '#f8fafc',
    shirtAccent: '#1e40af',
    accessory: 'tie',
    accessoryColor: '#dc2626',
  },
  ibu_pasar: {
    skin: '#d9a172',
    skinShade: '#b57d50',
    hair: '#2b201b',
    shirt: '#b5533c',
    shirtAccent: '#fde68a',
    accessory: 'market_scarf',
    accessoryColor: '#f59e0b',
  },
  bapak_proyek: {
    skin: '#b87a4b',
    skinShade: '#8f582e',
    hair: '#1f1916',
    shirt: '#ca8a04',
    shirtAccent: '#78350f',
    accessory: 'neck_towel',
    accessoryColor: '#f8fafc',
    hasMustache: true,
  },
  pelajar_sma: {
    skin: '#e8b990',
    skinShade: '#c79367',
    hair: '#1b1715',
    shirt: '#ffffff',
    shirtAccent: '#64748b',
    accessory: 'school_uniform',
    accessoryColor: '#475569',
  },
  mas_pelari: {
    skin: '#d69763',
    skinShade: '#b37442',
    hair: '#231d19',
    shirt: '#0284c7',
    shirtAccent: '#38bdf8',
    accessory: 'sport_headband',
    accessoryColor: '#facc15',
  },
  nenek_ramah: {
    skin: '#dfae82',
    skinShade: '#bc885d',
    hair: '#e2e8f0',
    shirt: '#7c3aed',
    shirtAccent: '#ddd6fe',
    accessory: 'kebaya_bun',
    accessoryColor: '#cbd5e1',
  },
  mas_kurir: {
    skin: '#d99e6b',
    skinShade: '#b57b4a',
    hair: '#1d1917',
    shirt: '#ea580c',
    shirtAccent: '#fed7aa',
    accessory: 'courier_cap',
    accessoryColor: '#9a3412',
  },
  mbak_perawat: {
    skin: '#eec49f',
    skinShade: '#ce9e75',
    hair: '#2a1d17',
    shirt: '#f1f5f9',
    shirtAccent: '#0d9488',
    accessory: 'nurse_cap',
    accessoryColor: '#ffffff',
  },
  bapak_angkot: {
    skin: '#c78a59',
    skinShade: '#9d6639',
    hair: '#475569',
    shirt: '#0369a1',
    shirtAccent: '#bae6fd',
    accessory: 'flat_cap',
    accessoryColor: '#334155',
    hasMustache: true,
  },
  anak_kecil: {
    skin: '#ebbc92',
    skinShade: '#c9966a',
    hair: '#211914',
    shirt: '#facc15',
    shirtAccent: '#ef4444',
    accessory: 'kid_cap',
    accessoryColor: '#2563eb',
  },
  mas_indie: {
    skin: '#e0af84',
    skinShade: '#bc895d',
    hair: '#2b211c',
    shirt: '#18181b',
    shirtAccent: '#a1a1aa',
    accessory: 'indie_beanie',
    accessoryColor: '#4d7c0f',
    hasGlasses: true,
  },
  ibu_guru: {
    skin: '#e4b386',
    skinShade: '#c18e61',
    hair: '#221814',
    shirt: '#7c2d12',
    shirtAccent: '#fed7aa',
    accessory: 'hijab_glasses',
    accessoryColor: '#fde68a',
    hasGlasses: true,
  },
};

function drawCustomerSprite(
  ctx: CanvasRenderingContext2D,
  archetypeId: CustomerArchetypeId,
  cx: number,
  bottomY: number,
  scale: number,
  timeSec: number,
  mood: CustomerMood
) {
  const pal = CHARACTER_PALETTES[archetypeId] ?? CHARACTER_PALETTES.bang_jaka;
  const bob =
    timeSec === 0 ? 0 : Math.round(Math.sin(timeSec * 2.4) * 0.7) * scale;
  const blink = timeSec === 0 ? false : Math.sin(timeSec * 1.1) > 0.96;

  const s = scale;
  const x0 = Math.round(cx - 12 * s);
  const y0 = Math.round(bottomY - 30 * s + bob);

  // Drop shadow / outline aura
  px(ctx, x0 + 3 * s, y0 + 16 * s, 18 * s, 14 * s, '#1f140e');
  px(ctx, x0 + 5 * s, y0 + 2 * s, 14 * s, 15 * s, '#1f140e');

  // Torso / shirt
  px(ctx, x0 + 4 * s, y0 + 17 * s, 16 * s, 13 * s, pal.shirt);
  px(ctx, x0 + 9 * s, y0 + 17 * s, 6 * s, 3 * s, pal.shirtAccent);
  px(ctx, x0 + 4 * s, y0 + 22 * s, 16 * s, 2 * s, pal.shirtAccent);
  px(ctx, x0 + 2 * s, y0 + 18 * s, 2 * s, 10 * s, pal.skinShade);
  px(ctx, x0 + 20 * s, y0 + 18 * s, 2 * s, 10 * s, pal.skinShade);

  // Torso distinctive details
  if (pal.accessory === 'tie') {
    px(ctx, x0 + 11 * s, y0 + 18 * s, 2 * s, 9 * s, pal.accessoryColor);
  } else if (pal.accessory === 'neck_towel') {
    px(ctx, x0 + 7 * s, y0 + 16 * s, 10 * s, 3 * s, pal.accessoryColor);
    px(ctx, x0 + 7 * s, y0 + 19 * s, 2 * s, 7 * s, pal.accessoryColor);
    px(ctx, x0 + 15 * s, y0 + 19 * s, 2 * s, 7 * s, pal.accessoryColor);
  } else if (pal.accessory === 'market_scarf') {
    // Shopping basket handle peeking on left arm
    px(ctx, x0 + 1 * s, y0 + 22 * s, 4 * s, 7 * s, '#92400e');
    px(ctx, x0 + 2 * s, y0 + 20 * s, 2 * s, 2 * s, '#16a34a');
  } else if (pal.accessory === 'school_uniform') {
    // Grey vest / OSIS pocket badge
    px(ctx, x0 + 14 * s, y0 + 20 * s, 3 * s, 3 * s, '#334155');
  } else if (pal.accessory === 'nurse_cap') {
    // Teal stethoscope accent
    px(ctx, x0 + 8 * s, y0 + 17 * s, 1 * s, 6 * s, '#0f766e');
    px(ctx, x0 + 15 * s, y0 + 17 * s, 1 * s, 6 * s, '#0f766e');
  }

  // Neck & Face
  px(ctx, x0 + 10 * s, y0 + 14 * s, 4 * s, 3 * s, pal.skinShade);
  px(ctx, x0 + 6 * s, y0 + 5 * s, 12 * s, 10 * s, pal.skin);
  px(ctx, x0 + 6 * s, y0 + 13 * s, 12 * s, 2 * s, pal.skinShade);

  // Cheeks
  px(ctx, x0 + 7 * s, y0 + 11 * s, 2 * s, 1 * s, '#e58a7c');
  px(ctx, x0 + 15 * s, y0 + 11 * s, 2 * s, 1 * s, '#e58a7c');

  // Hair / Headwear
  if (
    pal.accessory === 'teh_sari_hijab' ||
    pal.accessory === 'hijab_glasses' ||
    pal.accessory === 'market_scarf'
  ) {
    px(ctx, x0 + 4 * s, y0 + 2 * s, 16 * s, 5 * s, pal.accessoryColor);
    px(ctx, x0 + 4 * s, y0 + 6 * s, 3 * s, 11 * s, pal.accessoryColor);
    px(ctx, x0 + 17 * s, y0 + 6 * s, 3 * s, 11 * s, pal.accessoryColor);
    px(ctx, x0 + 6 * s, y0 + 15 * s, 12 * s, 4 * s, pal.accessoryColor);
  } else if (pal.accessory === 'ojol_jacket') {
    px(ctx, x0 + 4 * s, y0 + 1 * s, 16 * s, 6 * s, pal.accessoryColor);
    px(ctx, x0 + 5 * s, y0 + 2 * s, 14 * s, 2 * s, '#86efac');
    px(ctx, x0 + 4 * s, y0 + 6 * s, 16 * s, 1 * s, '#143d25');
  } else if (pal.accessory === 'security_cap') {
    px(ctx, x0 + 5 * s, y0 + 1 * s, 14 * s, 5 * s, pal.accessoryColor);
    px(ctx, x0 + 10 * s, y0 + 2 * s, 4 * s, 2 * s, '#facc15');
    px(ctx, x0 + 4 * s, y0 + 5 * s, 16 * s, 2 * s, '#334155');
  } else if (
    pal.accessory === 'courier_cap' ||
    pal.accessory === 'flat_cap' ||
    pal.accessory === 'kid_cap'
  ) {
    px(ctx, x0 + 5 * s, y0 + 1 * s, 14 * s, 5 * s, pal.accessoryColor);
    px(ctx, x0 + 4 * s, y0 + 5 * s, 16 * s, 2 * s, '#1e293b');
    px(ctx, x0 + 5 * s, y0 + 6 * s, 2 * s, 3 * s, pal.hair);
    px(ctx, x0 + 17 * s, y0 + 6 * s, 2 * s, 3 * s, pal.hair);
  } else if (
    pal.accessory === 'riko_beanie' ||
    pal.accessory === 'indie_beanie'
  ) {
    px(ctx, x0 + 5 * s, y0 + 1 * s, 14 * s, 5 * s, pal.accessoryColor);
    px(ctx, x0 + 5 * s, y0 + 5 * s, 14 * s, 2 * s, '#1e293b');
    px(ctx, x0 + 5 * s, y0 + 7 * s, 2 * s, 4 * s, pal.hair);
    px(ctx, x0 + 17 * s, y0 + 7 * s, 2 * s, 4 * s, pal.hair);
  } else if (pal.accessory === 'dinda_clip') {
    px(ctx, x0 + 6 * s, y0 + 2 * s, 12 * s, 4 * s, pal.hair);
    px(ctx, x0 + 5 * s, y0 + 5 * s, 2 * s, 8 * s, pal.hair);
    px(ctx, x0 + 17 * s, y0 + 5 * s, 2 * s, 8 * s, pal.hair);
    px(ctx, x0 + 15 * s, y0 + 4 * s, 3 * s, 2 * s, pal.accessoryColor);
  } else if (pal.accessory === 'bu_tejo_bun' || pal.accessory === 'kebaya_bun') {
    px(ctx, x0 + 9 * s, y0 + 0 * s, 6 * s, 3 * s, pal.hair);
    px(ctx, x0 + 6 * s, y0 + 3 * s, 12 * s, 3 * s, pal.hair);
    px(ctx, x0 + 13 * s, y0 + 1 * s, 2 * s, 2 * s, pal.accessoryColor);
  } else if (
    pal.accessory === 'kang_ujang_bandana' ||
    pal.accessory === 'sport_headband'
  ) {
    px(ctx, x0 + 6 * s, y0 + 3 * s, 12 * s, 3 * s, pal.hair);
    px(ctx, x0 + 5 * s, y0 + 5 * s, 14 * s, 2 * s, pal.accessoryColor);
  } else if (pal.accessory === 'nurse_cap') {
    px(ctx, x0 + 7 * s, y0 + 1 * s, 10 * s, 3 * s, '#ffffff');
    px(ctx, x0 + 11 * s, y0 + 2 * s, 2 * s, 2 * s, '#ef4444');
    px(ctx, x0 + 6 * s, y0 + 4 * s, 12 * s, 2 * s, pal.hair);
    px(ctx, x0 + 5 * s, y0 + 5 * s, 2 * s, 7 * s, pal.hair);
    px(ctx, x0 + 17 * s, y0 + 5 * s, 2 * s, 7 * s, pal.hair);
  } else {
    px(ctx, x0 + 6 * s, y0 + 3 * s, 12 * s, 3 * s, pal.hair);
    px(ctx, x0 + 5 * s, y0 + 5 * s, 2 * s, 6 * s, pal.hair);
    px(ctx, x0 + 17 * s, y0 + 5 * s, 2 * s, 6 * s, pal.hair);
  }

  // Eyes
  if (blink) {
    px(ctx, x0 + 8 * s, y0 + 9 * s, 2 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 14 * s, y0 + 9 * s, 2 * s, 1 * s, '#1f140e');
  } else if (mood === 'sempurna') {
    px(ctx, x0 + 8 * s, y0 + 8 * s, 2 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 14 * s, y0 + 8 * s, 2 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 7 * s, y0 + 9 * s, 1 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 10 * s, y0 + 9 * s, 1 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 13 * s, y0 + 9 * s, 1 * s, 1 * s, '#1f140e');
    px(ctx, x0 + 16 * s, y0 + 9 * s, 1 * s, 1 * s, '#1f140e');
  } else {
    px(ctx, x0 + 8 * s, y0 + 8 * s, 2 * s, 2 * s, '#1f140e');
    px(ctx, x0 + 14 * s, y0 + 8 * s, 2 * s, 2 * s, '#1f140e');
    px(ctx, x0 + 8 * s, y0 + 8 * s, 1 * s, 1 * s, '#ffffff');
    px(ctx, x0 + 14 * s, y0 + 8 * s, 1 * s, 1 * s, '#ffffff');
  }

  // Glasses
  if (pal.hasGlasses) {
    const frameColor =
      pal.accessory === 'hijab_glasses' ? '#78350f' : pal.accessoryColor;
    px(ctx, x0 + 7 * s, y0 + 7 * s, 4 * s, 1 * s, frameColor);
    px(ctx, x0 + 13 * s, y0 + 7 * s, 4 * s, 1 * s, frameColor);
    px(ctx, x0 + 11 * s, y0 + 8 * s, 2 * s, 1 * s, frameColor);
    px(ctx, x0 + 7 * s, y0 + 10 * s, 4 * s, 1 * s, frameColor);
    px(ctx, x0 + 13 * s, y0 + 10 * s, 4 * s, 1 * s, frameColor);
  }

  // Mustache
  if (pal.hasMustache) {
    px(ctx, x0 + 9 * s, y0 + 11 * s, 6 * s, 1 * s, pal.hair);
  }

  // Mouth
  if (mood === 'sempurna') {
    px(ctx, x0 + 10 * s, y0 + 12 * s, 4 * s, 2 * s, '#8c2d23');
    px(ctx, x0 + 11 * s, y0 + 12 * s, 2 * s, 1 * s, '#ffffff');
  } else if (mood === 'salah') {
    px(ctx, x0 + 10 * s, y0 + 13 * s, 4 * s, 1 * s, '#5e3023');
  } else {
    px(ctx, x0 + 10 * s, y0 + 12 * s, 4 * s, 1 * s, '#7a3e2e');
  }
}

export function drawCustomerPortrait(
  ctx: CanvasRenderingContext2D,
  archetypeId: CustomerArchetypeId,
  width: number,
  height: number
) {
  ctx.imageSmoothingEnabled = false;
  const cacheKey = `${archetypeId}|${width}|${height}`;
  let cached = portraitCache.get(cacheKey);
  if (!cached) {
    const off = createOffscreenCanvas(width, height);
    if (off) {
      const octx = off.getContext('2d');
      if (octx) {
        octx.imageSmoothingEnabled = false;
        px(octx, 0, 0, width, height, '#4a2d1b');
        px(octx, 2, 2, width - 4, height - 4, '#694127');
        const scale = Math.max(1, Math.floor(width / 24));
        drawCustomerSprite(
          octx,
          archetypeId,
          width / 2,
          height,
          scale,
          0,
          'neutral'
        );
        portraitCache.set(cacheKey, off);
        cached = off;
      }
    }
  }
  if (cached) {
    ctx.drawImage(cached, 0, 0);
    return;
  }

  px(ctx, 0, 0, width, height, '#4a2d1b');
  px(ctx, 2, 2, width - 4, height - 4, '#694127');
  const scale = Math.max(1, Math.floor(width / 24));
  drawCustomerSprite(
    ctx,
    archetypeId,
    width / 2,
    height,
    scale,
    0,
    'neutral'
  );
}

function renderStaticWarungBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  upgrades: UpgradeId[],
  weather: WeatherType,
  isTitleScene?: boolean
) {
  ctx.imageSmoothingEnabled = false;
  const has = (id: UpgradeId) => upgrades.includes(id);

  // 1. Cozy Wooden Plank Back Wall tinted subtly by time/weather
  const wallBase =
    weather === 'pagi_cerah'
      ? '#4b2d1b'
      : weather === 'sore_senja'
      ? '#442616'
      : '#311d13';
  const plankHighlight =
    weather === 'pagi_cerah'
      ? '#5b3722'
      : weather === 'sore_senja'
      ? '#542e18'
      : '#3d2518';

  px(ctx, 0, 0, width, height, wallBase);
  for (let y = 0; y < height; y += 16) {
    px(ctx, 0, y, width, 2, '#28160c');
    px(ctx, 0, y + 2, width, 2, plankHighlight);
  }
  for (let x = 24; x < width; x += 64) {
    px(ctx, x, 0, 2, height - 30, '#2c190e');
  }

  // Warm upper trim beam
  px(ctx, 0, 0, width, 14, '#24130a');
  px(ctx, 0, 12, width, 4, '#5e3822');

  // 2. Dynamic Weather Window Sky Static Base
  const winX = 24;
  const winY = 26;
  const winW = 76;
  const winH = 56;
  px(ctx, winX - 4, winY - 4, winW + 8, winH + 8, '#231309');

  if (weather === 'pagi_cerah') {
    px(ctx, winX, winY, winW, 34, '#60a5fa');
    px(ctx, winX, winY + 34, winW, 22, '#93c5fd');
    px(ctx, winX + 54, winY + 6, 12, 12, '#fde047');
    px(ctx, winX + 56, winY + 8, 8, 8, '#fef08a');
  } else if (weather === 'sore_senja') {
    px(ctx, winX, winY, winW, 18, '#9a3412');
    px(ctx, winX, winY + 18, winW, 18, '#ea580c');
    px(ctx, winX, winY + 36, winW, 20, '#fb923c');
    px(ctx, winX + 30, winY + 34, 16, 12, '#fde047');
    px(ctx, winX + 33, winY + 37, 10, 8, '#fef9c3');
    px(ctx, winX, winY + 46, 28, 10, '#431407');
    px(ctx, winX + 48, winY + 44, 28, 12, '#431407');
  } else {
    px(ctx, winX, winY, winW, 28, '#1e293b');
    px(ctx, winX, winY + 28, winW, 28, '#334155');
    px(ctx, winX + 6, winY + 4, 34, 8, '#475569');
    px(ctx, winX + 34, winY + 7, 30, 8, '#475569');
  }

  // Sunlight / sunset beam on wall
  if (weather === 'pagi_cerah') {
    ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
    ctx.beginPath();
    ctx.moveTo(winX, winY + winH);
    ctx.lineTo(winX + winW, winY + winH);
    ctx.lineTo(winX + winW + 65, height - 24);
    ctx.lineTo(winX + 20, height - 24);
    ctx.closePath();
    ctx.fill();
  } else if (weather === 'sore_senja') {
    ctx.fillStyle = 'rgba(251, 146, 60, 0.08)';
    ctx.beginPath();
    ctx.moveTo(winX, winY + winH);
    ctx.lineTo(winX + winW, winY + winH);
    ctx.lineTo(winX + winW + 65, height - 24);
    ctx.lineTo(winX + 20, height - 24);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Upgrade: Poster Warung
  if (has('poster_warung') || isTitleScene) {
    const pxX = 114;
    const pxY = 28;
    px(ctx, pxX - 3, pxY - 3, 44, 52, '#24130a');
    px(ctx, pxX, pxY, 38, 46, '#fdf3d7');
    px(ctx, pxX + 4, pxY + 5, 30, 6, '#c93b2b');
    px(ctx, pxX + 6, pxY + 15, 26, 4, '#2d6a4f');
    px(ctx, pxX + 6, pxY + 23, 22, 3, '#694127');
    px(ctx, pxX + 6, pxY + 29, 26, 3, '#694127');
    px(ctx, pxX + 6, pxY + 35, 18, 3, '#694127');
  }

  // 4. Upgrade: Kipas Angin Dinding Frame
  if (has('kipas_angin')) {
    const fx = width - 58;
    const fy = 46;
    px(ctx, fx - 12, fy - 12, 24, 24, '#1e293b');
    px(ctx, fx - 10, fy - 10, 20, 20, '#94a3b8');
    px(ctx, fx - 8, fy - 8, 16, 16, '#cbd5e1');
  }

  // 5. Back Shelf
  const shelfY = height - 68;
  px(ctx, width - 165, shelfY, 152, 6, '#231309');
  px(ctx, width - 165, shelfY - 3, 152, 4, '#694127');

  // Upgrade: Radio Retro Static Body
  if (has('radio_retro')) {
    const rx = width - 150;
    const ry = shelfY - 22;
    px(ctx, rx, ry, 28, 19, '#5c3317');
    px(ctx, rx + 2, ry + 2, 24, 15, '#8b4d24');
    px(ctx, rx + 4, ry + 4, 12, 10, '#2a180c');
    px(ctx, rx + 18, ry + 5, 6, 4, '#fde68a');
    px(ctx, rx + 19, ry + 11, 4, 4, '#d97706');
    px(ctx, rx + 24, ry - 9, 2, 9, '#cbd5e1');
  }

  // Upgrade: Rice Cooker Static Body
  if (has('rice_cooker')) {
    const cx = width - 104;
    const cy = shelfY - 22;
    px(ctx, cx, cy + 4, 24, 15, '#e2e8f0');
    px(ctx, cx + 2, cy + 1, 20, 4, '#94a3b8');
    px(ctx, cx + 9, cy - 2, 6, 3, '#334155');
    px(ctx, cx + 10, cy + 11, 4, 4, '#f59e0b');
  }

  // 6. Background Warteg Green-Glass Etalase Silhouette
  const etaW = has('etalase_besar') ? 120 : 88;
  const etaX = width - etaW - 12;
  const etaY = height - 56;
  px(ctx, etaX - 3, etaY - 3, etaW + 6, 36, '#1b4332');
  px(ctx, etaX, etaY, etaW, 30, '#95d5b2');
  px(ctx, etaX + 3, etaY + 3, etaW - 6, 12, '#d8f3dc');
  if (has('etalase_besar')) {
    px(ctx, etaX - 3, etaY - 3, etaW + 6, 3, '#f5b942');
    px(ctx, etaX + 10, etaY + 17, 20, 8, '#c97b36');
    px(ctx, etaX + 38, etaY + 17, 20, 8, '#c93b2b');
    px(ctx, etaX + 66, etaY + 17, 20, 8, '#4d7c0f');
  } else {
    px(ctx, etaX + 10, etaY + 17, 24, 8, '#c97b36');
    px(ctx, etaX + 44, etaY + 17, 24, 8, '#c93b2b');
  }
}

function getOrCreateWarungBackdrop(
  width: number,
  height: number,
  upgrades: UpgradeId[],
  weather: WeatherType,
  isTitleScene?: boolean
): HTMLCanvasElement | null {
  const key = `${width}x${height}|${weather}|${isTitleScene ? 1 : 0}|${[...upgrades]
    .sort()
    .join(',')}`;
  const cached = warungBackdropCache.get(key);
  if (cached) return cached;
  const off = createOffscreenCanvas(width, height);
  if (!off) return null;
  const octx = off.getContext('2d');
  if (!octx) return null;
  renderStaticWarungBackdrop(octx, width, height, upgrades, weather, isTitleScene);
  warungBackdropCache.set(key, off);
  return off;
}

export function drawWarungScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeSec: number,
  options: {
    customerId: CustomerArchetypeId | null;
    mood: CustomerMood;
    upgrades: UpgradeId[];
    weather?: WeatherType;
    isTitleScene?: boolean;
  }
) {
  ctx.imageSmoothingEnabled = false;
  const {
    customerId,
    mood,
    upgrades,
    weather = 'pagi_cerah',
    isTitleScene,
  } = options;
  const has = (id: UpgradeId) => upgrades.includes(id);

  // 1. Draw cached static backdrop (wall, window base, poster, shelf, etalase)
  const backdrop = getOrCreateWarungBackdrop(
    width,
    height,
    upgrades,
    weather,
    isTitleScene
  );
  if (backdrop) {
    ctx.drawImage(backdrop, 0, 0);
  } else {
    renderStaticWarungBackdrop(ctx, width, height, upgrades, weather, isTitleScene);
  }

  // 2. Animated window weather elements (clouds / rain) + mullions on top
  const winX = 24;
  const winY = 26;
  const winW = 76;
  const winH = 56;
  if (weather === 'pagi_cerah') {
    const cloudOffset = Math.round((timeSec * 4) % 24);
    px(ctx, winX + 8 + cloudOffset, winY + 12, 18, 6, '#f8fafc');
    px(ctx, winX + 12 + cloudOffset, winY + 9, 10, 4, '#ffffff');
  } else if (weather === 'hujan_rintik') {
    for (let r = 0; r < 14; r++) {
      const rx = winX + ((r * 13 + Math.floor(timeSec * 18)) % (winW - 4));
      const ry = winY + ((r * 17 + Math.floor(timeSec * 65)) % (winH - 8));
      px(ctx, rx, ry, 2, 5, '#93c5fd');
    }
  }
  px(ctx, winX + winW / 2 - 2, winY, 4, winH, '#3a2214');
  px(ctx, winX, winY + winH / 2 - 2, winW, 4, '#3a2214');

  // 3. Animated fan blades, radio music notes, & rice cooker steam
  if (has('kipas_angin')) {
    const fx = width - 58;
    const fy = 46;
    const spinPhase = Math.floor(timeSec * 10) % 2;
    if (spinPhase === 0) {
      px(ctx, fx - 7, fy - 2, 14, 4, '#334155');
      px(ctx, fx - 2, fy - 7, 4, 14, '#334155');
    } else {
      px(ctx, fx - 5, fy - 5, 4, 4, '#334155');
      px(ctx, fx + 1, fy + 1, 4, 4, '#334155');
      px(ctx, fx + 1, fy - 5, 4, 4, '#334155');
      px(ctx, fx - 5, fy + 1, 4, 4, '#334155');
    }
    px(ctx, fx - 3, fy - 3, 6, 6, '#0f172a');
  }

  const shelfY = height - 68;
  if (has('radio_retro')) {
    const rx = width - 150;
    const ry = shelfY - 22;
    const noteOffset = Math.round(Math.sin(timeSec * 3) * 4);
    px(ctx, rx + 10, ry - 10 + noteOffset, 3, 3, '#fcd34d');
    px(ctx, rx + 13, ry - 14 + noteOffset, 2, 5, '#fcd34d');
  }

  if (has('rice_cooker')) {
    const cx = width - 104;
    const cy = shelfY - 22;
    const s1 = (timeSec * 14) % 16;
    px(ctx, cx + 11, cy - 6 - s1, 3, 3, 'rgba(255,250,235,0.65)');
  }

  // 4. Customer
  if (customerId) {
    const custX = isTitleScene ? width * 0.62 : width * 0.5;
    drawCustomerSprite(ctx, customerId, custX, height - 20, 3, timeSec, mood);
  }

  // 5. Hanging Warm Warung Lamp
  const lampSwing = Math.sin(timeSec * 1.4) * 3;
  const lampX = Math.round(width * 0.5 + lampSwing);
  const lampY = 24;
  px(ctx, lampX - 1, 0, 2, lampY, '#140c08');

  const glowAlpha =
    weather === 'pagi_cerah' ? 0.06 : weather === 'sore_senja' ? 0.11 : 0.13;
  ctx.fillStyle = `rgba(253, 224, 71, ${glowAlpha})`;
  ctx.beginPath();
  ctx.moveTo(lampX - 10, lampY + 8);
  ctx.lineTo(lampX + 10, lampY + 8);
  ctx.lineTo(lampX + 110, height - 20);
  ctx.lineTo(lampX - 110, height - 20);
  ctx.closePath();
  ctx.fill();

  px(ctx, lampX - 14, lampY + 2, 28, 6, '#1b4332');
  px(ctx, lampX - 8, lampY - 2, 16, 4, '#2d6a4f');
  px(ctx, lampX - 5, lampY + 8, 10, 6, '#fde047');

  // Foreground subtle rain streaks near open doorway edge
  if (weather === 'hujan_rintik') {
    for (let i = 0; i < 8; i++) {
      const rx = ((i * 59 + Math.floor(timeSec * 30)) % (width - 16)) + 8;
      const ry = (i * 29 + Math.floor(timeSec * 110)) % (height - 28);
      px(ctx, rx, ry, 2, 7, 'rgba(186, 230, 253, 0.28)');
    }
  }

  // 6. Front Wooden Countertop
  px(ctx, 0, height - 24, width, 24, '#59331d');
  px(ctx, 0, height - 24, width, 4, '#8a5230');
  px(ctx, 0, height - 20, width, 2, '#2d180d');
}

function tintColorForPhase(color: string, phase?: CookingStatus): string {
  if (!phase || phase === 'matang') return color;
  if (!color.startsWith('#') || (color.length !== 7 && color.length !== 4)) {
    return color;
  }
  const fullHex =
    color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
  const r = parseInt(fullHex.slice(1, 3), 16);
  const g = parseInt(fullHex.slice(3, 5), 16);
  const b = parseInt(fullHex.slice(5, 7), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return color;

  if (phase === 'mentah') {
    // Blend 42% toward pale raw cream (#f3e8d2) so uncooked food looks visibly pale
    const mix = 0.42;
    const nr = Math.round(r * (1 - mix) + 243 * mix);
    const ng = Math.round(g * (1 - mix) + 232 * mix);
    const nb = Math.round(b * (1 - mix) + 210 * mix);
    return `#${nr.toString(16).padStart(2, '0')}${ng
      .toString(16)
      .padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  }

  // phase === 'gosong': charred black / dark charcoal / ash tones
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum > 185) return '#44403c';
  if (lum > 105) return '#292524';
  return '#1c1917';
}

export function drawFoodSprite(
  ctx: CanvasRenderingContext2D,
  itemId: MenuItemId,
  ox: number,
  oy: number,
  s: number,
  servingOptions: ServingOptions = DEFAULT_SERVING_OPTIONS,
  cookingPhase?: CookingStatus
) {
  ctx.imageSmoothingEnabled = false;
  const withoutIce = servingOptions.iceLevel === 'tanpa_es';
  const unsweetened = servingOptions.sweetness === 'tawar';

  const cacheKey = `${itemId}|${s}|${withoutIce ? 1 : 0}|${unsweetened ? 1 : 0}|${cookingPhase ?? 'matang'}`;
  const cached = foodSpriteCache.get(cacheKey);
  if (cached) {
    ctx.drawImage(cached, Math.round(ox), Math.round(oy));
    return;
  }

  const offscreen = createOffscreenCanvas(16 * s, 16 * s);
  const drawCtx = offscreen?.getContext('2d') ?? ctx;
  drawCtx.imageSmoothingEnabled = false;
  const baseX = offscreen ? 0 : ox;
  const baseY = offscreen ? 0 : oy;

  const p = (x: number, y: number, w: number, h: number, c: string) =>
    px(
      drawCtx,
      baseX + x * s,
      baseY + y * s,
      w * s,
      h * s,
      tintColorForPhase(c, cookingPhase)
    );

  switch (itemId) {
    // === 1. KARBO (4) ===
    case 'nasi_putih':
      p(2, 9, 12, 5, '#94a3b8');
      p(3, 8, 10, 5, '#e2e8f0');
      p(4, 5, 8, 6, '#ffffff');
      p(6, 4, 4, 2, '#ffffff');
      p(5, 7, 2, 1, '#cbd5e1');
      p(9, 8, 2, 1, '#cbd5e1');
      break;

    case 'nasi_uduk':
      p(3, 8, 10, 5, '#f5ebd1');
      p(4, 5, 8, 6, '#fff8e7');
      p(6, 4, 4, 2, '#fff8e7');
      p(5, 6, 2, 1, '#854d0e');
      p(8, 5, 2, 1, '#713f12');
      p(10, 8, 2, 1, '#854d0e');
      p(3, 10, 3, 2, '#4d7c0f');
      break;

    case 'nasi_kuning':
      // Cone mound of bright turmeric rice + thin shredded omelette strips + cucumber
      p(2, 9, 12, 4, '#ca8a04');
      p(3, 7, 10, 5, '#eab308');
      p(5, 4, 6, 5, '#facc15');
      p(7, 3, 2, 2, '#fef08a');
      p(5, 8, 5, 1, '#fef08a'); // irisan telur tipis
      p(4, 10, 4, 1, '#fde047');
      p(10, 6, 2, 1, '#78350f'); // bawang goreng
      p(2, 11, 3, 2, '#22c55e'); // timun
      break;

    case 'nasi_merah':
      // Earthy reddish-brown healthy rice mound
      p(2, 9, 12, 5, '#5c2818');
      p(3, 7, 10, 5, '#7f3322');
      p(4, 5, 8, 5, '#9a3412');
      p(6, 4, 4, 2, '#b45309');
      p(5, 7, 2, 1, '#fed7aa');
      p(9, 8, 2, 1, '#fdba74');
      break;

    // === 2. LAUK UTAMA (9) ===
    case 'ayam_goreng':
      p(2, 9, 4, 3, '#fef3c7');
      p(5, 6, 8, 6, '#b45309');
      p(6, 5, 6, 5, '#d97706');
      p(7, 6, 3, 2, '#fbbf24');
      break;

    case 'lele_goreng':
      p(2, 7, 11, 4, '#78350f');
      p(4, 6, 8, 4, '#a16207');
      p(12, 6, 2, 6, '#92400e');
      p(1, 8, 2, 1, '#451a03');
      p(4, 7, 1, 1, '#fef08a');
      break;

    case 'telur_balado':
      p(4, 4, 8, 9, '#991b1b');
      p(5, 5, 6, 7, '#dc2626');
      p(6, 6, 4, 5, '#f8fafc');
      p(7, 7, 2, 3, '#f59e0b');
      p(4, 10, 8, 3, '#ef4444');
      break;

    case 'telur_dadar_padang':
      // Thick layered golden-brown wedge with scallion & chili specks
      p(3, 5, 10, 8, '#92400e');
      p(3, 4, 10, 6, '#d97706');
      p(4, 5, 8, 4, '#f59e0b');
      p(4, 10, 8, 2, '#b45309');
      p(5, 6, 2, 1, '#15803d'); // daun bawang
      p(9, 7, 2, 1, '#16a34a');
      p(7, 5, 1, 1, '#dc2626'); // cabai
      p(10, 8, 1, 1, '#dc2626');
      break;

    case 'rendang':
      p(3, 6, 10, 7, '#451a03');
      p(4, 5, 5, 5, '#78350f');
      p(8, 7, 4, 4, '#5c280b');
      p(5, 6, 2, 1, '#d97706');
      p(9, 8, 1, 1, '#f59e0b');
      break;

    case 'tongkol_suwir':
      // Flaked spicy reddish-brown tuna shreds with kemangi leaves
      p(3, 7, 10, 6, '#7f1d1d');
      p(4, 5, 8, 6, '#b91c1c');
      p(5, 6, 3, 2, '#d97706');
      p(8, 8, 4, 2, '#f59e0b');
      p(6, 9, 3, 2, '#ef4444');
      p(4, 5, 2, 2, '#16a34a'); // daun kemangi
      p(10, 6, 2, 2, '#22c55e');
      break;

    case 'ayam_bakar':
      // Caramelized dark soy-glazed drumstick with black grill marks
      p(2, 9, 4, 3, '#fde68a');
      p(5, 5, 8, 7, '#451a03');
      p(6, 6, 6, 5, '#7c2d12');
      p(7, 6, 1, 4, '#1c1917'); // grill mark
      p(10, 6, 1, 4, '#1c1917'); // grill mark
      p(8, 7, 2, 1, '#b45309'); // caramel sheen
      break;

    case 'ati_ampela':
      // Rich dark-brown liver + textured golden-spiced gizzard duo
      p(2, 6, 6, 6, '#5c2818');
      p(3, 7, 4, 4, '#7f1d1d');
      p(8, 7, 6, 5, '#a16207');
      p(9, 6, 4, 4, '#ca8a04');
      p(10, 8, 2, 1, '#fde047');
      break;

    case 'ikan_pesmol':
      // Mackerel swimming in bright yellow turmeric pickle sauce + red/green garnish
      p(2, 9, 12, 4, '#eab308'); // kuah kuning
      p(3, 6, 9, 4, '#94a3b8'); // badan ikan
      p(4, 7, 7, 2, '#cbd5e1');
      p(12, 5, 2, 5, '#64748b'); // ekor
      p(4, 6, 1, 1, '#fef08a');
      p(5, 10, 2, 1, '#dc2626'); // cabai utuh
      p(9, 10, 2, 1, '#16a34a'); // timun/daun bawang
      break;

    // === 3. LAUK PENDAMPING & GORENGAN (8) ===
    case 'tempe_orek':
      p(3, 7, 10, 6, '#713f12');
      p(4, 6, 4, 4, '#b45309');
      p(8, 8, 4, 4, '#92400e');
      p(6, 9, 3, 2, '#d97706');
      p(5, 7, 1, 1, '#ef4444');
      break;

    case 'tahu_goreng':
      p(4, 5, 8, 7, '#ca8a04');
      p(5, 4, 6, 6, '#facc15');
      p(6, 6, 4, 4, '#fef08a');
      break;

    case 'perkedel':
      p(4, 6, 8, 6, '#92400e');
      p(5, 5, 6, 6, '#d97706');
      p(6, 7, 4, 3, '#fbbf24');
      p(7, 7, 1, 1, '#15803d');
      p(9, 8, 1, 1, '#15803d');
      break;

    case 'kerupuk':
      p(3, 5, 10, 8, '#94a3b8');
      p(4, 4, 8, 8, '#cbd5e1');
      p(5, 3, 6, 8, '#ffffff');
      p(4, 6, 8, 3, '#f8fafc');
      p(6, 5, 1, 1, '#cbd5e1');
      p(9, 7, 1, 1, '#cbd5e1');
      break;

    case 'bakwan_jagung':
      // Crispy golden fritter disc studded with yellow corn kernels & green scallions
      p(3, 6, 10, 6, '#b45309');
      p(4, 5, 8, 6, '#f59e0b');
      p(5, 6, 2, 2, '#fef08a'); // jagung
      p(9, 6, 2, 2, '#fde047'); // jagung
      p(7, 8, 2, 2, '#fef08a');
      p(4, 8, 2, 1, '#15803d'); // daun bawang
      p(10, 9, 1, 1, '#16a34a');
      break;

    case 'tempe_mendoan':
      // Wide flat pale-gold soft-battered tempe with green scallion flecks
      p(2, 5, 12, 7, '#ca8a04');
      p(3, 4, 10, 7, '#fde047');
      p(4, 5, 8, 5, '#fef08a');
      p(5, 6, 2, 1, '#15803d');
      p(9, 7, 2, 1, '#15803d');
      p(6, 9, 2, 1, '#16a34a');
      break;

    case 'kentang_mustofa':
      // Crispy caramelized red-orange julienned potato mound
      p(3, 7, 10, 5, '#991b1b');
      p(4, 5, 8, 6, '#dc2626');
      p(5, 6, 5, 1, '#fbbf24');
      p(6, 8, 6, 1, '#f59e0b');
      p(4, 9, 5, 1, '#fde047');
      p(7, 10, 4, 1, '#fb923c');
      break;

    case 'peyek_kacang':
      // Irregular thin pale-gold wafer dotted with brown peanut halves & lime leaf
      p(2, 6, 11, 6, '#d97706');
      p(3, 5, 10, 6, '#fef3c7');
      p(4, 6, 8, 4, '#fde68a');
      p(4, 6, 2, 2, '#78350f'); // kacang
      p(8, 7, 2, 2, '#92400e'); // kacang
      p(6, 9, 2, 2, '#78350f'); // kacang
      p(10, 6, 1, 1, '#15803d'); // daun jeruk
      break;

    // === 4. SAYUR, KUAH & SAMBAL (9) ===
    case 'tumis_kangkung':
      p(3, 7, 10, 5, '#14532d');
      p(4, 5, 8, 5, '#15803d');
      p(5, 6, 5, 3, '#22c55e');
      p(7, 7, 2, 1, '#ef4444');
      break;

    case 'sayur_sop':
      p(3, 6, 10, 6, '#fef3c7');
      p(4, 7, 8, 4, '#fde68a');
      p(5, 7, 2, 2, '#f97316');
      p(8, 8, 2, 2, '#eab308');
      p(10, 7, 2, 1, '#16a34a');
      break;

    case 'sambal_terasi':
      p(4, 7, 8, 5, '#7f1d1d');
      p(5, 6, 6, 4, '#dc2626');
      p(6, 5, 4, 2, '#ef4444');
      p(7, 7, 1, 1, '#fbbf24');
      break;

    case 'sambal_ijo':
      p(4, 7, 8, 5, '#14532d');
      p(5, 6, 6, 4, '#4d7c0f');
      p(6, 5, 4, 2, '#84cc16');
      p(7, 7, 1, 1, '#d9f99d');
      break;

    case 'sayur_asem':
      // Reddish-amber tamarind broth with yellow corn chunk & green melinjo/beans
      p(3, 6, 10, 6, '#c2410c');
      p(4, 7, 8, 4, '#fb923c');
      p(5, 6, 3, 3, '#facc15'); // potongan jagung
      p(9, 8, 2, 2, '#15803d'); // melinjo/kacang panjang
      p(6, 9, 2, 1, '#84cc16');
      break;

    case 'sayur_lodeh':
      // Creamy pale-yellow coconut milk broth with green long beans & labu
      p(3, 6, 10, 6, '#fde68a');
      p(4, 7, 8, 4, '#fef9c3');
      p(5, 7, 2, 2, '#84cc16'); // labu siam
      p(8, 8, 3, 1, '#15803d'); // kacang panjang
      p(7, 6, 2, 1, '#dc2626'); // irisan cabai merah
      break;

    case 'tumis_toge_tahu':
      // White crunchy bean sprouts + diced yellow tofu + green chives
      p(3, 6, 10, 6, '#ca8a04');
      p(4, 7, 8, 4, '#f8fafc'); // toge
      p(5, 6, 3, 3, '#facc15'); // potongan tahu
      p(9, 8, 3, 2, '#fde047'); // tahu
      p(6, 6, 2, 1, '#16a34a'); // kucai
      p(8, 10, 2, 1, '#16a34a');
      break;

    case 'sambal_matah':
      // Fresh chopped purple shallots, red chili & pale lemongrass
      p(4, 7, 8, 5, '#fef08a'); // minyak hangat
      p(5, 6, 2, 2, '#c026d3'); // bawang merah ungu
      p(8, 7, 2, 2, '#e879f9'); // bawang merah
      p(6, 8, 2, 2, '#dc2626'); // cabai rawit merah
      p(9, 6, 2, 1, '#84cc16'); // serai / daun jeruk
      break;

    case 'kuah_gulai':
      // Rich golden-turmeric curry broth with spiced oil droplets & curry leaf
      p(3, 6, 10, 6, '#b45309');
      p(4, 7, 8, 4, '#f59e0b');
      p(5, 8, 6, 2, '#fbbf24');
      p(5, 7, 1, 1, '#dc2626'); // minyak cabai
      p(9, 9, 1, 1, '#dc2626');
      p(8, 6, 2, 1, '#15803d'); // daun salam/jeruk
      break;

    // === 5. MINUMAN (7) ===
    case 'es_teh':
      p(5, 3, 6, 10, '#cbd5e1');
      p(6, 5, 4, 7, unsweetened ? '#d97706' : '#92400e');
      if (!withoutIce) {
        p(6, 5, 2, 2, '#e0f2fe');
        p(8, 6, 2, 2, '#bae6fd');
      }
      p(9, 1, 1, 5, '#ef4444');
      if (unsweetened) {
        p(6, 10, 4, 1, '#fef3c7');
      }
      break;

    case 'es_jeruk':
      p(5, 3, 6, 10, '#cbd5e1');
      p(6, 5, 4, 7, unsweetened ? '#fb923c' : '#ea580c');
      if (!withoutIce) {
        p(6, 5, 2, 2, '#fef08a');
        p(8, 6, 2, 2, '#e0f2fe');
      }
      p(9, 1, 1, 5, '#16a34a');
      if (unsweetened) {
        p(6, 10, 4, 1, '#fef3c7');
      }
      break;

    case 'kopi_hitam':
      p(4, 11, 8, 2, '#e2e8f0');
      p(5, 6, 6, 5, '#ffffff');
      p(11, 7, 2, 3, '#cbd5e1');
      p(6, 6, 4, 2, '#29170b');
      p(7, 3, 1, 2, '#f8fafc');
      p(9, 2, 1, 2, '#f8fafc');
      break;

    case 'teh_tawar_hangat':
      // Warm clear amber tea in ceramic mug + saucer + steam
      p(4, 11, 8, 2, '#cbd5e1');
      p(5, 6, 6, 5, '#fef3c7');
      p(11, 7, 2, 3, '#e2e8f0');
      p(6, 6, 4, 2, '#b45309'); // clear amber tea
      p(7, 3, 1, 2, '#f8fafc');
      p(9, 2, 1, 2, '#f8fafc');
      break;

    case 'es_sirup':
      // Tall rosy-pink cocopandan syrup glass + ice + white straw
      p(5, 3, 6, 10, '#cbd5e1');
      p(6, 5, 4, 7, unsweetened ? '#f472b6' : '#ec4899');
      if (!withoutIce) {
        p(6, 5, 2, 2, '#fce7f3');
        p(8, 6, 2, 2, '#e0f2fe');
      }
      p(9, 1, 1, 5, '#ffffff');
      if (unsweetened) {
        p(6, 10, 4, 1, '#fce7f3');
      }
      break;

    case 'wedang_jahe':
      // Warm golden-brown ginger brew in earthen mug with floating ginger slice & steam
      p(4, 11, 8, 2, '#92400e');
      p(5, 6, 6, 5, '#78350f');
      p(11, 7, 2, 3, '#5c280b');
      p(6, 6, 4, 2, '#d97706'); // jahe brew
      p(7, 6, 2, 1, '#fef08a'); // irisan jahe
      p(7, 3, 1, 2, '#f8fafc');
      p(9, 2, 1, 2, '#f8fafc');
      break;

    case 'es_cendol':
      // Layered glass: palm sugar dark base, creamy santan, bright green cendol droplets
      p(5, 3, 6, 10, '#cbd5e1');
      p(6, 9, 4, 3, '#78350f'); // gula merah
      p(6, 6, 4, 3, '#fef9c3'); // santan
      p(6, 5, 4, 2, unsweetened ? '#f8fafc' : '#e0f2fe');
      p(6, 7, 1, 2, '#16a34a'); // bulir cendol
      p(8, 8, 1, 2, '#22c55e');
      p(7, 6, 1, 1, '#16a34a');
      if (!withoutIce) {
        p(6, 5, 2, 1, '#bae6fd');
      }
      p(9, 1, 1, 5, '#15803d');
      break;
  }
  if (offscreen) {
    foodSpriteCache.set(cacheKey, offscreen);
    ctx.drawImage(offscreen, Math.round(ox), Math.round(oy));
  }
}

function getOrCreatePlatingBase(
  width: number,
  height: number
): HTMLCanvasElement | null {
  const key = `${width}x${height}`;
  const existing = platingBaseCache.get(key);
  if (existing) return existing;

  const offscreen = createOffscreenCanvas(width, height);
  if (!offscreen) return null;
  const bCtx = offscreen.getContext('2d');
  if (!bCtx) return null;
  bCtx.imageSmoothingEnabled = false;

  // Warm wooden tabletop surface
  px(bCtx, 0, 0, width, height, '#6e4226');
  for (let y = 0; y < height; y += 22) {
    px(bCtx, 0, y, width, 2, '#54301a');
  }
  px(bCtx, 20, 12, width - 40, height - 24, '#8b5734');
  px(bCtx, 24, 16, width - 48, height - 32, '#7d4d2c');

  // 1. Main Melamine Plate (Left-Center)
  const plateCx = Math.round(width * 0.34);
  const plateCy = Math.round(height * 0.52);
  px(bCtx, plateCx - 66, plateCy - 36, 132, 76, '#4a2915');
  px(bCtx, plateCx - 58, plateCy - 42, 116, 88, '#4a2915');
  px(bCtx, plateCx - 64, plateCy - 38, 128, 76, '#f8fafc');
  px(bCtx, plateCx - 56, plateCy - 44, 112, 88, '#f8fafc');
  px(bCtx, plateCx - 56, plateCy - 32, 112, 64, '#a7f3d0');
  px(bCtx, plateCx - 50, plateCy - 38, 100, 76, '#a7f3d0');
  px(bCtx, plateCx - 48, plateCy - 26, 96, 52, '#e8f1eb');
  px(bCtx, plateCx - 42, plateCy - 32, 84, 64, '#e8f1eb');

  // 2. Sayur / Kuah Ceramic Bowl (Upper Right-Center)
  const bowlCx = Math.round(width * 0.67);
  const bowlCy = Math.round(height * 0.34);
  px(bCtx, bowlCx - 32, bowlCy - 20, 64, 42, '#4a2915');
  px(bCtx, bowlCx - 26, bowlCy - 26, 52, 54, '#4a2915');
  px(bCtx, bowlCx - 30, bowlCy - 22, 60, 42, '#fef3c7');
  px(bCtx, bowlCx - 24, bowlCy - 28, 48, 54, '#fef3c7');
  px(bCtx, bowlCx - 24, bowlCy - 18, 48, 34, '#d97706');
  px(bCtx, bowlCx - 20, bowlCy - 22, 40, 42, '#d97706');
  px(bCtx, bowlCx - 20, bowlCy - 16, 40, 30, '#fef9e7');

  // 3. Wooden Drink Coaster (Lower Right)
  const cupCx = Math.round(width * 0.81);
  const cupCy = Math.round(height * 0.68);
  px(bCtx, cupCx - 28, cupCy - 16, 56, 36, '#4a2915');
  px(bCtx, cupCx - 26, cupCy - 18, 52, 34, '#9a643b');
  px(bCtx, cupCx - 22, cupCy - 14, 44, 26, '#c89265');
  px(bCtx, cupCx - 18, cupCy - 10, 36, 18, '#b07b4f');

  platingBaseCache.set(key, offscreen);
  return offscreen;
}

export function drawPlatingTable(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  platedItems: MenuItemId[],
  timeSec: number,
  servingOptions: ServingOptions = DEFAULT_SERVING_OPTIONS
) {
  ctx.imageSmoothingEnabled = false;

  const base = getOrCreatePlatingBase(width, height);
  if (base) {
    ctx.drawImage(base, 0, 0);
  }

  const plateCx = Math.round(width * 0.34);
  const plateCy = Math.round(height * 0.52);
  const bowlCx = Math.round(width * 0.67);
  const bowlCy = Math.round(height * 0.34);
  const cupCx = Math.round(width * 0.81);
  const cupCy = Math.round(height * 0.68);

  const siramKeNasi = servingOptions.soupStyle === 'siram';

  const plateItems = platedItems.filter(
    (id) => MENU_BY_ID[id]?.platingZone === 'plate'
  );
  const bowlItems = platedItems.filter(
    (id) => MENU_BY_ID[id]?.platingZone === 'bowl'
  );
  const cupItems = platedItems.filter(
    (id) => MENU_BY_ID[id]?.platingZone === 'cup'
  );

  // Organize plate items cleanly by culinary layer: Karbo -> Lauk Utama -> Lauk Pendamping -> Sayur/Sambal
  const categoryRank: Record<string, number> = {
    karbo: 0,
    lauk_utama: 1,
    lauk_pendamping: 2,
    sayur_sambal: 3,
  };
  const sortedPlate = [...plateItems].sort((a, b) => {
    const rankA = categoryRank[MENU_BY_ID[a]?.category ?? 'sayur_sambal'] ?? 4;
    const rankB = categoryRank[MENU_BY_ID[b]?.category ?? 'sayur_sambal'] ?? 4;
    return rankA - rankB;
  });

  // Well-spaced slots: Rice at center-left, main dishes top-right/bottom-right, sides & sambal neatly along rim
  const plateOffsets: Array<[number, number]> = [
    [-46, -20], // 1. Karbo (or first dish)
    [4, -24],   // 2. Lauk Utama
    [4, 6],     // 3. Secondary Lauk / Side
    [-40, 8],   // 4. Lauk Pendamping / Gorengan
    [20, -10],  // 5. Sambal / Garnish
    [-16, -28], // 6. Tumis / Sayur
    [-18, 12],  // 7. Extra Side
    [-20, -8],  // 8. Center fallback
  ];

  // Draw rice first, then if siramKeNasi draw warm broth puddle over rice before placing lauk/sambal
  const riceItems = sortedPlate.filter(
    (id) => MENU_BY_ID[id]?.category === 'karbo'
  );
  const nonRicePlate = sortedPlate.filter(
    (id) => MENU_BY_ID[id]?.category !== 'karbo'
  );

  const itemScale = sortedPlate.length >= 5 ? 2.5 : 3;

  riceItems.forEach((id, idx) => {
    const [dx, dy] = plateOffsets[idx % plateOffsets.length];
    drawFoodSprite(ctx, id, plateCx + dx, plateCy + dy, itemScale, servingOptions);
  });

  if (siramKeNasi && bowlItems.length > 0) {
    let puddleColor = 'rgba(74, 222, 128, 0.42)';
    if (bowlItems.includes('kuah_gulai')) {
      puddleColor = 'rgba(245, 158, 11, 0.62)';
    } else if (bowlItems.includes('sayur_lodeh')) {
      puddleColor = 'rgba(254, 240, 138, 0.72)';
    } else if (bowlItems.includes('sayur_asem')) {
      puddleColor = 'rgba(251, 146, 60, 0.58)';
    } else if (bowlItems.includes('sayur_sop')) {
      puddleColor = 'rgba(253, 224, 71, 0.58)';
    }
    px(ctx, plateCx - 44, plateCy - 14, 52, 30, puddleColor);
    px(ctx, plateCx - 38, plateCy - 20, 38, 38, puddleColor);
  }

  nonRicePlate.forEach((id, idx) => {
    const slotIdx = riceItems.length + idx;
    const [dx, dy] = plateOffsets[slotIdx % plateOffsets.length];
    drawFoodSprite(ctx, id, plateCx + dx, plateCy + dy, itemScale, servingOptions);
  });

  bowlItems.forEach((id, idx) => {
    if (siramKeNasi) {
      drawFoodSprite(
        ctx,
        id,
        plateCx - 38 + idx * 8,
        plateCy - 18,
        2.5,
        servingOptions
      );
    } else {
      drawFoodSprite(
        ctx,
        id,
        bowlCx - 24 + idx * 6,
        bowlCy - 24,
        3,
        servingOptions
      );
    }
  });

  cupItems.forEach((id, idx) => {
    drawFoodSprite(
      ctx,
      id,
      cupCx - 24 + idx * 8,
      cupCy - 32,
      3,
      servingOptions
    );
  });

  // Gentle warm steam wisps over hot items
  if (platedItems.length > 0) {
    const floatY = Math.round((timeSec * 12) % 12);
    ctx.fillStyle = 'rgba(255, 252, 240, 0.55)';
    ctx.fillRect(plateCx - 22, plateCy - 26 - floatY, 4, 4);
    ctx.fillRect(plateCx + 10, plateCy - 30 - ((floatY + 6) % 12), 4, 4);
    if (bowlItems.length > 0 && !siramKeNasi) {
      ctx.fillRect(bowlCx - 4, bowlCy - 24 - floatY, 4, 4);
    }
  }
}

function getRebusBrothColor(itemId: MenuItemId | null): {
  main: string;
  highlight: string;
} {
  switch (itemId) {
    case 'rendang':
      return { main: '#5c280b', highlight: '#92400e' };
    case 'sayur_asem':
      return { main: '#c2410c', highlight: '#fb923c' };
    case 'sayur_lodeh':
      return { main: '#fde68a', highlight: '#fef9c3' };
    case 'ikan_pesmol':
    case 'kuah_gulai':
      return { main: '#d97706', highlight: '#facc15' };
    case 'telur_balado':
      return { main: '#b91c1c', highlight: '#ef4444' };
    case 'wedang_jahe':
      return { main: '#92400e', highlight: '#f59e0b' };
    case 'sayur_sop':
    default:
      return { main: '#eab308', highlight: '#fef3c7' };
  }
}

export function drawCookingStationScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  slot: KitchenSlotState,
  timeSec: number,
  nowMs = Date.now()
) {
  ctx.imageSmoothingEnabled = false;
  const cx = Math.round(width / 2);
  const isCooking = slot.itemId !== null;
  const status: CookingStatus = isCooking ? getCookingStatus(slot) : 'mentah';
  const approachingBurn = isApproachingBurn(slot);

  // Retro warm kitchen tile backsplash + wooden counter edge
  px(ctx, 0, 0, width, height, '#473021');
  for (let y = 0; y < height - 26; y += 16) {
    for (let x = 0; x < width; x += 24) {
      const alt = ((x / 24 + y / 16) % 2) === 0;
      px(ctx, x, y, 22, 14, alt ? '#5b3d29' : '#523624');
    }
  }
  px(ctx, 0, height - 26, width, 26, '#784b2a');
  px(ctx, 0, height - 26, width, 3, '#a36b41');
  px(ctx, 0, height - 23, width, 2, '#2c1a10');

  // Approaching burn soft blinking amber aura
  if (approachingBurn && Math.floor(timeSec * 6) % 2 === 0) {
    px(ctx, 4, 4, width - 8, 3, '#fbbf24');
    px(ctx, 4, height - 29, width - 8, 3, '#fbbf24');
  }

  // Helper to draw stove burner & animated flame for goreng/rebus/tumis
  const drawStoveBurner = (highFlame: boolean) => {
    const sy = height - 28;
    px(ctx, cx - 54, sy - 6, 108, 12, '#1e293b');
    px(ctx, cx - 48, sy - 9, 96, 4, '#334155');
    if (isCooking && status !== 'gosong') {
      const flicker = Math.floor(timeSec * 12) % 2;
      const fh = highFlame ? 7 + flicker * 2 : 5 + flicker;
      for (let fx = -34; fx <= 28; fx += 12) {
        px(ctx, cx + fx, sy - 9 - fh, 6, fh, '#38bdf8');
        px(ctx, cx + fx + 1, sy - 8 - Math.max(2, fh - 2), 4, Math.max(2, fh - 2), '#fde047');
      }
    }
  };

  // Helper to draw golden sparkles (Matang) or dark charcoal smoke (Gosong)
  const drawPhaseParticles = (topY: number) => {
    if (!isCooking) return;
    if (status === 'matang') {
      const sp = Math.floor(timeSec * 4) % 4;
      const sx1 = cx - 34 + sp * 6;
      const sx2 = cx + 26 - sp * 4;
      const sy1 = topY - ((Math.round(timeSec * 14) % 12) + 4);
      const sy2 = topY - (((Math.round(timeSec * 14) + 6) % 12) + 6);
      px(ctx, sx1, sy1, 4, 4, '#fde047');
      px(ctx, sx1 + 1, sy1 - 2, 2, 8, '#fef08a');
      px(ctx, sx1 - 2, sy1 + 1, 8, 2, '#fef08a');
      px(ctx, sx2, sy2, 4, 4, '#fde047');
    } else if (status === 'gosong') {
      for (let i = 0; i < 5; i++) {
        const lift = (Math.round(timeSec * 22) + i * 9) % 34;
        const drift = Math.round(Math.sin(timeSec * 3 + i) * 8);
        const sx = cx - 22 + i * 11 + drift;
        const sy = topY - lift;
        px(ctx, sx, sy, 8, 7, i % 2 === 0 ? '#1c1917' : '#44403c');
      }
    }
  };

  if (slot.station === 'goreng') {
    drawStoveBurner(false);
    // Deep cast-iron wajan
    const wy = height - 48;
    px(ctx, cx - 58, wy - 2, 16, 5, '#475569'); // handle L
    px(ctx, cx + 42, wy - 2, 16, 5, '#475569'); // handle R
    px(ctx, cx - 44, wy, 88, 16, '#0f172a');
    px(ctx, cx - 38, wy + 12, 76, 8, '#1e293b');
    // Shimmering hot oil surface
    px(ctx, cx - 38, wy + 2, 76, 10, '#d97706');
    px(ctx, cx - 34, wy + 3, 68, 5, '#fbbf24');

    if (slot.itemId) {
      // Oil sizzle bubbles
      if (status !== 'gosong') {
        for (let i = 0; i < 5; i++) {
          const bx = cx - 30 + ((i * 15 + Math.floor(timeSec * 14)) % 60);
          const by = wy + 3 - ((Math.floor(timeSec * 18) + i * 5) % 8);
          px(ctx, bx, by, 3, 3, '#fef08a');
        }
      }
      drawFoodSprite(
        ctx,
        slot.itemId,
        cx - 24,
        wy - 22,
        3,
        DEFAULT_SERVING_OPTIONS,
        status
      );
      drawPhaseParticles(wy - 20);
    }
  } else if (slot.station === 'rebus') {
    drawStoveBurner(false);
    // Deep stew pot
    const py = height - 64;
    px(ctx, cx - 48, py + 8, 10, 8, '#64748b');
    px(ctx, cx + 38, py + 8, 10, 8, '#64748b');
    px(ctx, cx - 38, py + 4, 76, 30, '#94a3b8');
    px(ctx, cx - 34, py + 6, 68, 25, '#cbd5e1');
    px(ctx, cx - 40, py, 80, 6, '#e2e8f0');

    const broth = getRebusBrothColor(slot.itemId);
    px(ctx, cx - 32, py + 4, 64, 12, broth.main);
    px(ctx, cx - 28, py + 6, 56, 6, broth.highlight);

    if (slot.itemId) {
      drawFoodSprite(
        ctx,
        slot.itemId,
        cx - 21,
        py - 12,
        2.7,
        DEFAULT_SERVING_OPTIONS,
        status
      );
      // Boiling bubbles + steam
      if (status !== 'gosong') {
        for (let i = 0; i < 4; i++) {
          const bx = cx - 24 + i * 15;
          const pop = (Math.floor(timeSec * 10) + i * 3) % 10;
          px(ctx, bx, py + 4 - pop, 4, 4, '#fef9c3');
          const steamY = py - 14 - ((Math.floor(timeSec * 16) + i * 7) % 18);
          px(ctx, bx + 2, steamY, 3, 5, 'rgba(255,255,255,0.65)');
        }
      }
      drawPhaseParticles(py - 16);
    }
  } else if (slot.station === 'tumis') {
    drawStoveBurner(true);
    // Wide stir-fry wok with long wooden handle
    const ty = height - 46;
    px(ctx, cx + 44, ty - 6, 32, 6, '#78350f');
    px(ctx, cx - 48, ty, 94, 14, '#1e293b');
    px(ctx, cx - 40, ty + 10, 78, 8, '#0f172a');
    px(ctx, cx - 40, ty + 2, 78, 6, '#7c2d12');

    const recentlyStirred = nowMs - slot.lastActionAt < 500;
    const tossOffsetY = recentlyStirred ? -Math.abs(Math.round(Math.sin(timeSec * 28) * 10)) : 0;

    if (slot.itemId) {
      drawFoodSprite(
        ctx,
        slot.itemId,
        cx - 24,
        ty - 22 + tossOffsetY,
        3,
        DEFAULT_SERVING_OPTIONS,
        status
      );
      // Animated spatula tossing inside wok
      const spX = recentlyStirred
        ? cx - 6 + Math.round(Math.sin(timeSec * 26) * 18)
        : cx + 16;
      const spY = recentlyStirred ? ty - 28 : ty - 22;
      px(ctx, spX, spY, 4, 24, '#cbd5e1');
      px(ctx, spX - 4, spY + 20, 12, 6, '#94a3b8');
      px(ctx, spX, spY - 10, 4, 10, '#92400e');

      if (recentlyStirred) {
        px(ctx, cx - 28, ty - 16, 4, 4, '#fde047');
        px(ctx, cx + 24, ty - 18, 4, 4, '#fb923c');
      }
      drawPhaseParticles(ty - 24);
    } else {
      // Resting spatula
      px(ctx, cx + 18, ty - 20, 4, 20, '#94a3b8');
      px(ctx, cx + 18, ty - 28, 4, 8, '#92400e');
    }
  } else {
    // Cobek & Ulekan Batu (stone mortar & pestle)
    const cy = height - 42;
    // Bamboo woven mat under cobek
    px(ctx, cx - 54, cy + 8, 108, 10, '#b45309');
    px(ctx, cx - 50, cy + 10, 100, 6, '#d97706');

    // Stone cobek body (speckled basalt)
    px(ctx, cx - 46, cy - 8, 92, 22, '#334155');
    px(ctx, cx - 40, cy + 10, 80, 8, '#1e293b');
    px(ctx, cx - 42, cy - 10, 84, 10, '#64748b');
    px(ctx, cx - 34, cy - 8, 68, 10, '#475569');
    px(ctx, cx - 30, cy - 6, 4, 3, '#94a3b8');
    px(ctx, cx + 22, cy - 4, 4, 3, '#94a3b8');

    const isIjo = slot.itemId === 'sambal_ijo';
    const isMatah = slot.itemId === 'sambal_matah';
    const recentlyPounded = nowMs - slot.lastActionAt < 380;

    if (slot.itemId) {
      if (slot.grindCount < 5) {
        // Chunky raw whole chilies, shallots & garlic before smooth grinding
        const chiliColor = isIjo ? '#4d7c0f' : '#dc2626';
        const chiliBright = isIjo ? '#84cc16' : '#ef4444';
        px(ctx, cx - 22, cy - 10, 14, 5, chiliColor);
        px(ctx, cx - 18, cy - 11, 8, 3, chiliBright);
        px(ctx, cx + 6, cy - 9, 14, 5, chiliColor);
        px(ctx, cx - 4, cy - 12, 8, 7, isMatah ? '#c026d3' : '#e879f9'); // bawang merah
        px(ctx, cx - 12, cy - 6, 7, 5, '#fef3c7'); // bawang putih
        px(ctx, cx + 10, cy - 4, 6, 5, '#78350f'); // terasi
      } else {
        // Smooth blended glistening sambal paste
        const pasteDark = isIjo ? '#14532d' : isMatah ? '#b91c1c' : '#7f1d1d';
        const pasteMain = isIjo ? '#4d7c0f' : isMatah ? '#fbbf24' : '#dc2626';
        const pasteTop = isIjo ? '#84cc16' : isMatah ? '#e879f9' : '#ef4444';
        px(ctx, cx - 26, cy - 9, 52, 9, pasteDark);
        px(ctx, cx - 22, cy - 11, 44, 7, pasteMain);
        px(ctx, cx - 14, cy - 12, 28, 4, pasteTop);
        drawPhaseParticles(cy - 18);
      }

      // Animated stone pestle (ulekan) pounding on click
      const uOffsetY = recentlyPounded ? 8 : 0;
      const uOffsetX = recentlyPounded ? -4 : 0;
      px(ctx, cx + 4 + uOffsetX, cy - 32 + uOffsetY, 10, 22, '#64748b');
      px(ctx, cx + 10 + uOffsetX, cy - 34 + uOffsetY, 14, 10, '#94a3b8');
      px(ctx, cx + 2 + uOffsetX, cy - 14 + uOffsetY, 12, 8, '#475569');

      if (recentlyPounded) {
        const splashColor = isIjo ? '#84cc16' : '#ef4444';
        px(ctx, cx - 24, cy - 22, 4, 4, splashColor);
        px(ctx, cx + 22, cy - 24, 4, 4, splashColor);
      }
    } else {
      // Resting ulekan beside empty cobek
      px(ctx, cx + 12, cy - 24, 10, 18, '#64748b');
      px(ctx, cx + 18, cy - 26, 14, 8, '#94a3b8');
    }
  }
}
