import { memo, useEffect, useRef, useState } from 'react';
import { X, Heart, Award, Lock, Check, Utensils, Users } from 'lucide-react';
import {
  ACHIEVEMENTS,
  MENU_BY_ID,
  MENU_ITEMS,
  SECRET_RECIPES,
  VIP_BY_ID,
  VIP_PROFILES,
} from '../game/data';
import { drawCustomerPortrait } from '../game/pixelArt';
import { formatRupiah } from '../game/rules';
import { CustomerArchetypeId, GameMode, GameSaveState } from '../game/types';
import { PixelSprite } from './PixelSprite';

type NotebookTab = 'menu' | 'pelanggan' | 'pencapaian';

interface NotebookModalProps {
  save: GameSaveState;
  mode: GameMode;
  onClose: () => void;
}

const VipPortraitCanvas = memo(function VipPortraitCanvas({
  customerId,
}: {
  customerId: CustomerArchetypeId;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCustomerPortrait(ctx, customerId, canvas.width, canvas.height);
  }, [customerId]);

  return (
    <canvas
      ref={ref}
      width={64}
      height={64}
      aria-hidden="true"
      className="border-2 border-[#2c1a10] shrink-0"
      style={{ width: 64, height: 64, imageRendering: 'pixelated' }}
    />
  );
});

export function NotebookModal({ save, mode, onClose }: NotebookModalProps) {
  const [activeTab, setActiveTab] = useState<NotebookTab>('menu');

  const unlockedAchSet = new Set(save.unlockedAchievements);
  const unlockedSecretSet = new Set(save.unlockedSecretRecipes);
  const unlockedMenuSet = new Set(save.unlockedRecipes);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buku Catatan Warung"
      data-testid="notebook-modal"
      className="fixed inset-0 z-50 bg-[#140b06]/80 flex items-center justify-center p-3 md:p-6"
    >
      {/* Retro Checkered Notebook Paper Container */}
      <div
        className="w-full max-w-4xl max-h-[88vh] flex flex-col border-4 border-[#1f140e] shadow-[0_8px_0_#140b06]"
        style={{
          backgroundColor: '#fdfaf0',
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Notebook Spiral / Binding Header */}
        <div className="bg-[#59331d] border-b-4 border-[#1f140e] px-4 py-3 flex items-center justify-between gap-3 text-[#fdf6e3]">
          <div>
            <h2 className="font-pixel-title text-sm md:text-base text-[#f5b942]">
              Buku Catatan {save.warungName}
            </h2>
            <p className="text-lg text-amber-100/90 mt-0.5">
              Catatan resep, kedekatan pelanggan tetap, dan pencapaian warung
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Buku Catatan"
            data-testid="close-notebook-btn"
            className="pixel-btn bg-[#c93b2b] text-[#fdf6e3] px-3 py-1.5 text-lg flex items-center gap-1.5 shrink-0"
          >
            <X className="w-4 h-4" />
            <span>Tutup</span>
          </button>
        </div>

        {/* 3 Notebook Tabs */}
        <div
          role="tablist"
          aria-label="Bagian Buku Catatan"
          className="px-4 pt-3 pb-2 border-b-2 border-[#cbd5e1] flex flex-wrap gap-2 bg-[#f5e6c4]/70"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
            data-testid="notebook-tab-menu"
            className={`pixel-btn px-3.5 py-1.5 text-lg font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                : 'bg-[#fdf6e3] text-[#1f140e]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu &amp; Resep</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pelanggan'}
            onClick={() => setActiveTab('pelanggan')}
            data-testid="notebook-tab-pelanggan"
            className={`pixel-btn px-3.5 py-1.5 text-lg font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pelanggan'
                ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                : 'bg-[#fdf6e3] text-[#1f140e]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pelanggan ({VIP_PROFILES.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pencapaian'}
            onClick={() => setActiveTab('pencapaian')}
            data-testid="notebook-tab-pencapaian"
            className={`pixel-btn px-3.5 py-1.5 text-lg font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pencapaian'
                ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                : 'bg-[#fdf6e3] text-[#1f140e]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              Pencapaian ({save.unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </span>
          </button>
        </div>

        {/* Notebook Scrollable Body with classic red margin line */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 border-l-4 border-[#fca5a5]/70 ml-2 md:ml-4">
          {activeTab === 'menu' && (
            <div className="space-y-5">
              {/* Secret Recipes Section */}
              <div>
                <h3 className="font-pixel-title text-xs md:text-sm text-[#9b2226] mb-2.5">
                  Resep Rahasia Pelanggan Tetap ({save.unlockedSecretRecipes.length}/
                  {SECRET_RECIPES.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SECRET_RECIPES.map((recipe) => {
                    const isUnlocked = unlockedSecretSet.has(recipe.id);
                    const vip = VIP_BY_ID[recipe.vipId];
                    return (
                      <div
                        key={recipe.id}
                        data-testid={`secret-recipe-${recipe.id}`}
                        className={`border-2 border-[#2c1a10] p-3 ${
                          isUnlocked ? 'bg-[#fef9e7]' : 'bg-[#e2e8f0]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xl font-bold text-[#1f140e]">
                            {isUnlocked ? recipe.name : 'Resep Rahasia Terkunci'}
                          </div>
                          {isUnlocked ? (
                            <span className="text-sm font-bold text-[#2d6a4f] flex items-center gap-1 shrink-0">
                              <Check className="w-4 h-4" /> Terbuka
                            </span>
                          ) : (
                            <span className="text-sm text-[#64748b] flex items-center gap-1 shrink-0">
                              <Lock className="w-3.5 h-3.5" /> {vip.name} (
                              {recipe.unlockAtHearts} Hati)
                            </span>
                          )}
                        </div>

                        {isUnlocked ? (
                          <>
                            <p className="text-base text-[#5e3822] mt-0.5 leading-snug">
                              {recipe.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {recipe.ingredients.map((ingId) => (
                                <span
                                  key={ingId}
                                  className="bg-[#f5e6c4] border border-[#2c1a10] px-2 py-0.5 text-base font-bold text-[#1f140e]"
                                >
                                  {MENU_BY_ID[ingId].name}
                                </span>
                              ))}
                              {recipe.requiredPrefs?.soupStyle === 'siram' && (
                                <span className="bg-[#d8f3dc] border border-[#1b4332] px-2 py-0.5 text-base font-bold text-[#1b4332]">
                                  Siram ke Nasi
                                </span>
                              )}
                              {recipe.requiredPrefs?.iceLevel === 'tanpa_es' && (
                                <span className="bg-[#fde68a] border border-[#92400e] px-2 py-0.5 text-base font-bold text-[#78350f]">
                                  Tanpa Es
                                </span>
                              )}
                              {recipe.requiredPrefs?.sweetness === 'tawar' && (
                                <span className="bg-[#fde68a] border border-[#92400e] px-2 py-0.5 text-base font-bold text-[#78350f]">
                                  Tawar
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-base text-[#475569] mt-1">
                            Layani {vip.name} dengan akurat hingga mencapai{' '}
                            {recipe.unlockAtHearts} Hati untuk membuka resep ini.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regular 17 Menu Items */}
              <div>
                <h3 className="font-pixel-title text-xs md:text-sm text-[#1b4332] mb-2.5">
                  Daftar Menu Reguler ({MENU_ITEMS.length} Hidangan)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {MENU_ITEMS.map((item) => {
                    const isUnlocked =
                      mode === 'endless' || unlockedMenuSet.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`border-2 border-[#2c1a10] p-2.5 flex items-center gap-3 ${
                          isUnlocked ? 'bg-[#fdf6e3]' : 'bg-[#e2e8f0]/80'
                        }`}
                      >
                        <div className="bg-[#f5e6c4] border border-[#2c1a10] p-1 shrink-0">
                          <PixelSprite itemId={item.id} size={36} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-bold text-[#1f140e] leading-tight">
                            {item.name}
                          </div>
                          <div className="text-base text-[#2d6a4f] tabular-nums">
                            {isUnlocked
                              ? formatRupiah(item.price)
                              : 'Buka di Toko Antar-Hari'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pelanggan' && (
            <div className="space-y-3">
              <h3 className="font-pixel-title text-xs md:text-sm text-[#2c1a10] mb-2">
                Profil Pelanggan Tetap (VIP)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {VIP_PROFILES.map((vip) => {
                  const hearts = save.vipHearts[vip.id] ?? 1;
                  return (
                    <div
                      key={vip.id}
                      data-testid={`vip-card-${vip.id}`}
                      className="bg-[#fdf6e3] border-2 border-[#2c1a10] p-3.5 flex gap-3.5"
                    >
                      <VipPortraitCanvas customerId={vip.id} />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-pixel-title text-xs text-[#2c1a10]">
                              {vip.name}
                            </span>
                            <span className="text-lg text-[#694127] ml-2">
                              {vip.role}
                            </span>
                          </div>
                        </div>

                        {/* Heart Meter (1 to 5) */}
                        <div
                          className="flex items-center gap-1"
                          aria-label={`Kedekatan ${hearts} dari 5 hati`}
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Heart
                              key={n}
                              className={`w-4 h-4 ${
                                n <= hearts
                                  ? 'text-[#c93b2b] fill-[#c93b2b]'
                                  : 'text-[#cbd5e1]'
                              }`}
                            />
                          ))}
                          <span className="text-base font-bold text-[#5e3822] ml-1.5 tabular-nums">
                            {hearts}/5 Hati
                          </span>
                        </div>

                        <p className="text-base text-[#1f140e] leading-snug">
                          {vip.personality}
                        </p>
                        <p className="text-base text-[#2d6a4f] font-bold leading-snug">
                          Favorit: {vip.favoriteSummary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pencapaian' && (
            <div className="space-y-3">
              <h3 className="font-pixel-title text-xs md:text-sm text-[#2c1a10] mb-2">
                Pencapaian Warung ({save.unlockedAchievements.length}/
                {ACHIEVEMENTS.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const unlocked = unlockedAchSet.has(ach.id);
                  return (
                    <div
                      key={ach.id}
                      data-testid={`achievement-${ach.id}`}
                      className={`border-2 border-[#2c1a10] p-3 flex items-start gap-3 ${
                        unlocked ? 'bg-[#d8f3dc]' : 'bg-[#f1f5f9]'
                      }`}
                    >
                      <div
                        className={`p-2 border-2 border-[#2c1a10] shrink-0 ${
                          unlocked
                            ? 'bg-[#f5b942] text-[#1f140e]'
                            : 'bg-[#cbd5e1] text-[#64748b]'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-[#1f140e]">
                            {ach.title}
                          </span>
                          {unlocked && (
                            <span className="text-sm font-bold text-[#1b4332]">
                              ✓ Tercapai
                            </span>
                          )}
                        </div>
                        <p className="text-base text-[#334155] leading-snug mt-0.5">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
