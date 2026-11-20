import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Play,
  Infinity as InfinityIcon,
  Lock,
} from 'lucide-react';
import { audioEngine } from '../game/audio';
import { MENU_ITEMS } from '../game/data';
import { drawWarungScene } from '../game/pixelArt';
import {
  DEFAULT_WARUNG_NAME,
  formatRupiah,
  isZenModeUnlocked,
  ZEN_CHEAT_CODE,
  ZEN_SIGN_CLICK_TARGET,
} from '../game/rules';
import { GameSaveState } from '../game/types';

interface TitleScreenProps {
  save: GameSaveState;
  warungNameInput: string;
  hasSavedData: boolean;
  muted: boolean;
  onChangeWarungName: (name: string) => void;
  onStartDaily: () => void;
  onStartEndless: () => void;
  onActivateZenCheat: () => void;
  onResetSave: () => void;
  onToggleMute: () => void;
}

export function TitleScreen({
  save,
  warungNameInput,
  hasSavedData,
  muted,
  onChangeWarungName,
  onStartDaily,
  onStartEndless,
  onActivateZenCheat,
  onResetSave,
  onToggleMute,
}: TitleScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [signClickStreak, setSignClickStreak] = useState(0);
  const [cheatToast, setCheatToast] = useState<string | null>(null);

  const zenUnlocked = isZenModeUnlocked(save);
  const unlockedCount = save.unlockedRecipes.length;
  const totalMenus = MENU_ITEMS.length;
  const unlockPct = Math.min(100, Math.round((unlockedCount / totalMenus) * 100));

  const triggerZenCheat = useCallback(() => {
    audioEngine.playCheatFanfare();
    onActivateZenCheat();
    setCheatToast('✨ CHEAT RAHASIA AKTIF! Mode Zen Terbuka Gratis!');
    setSignClickStreak(0);
  }, [onActivateZenCheat]);

  useEffect(() => {
    if (!cheatToast) return;
    const timer = window.setTimeout(() => setCheatToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [cheatToast]);

  // Hidden keyboard cheat: type WARUNGSULTAN anywhere on Title Screen (outside inputs)
  useEffect(() => {
    let buffer = '';
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
      ) {
        return;
      }
      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        buffer = (buffer + e.key.toUpperCase()).slice(-ZEN_CHEAT_CODE.length);
        if (buffer === ZEN_CHEAT_CODE) {
          buffer = '';
          triggerZenCheat();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [triggerZenCheat]);

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
        customerId: 'bang_jaka',
        mood: 'sempurna',
        upgrades: hasSavedData
          ? save.unlockedUpgrades
          : ['poster_warung', 'radio_retro', 'rice_cooker'],
        weather: 'sore_senja',
        isTitleScene: true,
      });
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [hasSavedData, save.unlockedUpgrades]);

  const previewSignName =
    warungNameInput.trim().length > 0
      ? warungNameInput.trim().toUpperCase().slice(0, 28)
      : DEFAULT_WARUNG_NAME;

  const handleSignClick = () => {
    audioEngine.playClick();
    setSignClickStreak((prev) => {
      const next = prev + 1;
      if (next >= ZEN_SIGN_CLICK_TARGET) {
        window.setTimeout(() => triggerZenCheat(), 0);
        return 0;
      }
      return next;
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#1b100a] flex flex-col justify-between p-4 md:p-6">
      {/* Live Cozy Warteg Diorama Backdrop */}
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#170d07]/95 via-[#170d07]/75 to-[#170d07]/35"
      />

      {/* Cheat Activation Pixel-Art Toast */}
      {cheatToast && (
        <div
          role="status"
          data-testid="cheat-toast"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pixel-panel bg-[#fef3c7] border-4 border-[#1f140e] px-5 py-3 shadow-[0_6px_0_#140b06] flex items-center gap-2.5 animate-plate-pop"
        >
          <Sparkles className="w-5 h-5 text-[#b45309] shrink-0" />
          <span className="font-pixel-title text-xs md:text-sm text-[#1f140e]">
            {cheatToast}
          </span>
        </div>
      )}

      {/* Top minimal audio control */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="text-amber-200/90 text-lg tracking-wide">
          Simulasi Warteg Retro 16-Bit
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
          className="pixel-btn bg-[#fdf6e3] text-[#1f140e] px-4 py-1.5 text-lg flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span>{muted ? 'Suara: Mati' : 'Suara: Nyala'}</span>
        </button>
      </div>

      {/* Main Title Emblem & Mode Selection */}
      <section className="relative z-10 max-w-6xl w-full mx-auto my-auto py-3 md:py-5">
        <div className="max-w-2xl">
          {/* Custom Inline SVG Warteg Signboard Emblem (also clickable Easter Egg!) */}
          <div className="mb-3 inline-block">
            <button
              type="button"
              onClick={handleSignClick}
              data-testid="title-warung-sign"
              aria-label={`Papan Nama ${previewSignName}`}
              className="block text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b942] transition-transform active:translate-y-0.5"
            >
              <svg
                viewBox="0 0 420 76"
                className="w-80 md:w-[410px] h-auto drop-shadow-[0_4px_0_#140b06]"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="412"
                  height="68"
                  fill="#59331d"
                  stroke="#1f140e"
                  strokeWidth="4"
                />
                <rect
                  x="10"
                  y="10"
                  width="400"
                  height="56"
                  fill="#2d6a4f"
                  stroke="#d8f3dc"
                  strokeWidth="2"
                />
                <rect x="16" y="16" width="8" height="8" fill="#f5b942" />
                <rect x="396" y="16" width="8" height="8" fill="#f5b942" />
                <rect x="16" y="52" width="8" height="8" fill="#f5b942" />
                <rect x="396" y="52" width="8" height="8" fill="#f5b942" />
                <text
                  x="210"
                  y="34"
                  textAnchor="middle"
                  fill="#f5b942"
                  fontFamily="'Press Start 2P', monospace"
                  fontSize="9"
                >
                  WARUNG RASA NUSANTARA
                </text>
                <text
                  x="210"
                  y="54"
                  textAnchor="middle"
                  fill="#fdf6e3"
                  fontFamily="'Press Start 2P', monospace"
                  fontSize={previewSignName.length > 20 ? '10' : '12'}
                >
                  {previewSignName}
                </text>
              </svg>
            </button>
            {signClickStreak >= 3 && !zenUnlocked && (
              <span className="sr-only">
                Ketukan papan nama: {signClickStreak}
              </span>
            )}
          </div>

          <h1 className="font-pixel-title text-xl md:text-2xl leading-relaxed text-[#fdf6e3] drop-shadow-[0_4px_0_#140b06] mb-2">
            Racik Lauk Hangat, Layani dengan Hati
          </h1>

          <p className="text-xl text-[#f5e6c4] leading-snug mb-4 max-w-xl">
            Buka etalase warteg khas Nusantara, masak masakan segar di dapur, dan
            layani pelanggan dengan santai tanpa kejaran waktu.
          </p>

          {/* Custom Warung Name Input */}
          <div className="mb-4 max-w-md pixel-panel p-3">
            <label
              htmlFor="warung-name-input"
              className="block text-lg font-bold text-[#2c1a10] mb-1"
            >
              Nama Warungmu (Tampil di Papan Kayu):
            </label>
            <input
              id="warung-name-input"
              type="text"
              maxLength={28}
              value={warungNameInput}
              onChange={(e) => {
                setSignClickStreak(0);
                onChangeWarungName(e.target.value);
              }}
              placeholder={DEFAULT_WARUNG_NAME}
              data-testid="warung-name-input"
              className="w-full bg-[#fffdf5] border-2 border-[#2c1a10] px-3 py-1 text-xl font-bold text-[#1f140e] placeholder:text-[#9c7a5b] focus:outline-none focus:ring-2 focus:ring-[#f5b942]"
            />
          </div>

          {hasSavedData && (
            <div className="mb-3 text-lg text-amber-200 flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
              <span>Progres Tersimpan:</span>
              <span className="font-bold text-[#f5b942]">Hari {save.day}</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-emerald-300">
                Saldo {formatRupiah(save.balance)}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {unlockedCount}/{totalMenus} Menu Terbuka
              </span>
            </div>
          )}

          {/* Primary Actions */}
          <div className="flex flex-wrap items-start gap-4">
            <button
              type="button"
              data-start="true"
              onClick={() => {
                setSignClickStreak(0);
                onStartDaily();
              }}
              className="pixel-btn bg-[#f5b942] text-[#1f140e] px-6 py-3 text-xl font-bold flex items-center gap-2.5 whitespace-nowrap shrink-0"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {hasSavedData ? `Lanjut Hari ${save.day}` : 'Mode Harian'}
              </span>
            </button>

            <div className="flex flex-col gap-1.5 max-w-sm">
              <button
                type="button"
                disabled={!zenUnlocked}
                onClick={() => {
                  setSignClickStreak(0);
                  onStartEndless();
                }}
                data-testid="btn-mode-zen"
                className={`pixel-btn px-5 py-3 text-xl font-bold flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
                  zenUnlocked
                    ? 'bg-[#2d6a4f] text-[#fdf6e3]'
                    : 'disabled:opacity-90 bg-[#463327] text-[#fdf6e3] border-[#784b2a]'
                }`}
              >
                {zenUnlocked ? (
                  <InfinityIcon className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5 text-[#f5b942]" />
                )}
                <span>
                  {zenUnlocked
                    ? 'Mode Zen (Masak Santai)'
                    : 'Mode Zen (Masak Santai) — Terkunci'}
                </span>
              </button>

              {!zenUnlocked ? (
                <div
                  data-testid="zen-unlock-progress"
                  className="bg-[#24140b]/90 border-2 border-[#59331d] px-2.5 py-1.5 text-base text-amber-100 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 tabular-nums leading-tight">
                    <span>
                      Buka semua 37 menu di Mode Harian untuk membuka Mode Zen
                    </span>
                    <span className="font-bold text-[#f5b942] shrink-0">
                      {unlockedCount}/{totalMenus}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#140b06] border border-[#59331d] overflow-hidden">
                    <div
                      className="h-full bg-[#f5b942] transition-all duration-300"
                      style={{ width: `${unlockPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  data-testid="zen-unlock-progress"
                  className="text-base text-emerald-300 font-bold"
                >
                  ✓ Mode Zen Terbuka! Semua 37 menu siap diracik bebas.
                </div>
              )}
            </div>
          </div>

          {/* Optional Reset Save with safe inline confirmation */}
          {hasSavedData && (
            <div className="mt-4">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="text-lg text-amber-200/80 hover:text-amber-100 underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Save (Ulang dari Hari 1)</span>
                </button>
              ) : (
                <div className="inline-flex flex-wrap items-center gap-3 pixel-panel px-4 py-2 text-lg">
                  <span>Yakin hapus progres Hari {save.day}?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetSave();
                      setConfirmReset(false);
                    }}
                    className="pixel-btn bg-[#c93b2b] text-white px-3 py-1 text-base"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="pixel-btn bg-[#e6d3a7] text-[#1f140e] px-3 py-1 text-base"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bottom single-line cozy guide */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 text-lg text-amber-100/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f5b942] shrink-0" />
          <span>
            Masak di dapur · Tata piring di etalase · Layani pelanggan dengan
            santai
          </span>
        </div>
        <span>Enter / Spasi untuk Mulai</span>
      </footer>
    </main>
  );
}
