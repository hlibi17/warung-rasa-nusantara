import { memo } from 'react';
import { Lock, Check, Flame } from 'lucide-react';
import { CATEGORY_TABS, MENU_ITEMS } from '../game/data';
import { formatRupiah } from '../game/rules';
import { CategoryId, GameMode, MenuItemId } from '../game/types';
import { PixelSprite } from './PixelSprite';

interface EtalasePanelProps {
  activeCategory: CategoryId;
  mode: GameMode;
  unlockedRecipes: MenuItemId[];
  platedItems: MenuItemId[];
  itemStock: Record<MenuItemId, number>;
  freshlyCookedItems: MenuItemId[];
  endlessAutoStock: boolean;
  disabled: boolean;
  onSelectCategory: (cat: CategoryId) => void;
  onToggleIngredient: (id: MenuItemId) => void;
  onOpenKitchen: () => void;
}

export const EtalasePanel = memo(function EtalasePanel({
  activeCategory,
  mode,
  unlockedRecipes,
  platedItems,
  itemStock,
  freshlyCookedItems,
  endlessAutoStock,
  disabled,
  onSelectCategory,
  onToggleIngredient,
  onOpenKitchen,
}: EtalasePanelProps) {
  const unlockedSet = new Set(unlockedRecipes);
  const platedSet = new Set(platedItems);
  const freshSet = new Set(freshlyCookedItems);
  const visibleItems = MENU_ITEMS.filter((m) => m.category === activeCategory);
  const useStockLimits = mode === 'harian' || !endlessAutoStock;

  return (
    <section
      aria-label="Etalase Warung"
      className="pixel-glass-panel p-3 md:p-4 space-y-3"
    >
      {/* Category Tabs + Dapur Quick Shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Kategori Etalase"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.id === activeCategory;
            const catCount = MENU_ITEMS.filter(
              (m) => m.category === tab.id
            ).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(tab.id)}
                className={`pixel-btn px-3.5 py-2 text-lg md:text-xl font-bold whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                    : 'bg-[#fdf6e3] text-[#1f140e]'
                }`}
              >
                {tab.label} ({catCount})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenKitchen}
          data-testid="etalase-open-kitchen-btn"
          className="pixel-btn bg-[#d97706] text-[#fdf6e3] px-3 py-1.5 text-lg font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Flame className="w-4 h-4" />
          <span>Masak di Dapur</span>
        </button>
      </div>

      {/* Etalase Shelf Cards (Scrollable Grid for 8-9 items on laptop screens) */}
      <div
        data-testid="etalase-grid"
        className="max-h-[188px] lg:max-h-[208px] overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5"
      >
        {visibleItems.map((item) => {
          const isUnlocked = mode === 'endless' || unlockedSet.has(item.id);
          const isSelected = platedSet.has(item.id);
          const isInstant = item.cookingStation === 'instan';
          const stockCount = itemStock[item.id] ?? 0;
          const outOfStock =
            useStockLimits && !isInstant && stockCount <= 0 && !isSelected;
          const isFresh =
            useStockLimits &&
            !isInstant &&
            freshSet.has(item.id) &&
            stockCount > 0;

          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled || !isUnlocked || outOfStock}
              onClick={() => onToggleIngredient(item.id)}
              aria-pressed={isSelected}
              data-testid={`etalase-item-${item.id}`}
              className={`pixel-btn relative p-2.5 text-left flex items-center gap-3 min-h-[78px] ${
                !isUnlocked
                  ? 'bg-[#d4dcd6] text-[#4b5e54]'
                  : outOfStock
                  ? 'bg-[#e7d8c5] text-[#7c2d12]'
                  : isSelected
                  ? 'bg-[#fef3c7] text-[#1f140e]'
                  : 'bg-[#fdf6e3] text-[#1f140e]'
              }`}
            >
              {/* Portion Stock Badge */}
              {isUnlocked && (
                <span
                  data-testid={`stock-badge-${item.id}`}
                  className={`absolute top-1 right-1 px-1.5 text-sm font-bold border border-[#2c1a10] tabular-nums ${
                    !useStockLimits || isInstant
                      ? 'bg-[#d8f3dc] text-[#1b4332]'
                      : stockCount <= 0
                      ? 'bg-[#fecaca] text-[#991b1b]'
                      : stockCount <= 2
                      ? 'bg-[#fde68a] text-[#92400e]'
                      : 'bg-[#d8f3dc] text-[#1b4332]'
                  }`}
                >
                  {!useStockLimits
                    ? '∞'
                    : isInstant
                    ? 'Siap'
                    : `x${stockCount}`}
                </span>
              )}

              <div className="relative shrink-0 bg-[#f5e6c4] border-2 border-[#2c1a10] p-1">
                <PixelSprite itemId={item.id} size={44} />
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-[#1f140e]/65 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#fdf6e3]" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-11">
                <div className="text-xl font-bold leading-tight truncate">
                  {item.name}
                </div>
                {isUnlocked ? (
                  <div className="flex items-center justify-between gap-1 text-lg text-[#2d6a4f] tabular-nums mt-0.5">
                    <span>
                      {outOfStock ? 'Stok Habis' : formatRupiah(item.price)}
                    </span>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-0.5 text-[#b45309] font-bold">
                        <Check className="w-4 h-4" />
                        <span>Ada</span>
                      </span>
                    ) : (
                      isFresh && (
                        <span className="text-sm font-bold text-[#d97706]">
                          Segar
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-base text-[#5e3822] mt-0.5">
                    Buka di Toko Resep
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
});
