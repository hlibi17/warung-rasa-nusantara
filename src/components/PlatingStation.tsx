import { memo, useEffect, useRef } from 'react';
import {
  RotateCcw,
  UtensilsCrossed,
  ArrowRight,
  X,
  Heart,
  Award,
  Sparkles,
} from 'lucide-react';
import { MENU_BY_ID } from '../game/data';
import { drawPlatingTable } from '../game/pixelArt';
import { formatRupiah, ProgressUpdateResult } from '../game/rules';
import {
  IceLevel,
  MenuItemId,
  OrderEvaluation,
  ServingOptions,
  SoupStyle,
  SweetnessLevel,
} from '../game/types';

interface PlatingStationProps {
  platedItems: MenuItemId[];
  servingOptions: ServingOptions;
  evaluation: OrderEvaluation | null;
  progressFeedback: Omit<ProgressUpdateResult, 'save'> | null;
  isLastCustomerOfDay: boolean;
  onChangeSoupStyle: (style: SoupStyle) => void;
  onChangeIceLevel: (level: IceLevel) => void;
  onChangeSweetness: (sweetness: SweetnessLevel) => void;
  onRemoveItem: (id: MenuItemId) => void;
  onResetPlate: () => void;
  onServeOrder: () => void;
  onNextCustomer: () => void;
}

export const PlatingStation = memo(function PlatingStation({
  platedItems,
  servingOptions,
  evaluation,
  progressFeedback,
  isLastCustomerOfDay,
  onChangeSoupStyle,
  onChangeIceLevel,
  onChangeSweetness,
  onRemoveItem,
  onResetPlate,
  onServeOrder,
  onNextCustomer,
}: PlatingStationProps) {
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
      drawPlatingTable(
        ctx,
        canvas.width,
        canvas.height,
        platedItems,
        timeSec,
        servingOptions
      );
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [platedItems, servingOptions]);

  const tierLabel =
    evaluation?.tier === 'sempurna'
      ? 'Sempurna!'
      : evaluation?.tier === 'kurang_tepat'
      ? 'Kurang Tepat'
      : 'Pesanan Salah';

  const tierColor =
    evaluation?.tier === 'sempurna'
      ? 'text-[#1b4332]'
      : evaluation?.tier === 'kurang_tepat'
      ? 'text-[#9a5b13]'
      : 'text-[#9b2226]';

  const isDisabled = Boolean(evaluation);

  return (
    <section
      aria-label="Meja Racik Pesanan"
      className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch"
    >
      {/* Left: Interactive Pixel Plating Canvas */}
      <div className="lg:col-span-6 pixel-wood-panel p-2 flex flex-col justify-between">
        <div className="flex items-center justify-between px-1 pb-1 text-amber-100 text-lg">
          <span>Meja Racik (Piring · Mangkuk · Gelas)</span>
          <span className="tabular-nums text-amber-300">
            {platedItems.length} terpasang
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={380}
          height={152}
          data-testid="plating-canvas"
          aria-label="Visual piring saji, mangkuk sayur, dan tatakan gelas"
          className="w-full h-32 lg:h-36 object-cover bg-[#54301a]"
        />
      </div>

      {/* Right: Tray Item List, Serving Options & Action Controls */}
      <div className="lg:col-span-6 pixel-panel p-3.5 flex flex-col justify-between gap-2.5">
        {!evaluation ? (
          <>
            <div className="space-y-2.5">
              <div>
                <div className="text-lg font-bold text-[#2c1a10] mb-1">
                  Isi Piring &amp; Gelas Saat Ini:
                </div>
                {platedItems.length === 0 ? (
                  <p className="text-lg text-[#784b2a]">
                    Belum ada bahan dipilih. Klik lauk, sayur, atau minuman di
                    etalase bawah untuk menata pesanan.
                  </p>
                ) : (
                  <div
                    className="flex flex-wrap gap-2"
                    data-testid="plated-items-list"
                  >
                    {platedItems.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onRemoveItem(id)}
                        aria-label={`Keluarkan ${MENU_BY_ID[id].name} dari piring`}
                        className="animate-plate-pop pixel-btn bg-[#f5e6c4] text-[#1f140e] px-2.5 py-0.5 text-lg flex items-center gap-1.5"
                      >
                        <span>{MENU_BY_ID[id].name}</span>
                        <X className="w-3.5 h-3.5 text-[#c93b2b]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Takaran & Cara Penyajian */}
              <div className="pt-2 border-t-2 border-[#e6d3a7] space-y-1.5">
                <div className="text-base font-bold text-[#5e3822]">
                  Atur Cara Penyajian &amp; Takaran (Opsional):
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.soupStyle === 'pisah'}
                      onClick={() => onChangeSoupStyle('pisah')}
                      data-testid="opt-soup-pisah"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.soupStyle === 'pisah'
                          ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Kuah Pisah Mangkuk
                    </button>
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.soupStyle === 'siram'}
                      onClick={() => onChangeSoupStyle('siram')}
                      data-testid="opt-soup-siram"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.soupStyle === 'siram'
                          ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Siram ke Nasi
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.iceLevel === 'normal'}
                      onClick={() => onChangeIceLevel('normal')}
                      data-testid="opt-ice-normal"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.iceLevel === 'normal'
                          ? 'bg-[#b45309] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Es Normal
                    </button>
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.iceLevel === 'tanpa_es'}
                      onClick={() => onChangeIceLevel('tanpa_es')}
                      data-testid="opt-ice-tanpa"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.iceLevel === 'tanpa_es'
                          ? 'bg-[#b45309] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Tanpa Es
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.sweetness === 'manis'}
                      onClick={() => onChangeSweetness('manis')}
                      data-testid="opt-sweet-manis"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.sweetness === 'manis'
                          ? 'bg-[#5e3822] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Manis
                    </button>
                    <button
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={servingOptions.sweetness === 'tawar'}
                      onClick={() => onChangeSweetness('tawar')}
                      data-testid="opt-sweet-tawar"
                      className={`pixel-btn px-2.5 py-1 text-base whitespace-nowrap ${
                        servingOptions.sweetness === 'tawar'
                          ? 'bg-[#5e3822] text-[#fdf6e3]'
                          : 'bg-[#f5e6c4] text-[#1f140e]'
                      }`}
                    >
                      Tawar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onResetPlate}
                disabled={platedItems.length === 0}
                className="pixel-btn bg-[#e6d3a7] text-[#1f140e] px-4 py-2 text-xl flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Piring</span>
              </button>

              <button
                type="button"
                onClick={onServeOrder}
                disabled={platedItems.length === 0}
                data-testid="serve-order-btn"
                className="pixel-btn bg-[#2d6a4f] text-[#fdf6e3] px-5 py-2 text-xl font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Sajikan Pesanan</span>
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col justify-between h-full gap-2.5"
            data-testid="order-feedback"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-pixel-title text-sm ${tierColor}`}>
                  {tierLabel}
                </span>
                <span className="text-xl font-bold text-[#1b4332] tabular-nums">
                  +{formatRupiah(evaluation.totalPaid)}
                  {evaluation.tipAmount > 0 && (
                    <span className="text-lg font-normal text-[#694127] ml-2">
                      (Termasuk tip {formatRupiah(evaluation.tipAmount)}
                      {evaluation.freshlyCookedBonus > 0
                        ? ` · Freshly Cooked +${formatRupiah(
                            evaluation.freshlyCookedBonus
                          )}`
                        : ''}
                      )
                    </span>
                  )}
                </span>
              </div>

              {evaluation.missingItems.length > 0 && (
                <p className="text-lg text-[#9b2226]">
                  Kurang:{' '}
                  {evaluation.missingItems
                    .map((id) => MENU_BY_ID[id].name)
                    .join(', ')}
                </p>
              )}
              {evaluation.extraItems.length > 0 && (
                <p className="text-lg text-[#9a5b13]">
                  Kelebihan:{' '}
                  {evaluation.extraItems
                    .map((id) => MENU_BY_ID[id].name)
                    .join(', ')}
                </p>
              )}
              {evaluation.mismatchedPrefs.length > 0 && (
                <p className="text-lg text-[#9a5b13]">
                  Penyajian kurang pas: seharusnya{' '}
                  {evaluation.mismatchedPrefs.join(' & ')}
                </p>
              )}

              {/* VIP Heart Milestone & Achievement Notifications */}
              {progressFeedback?.vipHeartUp && (
                <div className="bg-[#f5e6c4] border-2 border-[#2c1a10] px-2.5 py-1.5 text-base space-y-0.5">
                  <div className="font-bold text-[#c93b2b] flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-[#c93b2b]" />
                    <span>
                      Kedekatan {progressFeedback.vipHeartUp.vipName} naik ke{' '}
                      {progressFeedback.vipHeartUp.newHearts}/5 Hati!
                    </span>
                  </div>
                  {progressFeedback.vipHeartUp.milestoneStory && (
                    <p className="text-[#1f140e] leading-snug">
                      {progressFeedback.vipHeartUp.milestoneStory}
                    </p>
                  )}
                  {progressFeedback.vipHeartUp.unlockedSecretRecipe && (
                    <div className="font-bold text-[#1b4332] flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#b45309]" />
                      <span>
                        Resep Rahasia Terbuka:{' '}
                        {progressFeedback.vipHeartUp.unlockedSecretRecipe.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {progressFeedback &&
                progressFeedback.newAchievements.length > 0 && (
                  <div className="bg-[#d8f3dc] border-2 border-[#1b4332] px-2.5 py-1 text-base font-bold text-[#1b4332] flex flex-wrap items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#b45309]" />
                    <span>
                      Pencapaian Baru:{' '}
                      {progressFeedback.newAchievements
                        .map((a) => a.title)
                        .join(', ')}
                    </span>
                  </div>
                )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onNextCustomer}
                data-testid="next-customer-btn"
                className="pixel-btn bg-[#f5b942] text-[#1f140e] px-5 py-2.5 text-xl font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>
                  {isLastCustomerOfDay
                    ? 'Lihat Laporan Harian'
                    : 'Pelanggan Berikutnya'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
