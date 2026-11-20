import { Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { MENU_ITEMS, UPGRADES } from '../game/data';
import { formatRupiah } from '../game/rules';
import { DailySummary, GameSaveState, MenuItemId, UpgradeId } from '../game/types';
import { PixelSprite } from './PixelSprite';

interface DailySummaryModalProps {
  summary: DailySummary;
  save: GameSaveState;
  shopNotice: string | null;
  onBuyRecipe: (id: MenuItemId) => void;
  onBuyUpgrade: (id: UpgradeId) => void;
  onStartNextDay: () => void;
  onReturnTitle: () => void;
}

export function DailySummaryModal({
  summary,
  save,
  shopNotice,
  onBuyRecipe,
  onBuyUpgrade,
  onStartNextDay,
  onReturnTitle,
}: DailySummaryModalProps) {
  const unlockableRecipes = MENU_ITEMS.filter((m) => !m.defaultUnlocked);

  return (
    <main className="min-h-screen w-full bg-[#24140b] p-4 md:p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-5">
        {/* Top Daily Financial Report */}
        <section
          aria-label="Laporan Harian"
          className="pixel-panel p-5 md:p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#e6d3a7] pb-3">
            <div>
              <h1 className="font-pixel-title text-lg md:text-xl text-[#2c1a10]">
                Laporan Harian · Hari {summary.day}
              </h1>
              <p className="text-xl text-[#5e3822] mt-1">
                {summary.customersServed} pelanggan dilayani hari ini (
                {summary.perfectCount} sempurna · {summary.partialCount} kurang tepat ·{' '}
                {summary.wrongCount} salah)
              </p>
            </div>
            <div className="text-right tabular-nums">
              <div className="text-lg text-[#5e3822]">Saldo Kas Warung</div>
              <div className="font-pixel-title text-lg text-[#2d6a4f]" data-testid="summary-balance">
                {formatRupiah(save.balance)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 tabular-nums">
            <div className="bg-[#f5e6c4] border-2 border-[#2c1a10] p-3">
              <div className="text-lg text-[#5e3822]">Total Pendapatan</div>
              <div className="text-2xl font-bold text-[#1f140e]">
                {formatRupiah(summary.totalRevenue)}
              </div>
            </div>
            <div className="bg-[#f5e6c4] border-2 border-[#2c1a10] p-3">
              <div className="text-lg text-[#5e3822]">Total Tip Hangat</div>
              <div className="text-2xl font-bold text-[#b45309]">
                +{formatRupiah(summary.totalTips)}
              </div>
            </div>
            <div className="bg-[#f5e6c4] border-2 border-[#2c1a10] p-3">
              <div className="text-lg text-[#5e3822]">Biaya Bahan Baku</div>
              <div className="text-2xl font-bold text-[#9b2226]">
                -{formatRupiah(summary.totalCost)}
              </div>
            </div>
            <div className="bg-[#d8f3dc] border-2 border-[#1b4332] p-3">
              <div className="text-lg text-[#1b4332]">Laba Bersih</div>
              <div className="text-2xl font-bold text-[#1b4332]" data-testid="net-profit">
                {formatRupiah(summary.netProfit)}
              </div>
            </div>
          </div>
        </section>

        {/* Toko Upgrade & Resep */}
        <section
          aria-label="Toko Upgrade dan Resep"
          className="pixel-glass-panel p-5 md:p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#1b4332]" />
              <h2 className="font-pixel-title text-base md:text-lg text-[#1b4332]">
                Toko Upgrade &amp; Resep Baru
              </h2>
            </div>
            {shopNotice && (
              <span className="text-xl font-bold text-[#b45309]">{shopNotice}</span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Resep Baru */}
            <div className="space-y-2.5">
              <h3 className="text-xl font-bold text-[#1b4332]">
                Buka Menu Nusantara Baru ({save.unlockedRecipes.length}/
                {MENU_ITEMS.length})
              </h3>
              <div className="max-h-[340px] overflow-y-auto pr-1.5 space-y-2">
                {unlockableRecipes.map((item) => {
                  const owned = save.unlockedRecipes.includes(item.id);
                  const canAfford = save.balance >= item.unlockCost;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#fdf6e3] border-2 border-[#1b4332] p-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-[#f5e6c4] border-2 border-[#2c1a10] p-1 shrink-0">
                          <PixelSprite itemId={item.id} size={36} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xl font-bold text-[#1f140e]">
                            {item.name}
                          </div>
                          <div className="text-base text-[#5e3822] leading-snug">
                            {item.shortDesc}
                          </div>
                        </div>
                      </div>

                      {owned ? (
                        <span className="inline-flex items-center gap-1 text-lg font-bold text-[#2d6a4f] shrink-0">
                          <Check className="w-4 h-4" />
                          <span>Terbuka</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onBuyRecipe(item.id)}
                          data-testid={`buy-recipe-${item.id}`}
                          className="pixel-btn bg-[#f5b942] text-[#1f140e] px-3 py-1.5 text-lg font-bold tabular-nums whitespace-nowrap shrink-0"
                        >
                          Buka · {formatRupiah(item.unlockCost)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fasilitas Warung */}
            <div className="space-y-2.5">
              <h3 className="text-xl font-bold text-[#1b4332]">
                Upgrade Fasilitas Warung (Tampil di Latar)
              </h3>
              <div className="space-y-2">
                {UPGRADES.map((upg) => {
                  const owned = save.unlockedUpgrades.includes(upg.id);
                  const canAfford = save.balance >= upg.cost;
                  return (
                    <div
                      key={upg.id}
                      className="bg-[#fdf6e3] border-2 border-[#1b4332] p-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xl font-bold text-[#1f140e]">
                          {upg.name}
                        </div>
                        <div className="text-base text-[#2d6a4f] font-bold">
                          {upg.effectLabel}
                        </div>
                      </div>

                      {owned ? (
                        <span className="inline-flex items-center gap-1 text-lg font-bold text-[#2d6a4f] shrink-0">
                          <Check className="w-4 h-4" />
                          <span>Terpasang</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onBuyUpgrade(upg.id)}
                          data-testid={`buy-upgrade-${upg.id}`}
                          className="pixel-btn bg-[#2d6a4f] text-[#fdf6e3] px-3 py-1.5 text-lg font-bold tabular-nums whitespace-nowrap shrink-0"
                        >
                          Beli · {formatRupiah(upg.cost)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReturnTitle}
            className="pixel-btn bg-[#e6d3a7] text-[#1f140e] px-5 py-3 text-xl font-bold whitespace-nowrap shrink-0"
          >
            Kembali ke Menu Utama
          </button>

          <button
            type="button"
            onClick={onStartNextDay}
            data-testid="start-next-day-btn"
            className="pixel-btn bg-[#f5b942] text-[#1f140e] px-6 py-3 text-xl font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Mulai Hari {save.day}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
