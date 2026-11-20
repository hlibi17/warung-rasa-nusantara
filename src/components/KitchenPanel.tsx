import { memo, useEffect, useRef } from 'react';
import {
  Flame,
  Hammer,
  RotateCcw,
  Sparkles,
  Trash2,
  Utensils,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { COOKING_STATIONS, MENU_BY_ID, MENU_ITEMS } from '../game/data';
import { drawCookingStationScene } from '../game/pixelArt';
import {
  COBEK_MATANG_GRINDS,
  COBEK_MAX_GRINDS,
  getCookingStatus,
  getSlotDisplayPercent,
  isApproachingBurn,
} from '../game/rules';
import {
  CookingStationId,
  GameMode,
  KitchenSlotState,
  MenuItemId,
  RawTrayItem,
} from '../game/types';
import { PixelSprite } from './PixelSprite';

interface KitchenStationCanvasProps {
  slot: KitchenSlotState;
}

function KitchenStationCanvas({ slot }: KitchenStationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slotRef = useRef<KitchenSlotState>(slot);
  slotRef.current = slot;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const timeSec = (now - start) / 1000;
      drawCookingStationScene(
        ctx,
        canvas.width,
        canvas.height,
        slotRef.current,
        timeSec,
        Date.now()
      );
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={112}
      data-testid={`kitchen-canvas-${slot.station}`}
      aria-label={`Animasi stasiun ${slot.station}`}
      className="w-full h-28 object-cover bg-[#3a2518] border-2 border-[#1f140e]"
    />
  );
}

interface KitchenPanelProps {
  mode: GameMode;
  unlockedRecipes: MenuItemId[];
  itemStock: Record<MenuItemId, number>;
  kitchenSlots: Record<CookingStationId, KitchenSlotState>;
  rawTray: RawTrayItem[];
  kitchenNotice: string | null;
  onStartCook: (station: CookingStationId, itemId: MenuItemId) => void;
  onStirTumis: () => void;
  onPoundCobek: () => void;
  onLiftFromSlot: (station: CookingStationId) => void;
  onDiscardBurnt: (station: CookingStationId) => void;
  onReCookRawTray: (rawId: string) => void;
  onDiscardRawTray: (rawId: string) => void;
  onBackToEtalase: () => void;
}

export const KitchenPanel = memo(function KitchenPanel({
  mode,
  unlockedRecipes,
  itemStock,
  kitchenSlots,
  rawTray,
  kitchenNotice,
  onStartCook,
  onStirTumis,
  onPoundCobek,
  onLiftFromSlot,
  onDiscardBurnt,
  onReCookRawTray,
  onDiscardRawTray,
  onBackToEtalase,
}: KitchenPanelProps) {
  const unlockedSet = new Set(unlockedRecipes);

  return (
    <section
      aria-label="Dapur Masak Warung"
      data-testid="kitchen-panel"
      className="pixel-panel p-3 md:p-4 space-y-3"
    >
      {/* Top Dapur Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#e6d3a7]">
        <div>
          <h2 className="font-pixel-title text-xs md:text-sm text-[#2c1a10] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#d97706]" />
            <span>DAPUR MASAK WARUNG (+4 PORSI / MASAKAN)</span>
          </h2>
          <p className="text-lg text-[#5e3822]">
            Masak lauk, sayur, dan sambal hingga Matang Sempurna (50%–85%), lalu
            angkat ke etalase!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            data-testid="kitchen-trash-zone"
            className="bg-[#f5e6c4] border-2 border-[#2c1a10] px-2.5 py-1 text-base text-[#5e3822] flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4 text-[#c93b2b]" />
            <span>Tempat Sampah Siap</span>
          </div>

          <button
            type="button"
            onClick={onBackToEtalase}
            data-testid="back-to-etalase-btn"
            className="pixel-btn bg-[#2d6a4f] text-[#fdf6e3] px-3.5 py-1.5 text-lg font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Etalase</span>
          </button>
        </div>
      </div>

      {/* Feedback Notice */}
      {kitchenNotice && (
        <div
          role="status"
          data-testid="kitchen-notice"
          className="bg-[#fef3c7] border-2 border-[#2c1a10] px-3 py-1.5 text-lg font-bold text-[#78350f] flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#b45309] shrink-0" />
          <span>{kitchenNotice}</span>
        </div>
      )}

      {/* Baki Mentah (when items were lifted early) */}
      {rawTray.length > 0 && (
        <div
          data-testid="raw-tray-bar"
          className="bg-[#f5e6c4] border-2 border-[#2c1a10] p-2.5 space-y-1.5"
        >
          <div className="text-lg font-bold text-[#9a5b13] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Baki Mentah (Belum Bisa Disajikan — Masak Ulang):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rawTray.map((raw) => {
              const item = MENU_BY_ID[raw.itemId];
              const stationBusy = kitchenSlots[raw.station].itemId !== null;
              return (
                <div
                  key={raw.id}
                  data-testid={`raw-tray-item-${raw.itemId}`}
                  className="bg-[#fdf6e3] border-2 border-[#2c1a10] px-2.5 py-1 flex items-center gap-2"
                >
                  <PixelSprite
                    itemId={raw.itemId}
                    size={28}
                    cookingPhase="mentah"
                  />
                  <span className="text-lg font-bold text-[#2c1a10]">
                    {item.name} ({Math.round(raw.progress)}%)
                  </span>
                  <button
                    type="button"
                    disabled={stationBusy}
                    onClick={() => onReCookRawTray(raw.id)}
                    data-testid={`btn-recook-${raw.itemId}`}
                    className="pixel-btn bg-[#f5b942] text-[#1f140e] px-2 py-0.5 text-base font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Masak Ulang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDiscardRawTray(raw.id)}
                    aria-label={`Buang ${item.name} mentah`}
                    className="pixel-btn bg-[#e6d3a7] text-[#c93b2b] px-2 py-0.5 text-base font-bold"
                  >
                    Buang
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2x2 Grid of 4 Interactive Cooking Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {COOKING_STATIONS.map((stationDef) => {
          const slot = kitchenSlots[stationDef.id];
          const activeItem = slot.itemId ? MENU_BY_ID[slot.itemId] : null;
          const status = activeItem ? getCookingStatus(slot) : null;
          const nearBurn = isApproachingBurn(slot);
          const pct = getSlotDisplayPercent(slot);

          const stationItems = MENU_ITEMS.filter(
            (m) =>
              m.cookingStation === stationDef.id &&
              (mode === 'endless' || unlockedSet.has(m.id))
          );

          const statusBadge = !activeItem
            ? {
                label: 'Kosong',
                cls: 'bg-[#e6d3a7] text-[#3b2316] border-[#1f140e]',
              }
            : status === 'gosong'
            ? {
                label: 'Gosong!',
                cls: 'bg-[#7f1d1d] text-[#fee2e2] border-[#1f140e]',
              }
            : nearBurn
            ? {
                label: 'Hampir Gosong!',
                cls: 'bg-[#fbbf24] text-[#1f140e] border-[#78350f] animate-pulse',
              }
            : status === 'matang'
            ? {
                label: 'Matang Sempurna!',
                cls: 'bg-[#166534] text-[#f0fdf4] border-[#052e16]',
              }
            : {
                label:
                  stationDef.id === 'cobek' ? 'Kasar (Mentah)' : 'Masih Mentah',
                cls: 'bg-[#fef3c7] text-[#92400e] border-[#78350f]',
              };

          return (
            <div
              key={stationDef.id}
              data-testid={`kitchen-station-${stationDef.id}`}
              className="pixel-wood-panel p-3 space-y-2.5 text-[#fdf6e3]"
            >
              {/* Station Header + Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-pixel-title text-[11px] md:text-xs text-[#f5b942]">
                    {stationDef.title}
                  </h3>
                  <p className="text-base text-amber-100/85 leading-tight mt-0.5">
                    {stationDef.actionHint}
                  </p>
                </div>
                <span
                  data-testid={`station-status-${stationDef.id}`}
                  className={`px-2.5 py-0.5 border-2 text-base font-bold whitespace-nowrap shrink-0 ${statusBadge.cls}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Procedural Pixel Art Canvas */}
              <KitchenStationCanvas slot={slot} />

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-base tabular-nums text-amber-100">
                  <span>
                    {activeItem
                      ? `${activeItem.name}`
                      : 'Pilih bahan masakan di bawah'}
                  </span>
                  <span>
                    {activeItem
                      ? stationDef.id === 'cobek'
                        ? `${slot.grindCount}/${COBEK_MAX_GRINDS} Ulekan`
                        : `${pct}%`
                      : '0%'}
                  </span>
                </div>

                {stationDef.id === 'cobek' ? (
                  <div className="grid grid-cols-6 gap-1 h-3.5 bg-[#1f140e] p-0.5 border border-[#140b06]">
                    {Array.from({ length: COBEK_MAX_GRINDS }).map((_, i) => {
                      const filled = i < slot.grindCount;
                      const isMatangZone = i + 1 >= COBEK_MATANG_GRINDS;
                      return (
                        <div
                          key={i}
                          className={
                            filled
                              ? isMatangZone
                                ? 'bg-[#52b788]'
                                : 'bg-[#f5b942]'
                              : 'bg-[#3b2316]'
                          }
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative h-3.5 w-full bg-[#1f140e] border border-[#140b06] overflow-hidden">
                    {/* Matang zone guide 50%-85% */}
                    <div
                      className="absolute top-0 bottom-0 bg-[#2d6a4f]/40 border-x border-[#52b788]/60"
                      style={{ left: '50%', width: '35%' }}
                    />
                    <div
                      className={`h-full transition-all duration-150 ${
                        status === 'gosong'
                          ? 'bg-[#dc2626]'
                          : status === 'matang'
                          ? 'bg-[#52b788]'
                          : 'bg-[#f5b942]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Active Controls or Ingredient Picker */}
              {!activeItem ? (
                <div className="bg-[#fdf6e3] text-[#1f140e] border-2 border-[#1f140e] p-2">
                  <div className="text-base font-bold text-[#5e3822] mb-1">
                    Masukkan Bahan ke {stationDef.shortLabel}:
                  </div>
                  <div className="max-h-24 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 pr-0.5">
                    {stationItems.map((item) => {
                      const stock = itemStock[item.id] ?? 0;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onStartCook(stationDef.id, item.id)}
                          data-testid={`cook-item-${item.id}`}
                          className="pixel-btn bg-[#f5e6c4] text-[#1f140e] px-2 py-1 text-left flex items-center gap-1.5"
                        >
                          <PixelSprite itemId={item.id} size={22} />
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-bold leading-none truncate">
                              {item.name}
                            </div>
                            <div
                              className={`text-sm font-bold tabular-nums ${
                                stock === 0
                                  ? 'text-[#c93b2b]'
                                  : 'text-[#2d6a4f]'
                              }`}
                            >
                              Stok: x{stock}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-[#fdf6e3] text-[#1f140e] border-2 border-[#1f140e] p-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <PixelSprite
                      itemId={activeItem.id}
                      size={36}
                      cookingPhase={status ?? 'mentah'}
                    />
                    <div className="min-w-0">
                      <div className="text-lg font-bold leading-tight truncate">
                        {activeItem.name}
                      </div>
                      <div className="text-sm text-[#5e3822]">
                        {status === 'gosong'
                          ? 'Terlalu lama dimasak — buang ke tempat sampah.'
                          : status === 'matang'
                          ? 'Siap diangkat! +4 porsi ke Etalase.'
                          : stationDef.id === 'cobek'
                          ? 'Masih kasar, lanjutkan ulek!'
                          : 'Sedang dimasak, tunggu warna keemasan...'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {stationDef.id === 'tumis' && status !== 'gosong' && (
                      <button
                        type="button"
                        onClick={onStirTumis}
                        data-testid="btn-stir-tumis"
                        className="pixel-btn bg-[#f5b942] text-[#1f140e] px-3 py-1 text-base font-bold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Utensils className="w-4 h-4" />
                        <span>Aduk Spatula</span>
                      </button>
                    )}

                    {stationDef.id === 'cobek' && (
                      <button
                        type="button"
                        onClick={onPoundCobek}
                        disabled={slot.grindCount >= COBEK_MAX_GRINDS}
                        data-testid="btn-pound-cobek"
                        className="pixel-btn bg-[#f5b942] text-[#1f140e] px-3 py-1 text-base font-bold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Hammer className="w-4 h-4" />
                        <span>
                          Ulek! ({slot.grindCount}/{COBEK_MAX_GRINDS})
                        </span>
                      </button>
                    )}

                    {status === 'gosong' ? (
                      <button
                        type="button"
                        onClick={() => onDiscardBurnt(stationDef.id)}
                        data-testid={`btn-discard-${stationDef.id}`}
                        className="pixel-btn bg-[#c93b2b] text-[#fdf6e3] px-3 py-1 text-base font-bold flex items-center gap-1 whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Buang ke Tempat Sampah</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onLiftFromSlot(stationDef.id)}
                        data-testid={`btn-lift-${stationDef.id}`}
                        className={`pixel-btn px-3 py-1 text-base font-bold whitespace-nowrap ${
                          status === 'matang'
                            ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                            : 'bg-[#e6d3a7] text-[#5e3822]'
                        }`}
                      >
                        Angkat (+4 Porsi)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});
