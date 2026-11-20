import { memo, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  LogOut,
  Sun,
  Sunset,
  CloudRain,
  BookOpen,
  Heart,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';
import { COOKING_STATIONS } from '../game/data';
import { CustomerMood, drawWarungScene } from '../game/pixelArt';
import {
  formatRupiah,
  getCookingStatus,
  getSlotDisplayPercent,
  isApproachingBurn,
  WEATHER_INFO,
} from '../game/rules';
import {
  CookingStationId,
  CustomerOrder,
  GameMode,
  KitchenSlotState,
  UpgradeId,
  VipCustomerId,
  WeatherType,
} from '../game/types';

interface GameCounterProps {
  warungName: string;
  mode: GameMode;
  day: number;
  weather: WeatherType;
  customerNumber: number;
  customerQuota: number;
  endlessServed: number;
  balance: number;
  order: CustomerOrder;
  vipHearts: Record<VipCustomerId, number>;
  mood: CustomerMood;
  reactionDialogue: string | null;
  upgrades: UpgradeId[];
  muted: boolean;
  activeWorkspace: 'etalase' | 'dapur';
  kitchenSlots: Record<CookingStationId, KitchenSlotState>;
  endlessAutoStock: boolean;
  onChangeWorkspace: (ws: 'etalase' | 'dapur') => void;
  onToggleEndlessAutoStock: () => void;
  onOpenNotebook: () => void;
  onToggleMute: () => void;
  onExitToMenu: () => void;
}

interface MiniStoveBarProps {
  mode: GameMode;
  activeWorkspace: 'etalase' | 'dapur';
  kitchenSlots: Record<CookingStationId, KitchenSlotState>;
  endlessAutoStock: boolean;
  onChangeWorkspace: (ws: 'etalase' | 'dapur') => void;
  onToggleEndlessAutoStock: () => void;
}

const MiniStoveBar = memo(function MiniStoveBar({
  mode,
  activeWorkspace,
  kitchenSlots,
  endlessAutoStock,
  onChangeWorkspace,
  onToggleEndlessAutoStock,
}: MiniStoveBarProps) {
  let readyCount = 0;
  let alertCount = 0;
  for (const st of COOKING_STATIONS) {
    const s = kitchenSlots[st.id];
    if (!s.itemId) continue;
    const status = getCookingStatus(s);
    if (status === 'gosong' || isApproachingBurn(s)) {
      alertCount += 1;
    } else if (status === 'matang') {
      readyCount += 1;
    }
  }
  const totalBadge = readyCount + alertCount;

  return (
    <div className="pt-1.5 border-t-2 border-[#2c1a10] flex flex-wrap items-center justify-between gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChangeWorkspace('etalase')}
          data-testid="tab-workspace-etalase"
          aria-pressed={activeWorkspace === 'etalase'}
          className={`pixel-btn px-2.5 py-0.5 text-base font-bold flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkspace === 'etalase'
              ? 'bg-[#2d6a4f] text-[#fdf6e3]'
              : 'bg-[#f5e6c4] text-[#1f140e]'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Etalase &amp; Racik</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeWorkspace('dapur')}
          data-testid="tab-workspace-dapur"
          aria-pressed={activeWorkspace === 'dapur'}
          className={`pixel-btn px-2.5 py-0.5 text-base font-bold flex items-center gap-1.5 whitespace-nowrap ${
            activeWorkspace === 'dapur'
              ? 'bg-[#d97706] text-[#fdf6e3]'
              : 'bg-[#f5e6c4] text-[#1f140e]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Dapur Masak</span>
          {totalBadge > 0 && (
            <span
              className={`px-1.5 text-sm font-bold border border-[#1f140e] ${
                alertCount > 0
                  ? 'bg-[#ef4444] text-[#fdf6e3] animate-pulse'
                  : 'bg-[#86efac] text-[#14532d]'
              }`}
            >
              {alertCount > 0 ? 'Cek Kompor!' : `${readyCount} Matang`}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {COOKING_STATIONS.map((st) => {
          const slot = kitchenSlots[st.id];
          const isCooking = slot.itemId !== null;
          const status = isCooking ? getCookingStatus(slot) : null;
          const nearBurn = isApproachingBurn(slot);
          const pct = getSlotDisplayPercent(slot);

          let dotClass = 'bg-[#784b2a]';
          let statusText = 'Kosong';
          if (isCooking) {
            if (status === 'gosong') {
              dotClass = 'bg-[#ef4444] animate-pulse';
              statusText = 'Gosong!';
            } else if (nearBurn) {
              dotClass = 'bg-[#fbbf24] animate-pulse';
              statusText = 'Awas!';
            } else if (status === 'matang') {
              dotClass = 'bg-[#4ade80]';
              statusText = 'Matang!';
            } else {
              dotClass = 'bg-[#f59e0b]';
              statusText =
                st.id === 'cobek' ? `${slot.grindCount}/6` : `${pct}%`;
            }
          }

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onChangeWorkspace('dapur')}
              data-testid={`mini-stove-${st.id}`}
              title={`Pantau ${st.title}`}
              className="bg-[#331e11] hover:bg-[#59331d] border-2 border-[#140b06] px-2 py-0.5 text-base flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span
                className={`w-2.5 h-2.5 inline-block border border-[#140b06] ${dotClass}`}
                aria-hidden="true"
              />
              <span className="text-amber-100">{st.shortLabel}:</span>
              <span
                className={`font-bold tabular-nums ${
                  status === 'gosong'
                    ? 'text-[#fca5a5]'
                    : nearBurn
                    ? 'text-[#fde047]'
                    : status === 'matang'
                    ? 'text-[#86efac]'
                    : 'text-amber-200/80'
                }`}
              >
                {statusText}
              </span>
            </button>
          );
        })}

        {mode === 'endless' && (
          <button
            type="button"
            onClick={onToggleEndlessAutoStock}
            data-testid="toggle-endless-stock"
            className={`pixel-btn px-2.5 py-0.5 text-base font-bold whitespace-nowrap ml-1 ${
              endlessAutoStock
                ? 'bg-[#e6d3a7] text-[#1f140e]'
                : 'bg-[#f5b942] text-[#1f140e]'
            }`}
          >
            {endlessAutoStock ? 'Stok Otomatis' : 'Masak Manual'}
          </button>
        )}
      </div>
    </div>
  );
});

interface CustomerScenePanelProps {
  order: CustomerOrder;
  mood: CustomerMood;
  reactionDialogue: string | null;
  upgrades: UpgradeId[];
  weather: WeatherType;
  vipHearts: Record<VipCustomerId, number>;
}

const CustomerScenePanel = memo(function CustomerScenePanel({
  order,
  mood,
  reactionDialogue,
  upgrades,
  weather,
  vipHearts,
}: CustomerScenePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const timeSec = (now - start) / 1000;
      drawWarungScene(ctx, canvas.width, canvas.height, timeSec, {
        customerId: order.customer.id,
        mood,
        upgrades,
        weather,
      });
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [order.customer.id, mood, upgrades, weather]);

  const activeDialogue = reactionDialogue ?? order.dialogue;
  const weatherInfo = WEATHER_INFO[weather];
  const isVip = Boolean(order.customer.isVip);
  const currentHearts = isVip
    ? vipHearts[order.customer.id as VipCustomerId] ?? 1
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
      <div className="lg:col-span-5 pixel-wood-panel p-1.5 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={176}
          data-testid="warung-scene-canvas"
          aria-label={`Pelanggan ${order.customer.name} di konter warung saat ${weatherInfo.label}`}
          className="w-full h-36 lg:h-40 object-cover rounded-none bg-[#2c1a10]"
        />
      </div>

      <div className="lg:col-span-7 pixel-panel p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-pixel-title text-xs md:text-sm text-[#2c1a10]">
                {order.customer.name}
              </span>
              <span className="text-lg text-[#694127]">
                {order.customer.role}
              </span>
              {currentHearts !== null && (
                <span
                  data-testid="vip-heart-indicator"
                  className="inline-flex items-center gap-1 text-base font-bold text-[#c93b2b] tabular-nums"
                >
                  <Heart className="w-4 h-4 fill-[#c93b2b]" />
                  <span>{currentHearts}/5</span>
                </span>
              )}
            </div>
            <span className="text-base text-[#2d6a4f] font-bold">
              {reactionDialogue
                ? 'Tanggapan Pelanggan'
                : order.patternType === 'resep_rahasia'
                ? 'Pesanan Resep Rahasia'
                : order.patternType === 'teka_teki'
                ? 'Pesanan Teka-Teki Santai'
                : order.patternType === 'porsi_ekstra'
                ? 'Pesanan Porsi Ekstra'
                : order.patternType === 'cuaca'
                ? 'Pesanan Nuansa Cuaca'
                : 'Pesanan Langsung'}
            </span>
          </div>

          <p
            data-testid="customer-dialogue"
            className="text-xl lg:text-2xl leading-snug text-[#1f140e]"
          >
            “{activeDialogue}”
          </p>
        </div>

        <div className="mt-2 pt-1.5 border-t-2 border-[#e6d3a7] flex flex-wrap items-center justify-between gap-2 text-lg text-[#5e3822]">
          <span>{order.hintText}</span>
          <span className="tabular-nums font-bold text-[#2d6a4f]">
            {order.items.length} item diminta
          </span>
        </div>
      </div>
    </div>
  );
});

export function GameCounter({
  warungName,
  mode,
  day,
  weather,
  customerNumber,
  customerQuota,
  endlessServed,
  balance,
  order,
  vipHearts,
  mood,
  reactionDialogue,
  upgrades,
  muted,
  activeWorkspace,
  kitchenSlots,
  endlessAutoStock,
  onChangeWorkspace,
  onToggleEndlessAutoStock,
  onOpenNotebook,
  onToggleMute,
  onExitToMenu,
}: GameCounterProps) {
  const weatherInfo = WEATHER_INFO[weather];

  return (
    <section aria-label="Area Konter Pelanggan" className="w-full space-y-2">
      {/* Wooden Pixel-Art Signboard + HUD Bar */}
      <div className="pixel-wood-panel px-3 py-1.5 space-y-1.5 text-[#fdf6e3]">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-lg tabular-nums min-w-0">
            <div
              data-testid="warung-wooden-sign"
              className="bg-[#784b2a] border-2 border-[#1f140e] shadow-[inset_0_2px_0_#a36b41,0_2px_0_#140b06] px-2.5 py-0.5 flex items-center gap-1.5"
            >
              <span
                className="w-1.5 h-1.5 bg-[#f5b942] inline-block"
                aria-hidden="true"
              />
              <span className="font-pixel-title text-[10px] xl:text-xs text-[#fdf6e3] tracking-wide whitespace-nowrap">
                {warungName}
              </span>
              <span
                className="w-1.5 h-1.5 bg-[#f5b942] inline-block"
                aria-hidden="true"
              />
            </div>

            <span className="font-pixel-title text-[10px] xl:text-xs text-[#f5b942] whitespace-nowrap">
              {mode === 'harian' ? `HARI ${day}` : 'MODE ZEN'}
            </span>

            <span aria-hidden="true" className="text-amber-200/40">
              ·
            </span>

            <span
              data-testid="hud-weather"
              className="inline-flex items-center gap-1 text-amber-100 whitespace-nowrap"
            >
              {weather === 'pagi_cerah' ? (
                <Sun className="w-4 h-4 text-[#fde047]" />
              ) : weather === 'sore_senja' ? (
                <Sunset className="w-4 h-4 text-[#fb923c]" />
              ) : (
                <CloudRain className="w-4 h-4 text-[#93c5fd]" />
              )}
              <span>{weatherInfo.label}</span>
            </span>

            <span aria-hidden="true" className="text-amber-200/40">
              ·
            </span>

            <span className="whitespace-nowrap">
              {mode === 'harian'
                ? `Pelanggan ${customerNumber}/${customerQuota}`
                : `Dilayani: ${endlessServed}`}
            </span>

            <span aria-hidden="true" className="text-amber-200/40">
              ·
            </span>

            <span
              className="text-emerald-300 font-bold whitespace-nowrap"
              data-testid="hud-balance"
            >
              Saldo: {formatRupiah(balance)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenNotebook}
              data-testid="open-notebook-btn"
              className="pixel-btn bg-[#f5b942] text-[#1f140e] px-2.5 py-1 text-base font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buku Catatan</span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
              className="pixel-btn bg-[#fdf6e3] text-[#1f140e] px-2.5 py-1 text-base flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{muted ? 'Mati' : 'Suara'}</span>
            </button>

            <button
              type="button"
              onClick={onExitToMenu}
              className="pixel-btn bg-[#c93b2b] text-[#fdf6e3] px-2.5 py-1 text-base flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>{mode === 'endless' ? 'Tutup Sesi' : 'Menu Utama'}</span>
            </button>
          </div>
        </div>

        <MiniStoveBar
          mode={mode}
          activeWorkspace={activeWorkspace}
          kitchenSlots={kitchenSlots}
          endlessAutoStock={endlessAutoStock}
          onChangeWorkspace={onChangeWorkspace}
          onToggleEndlessAutoStock={onToggleEndlessAutoStock}
        />
      </div>

      <CustomerScenePanel
        order={order}
        mood={mood}
        reactionDialogue={reactionDialogue}
        upgrades={upgrades}
        weather={weather}
        vipHearts={vipHearts}
      />
    </section>
  );
}
