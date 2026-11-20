import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DailySummaryModal } from './components/DailySummaryModal';
import { EtalasePanel } from './components/EtalasePanel';
import { GameCounter } from './components/GameCounter';
import { KitchenPanel } from './components/KitchenPanel';
import { NotebookModal } from './components/NotebookModal';
import { PlatingStation } from './components/PlatingStation';
import { TitleScreen } from './components/TitleScreen';
import { audioEngine } from './game/audio';
import { ALL_RECIPE_IDS, MENU_BY_ID } from './game/data';
import { CustomerMood } from './game/pixelArt';
import {
  advanceKitchenSlots,
  applyServedProgress,
  calculateDailySummary,
  clearSaveInStorage,
  consumeStockForOrder,
  COOK_BATCH_YIELD,
  createDefaultSave,
  createInitialKitchenSlots,
  DEFAULT_SERVING_OPTIONS,
  discardBurntFromSlot,
  evaluateOrder,
  formatRupiah,
  generateCustomerOrder,
  getCustomersQuotaForDay,
  getWeatherForDay,
  getWeatherForEndless,
  isZenModeUnlocked,
  liftFromSlot,
  loadSaveFromStorage,
  persistSaveToStorage,
  poundCobekSlot,
  ProgressUpdateResult,
  purchaseRecipe,
  purchaseUpgrade,
  sanitizeWarungName,
  startCookingInSlot,
  stirTumisSlot,
  unlockZenModeViaCheat,
} from './game/rules';
import {
  CategoryId,
  CookingStationId,
  CustomerOrder,
  DailySummary,
  GameMode,
  GameSaveState,
  GameScreenState,
  IceLevel,
  KitchenSlotState,
  MenuItemId,
  OrderEvaluation,
  RawTrayItem,
  ServedRecord,
  ServingOptions,
  SoupStyle,
  SweetnessLevel,
  UpgradeId,
} from './game/types';

const ZEN_ALL_UPGRADES: UpgradeId[] = [
  'poster_warung',
  'radio_retro',
  'rice_cooker',
  'kipas_angin',
  'etalase_besar',
];

export default function App() {
  const [initialLoad] = useState(() => loadSaveFromStorage());
  const [save, setSave] = useState<GameSaveState>(initialLoad.save);
  const saveRef = useRef(save);
  saveRef.current = save;

  const [warungNameInput, setWarungNameInput] = useState<string>(
    initialLoad.save.warungName
  );
  const [hasSavedData, setHasSavedData] = useState<boolean>(
    initialLoad.hasSavedData
  );

  const [screen, setScreen] = useState<GameScreenState>(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('autostart') === '1'
    ) {
      return 'playing';
    }
    return 'title';
  });

  const [mode, setMode] = useState<GameMode>('harian');
  const [muted, setMuted] = useState<boolean>(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);

  // Active Day / Session state
  const [customerIndex, setCustomerIndex] = useState<number>(0);
  const [endlessServed, setEndlessServed] = useState<number>(0);
  const [endlessBalance, setEndlessBalance] = useState<number>(0);
  const [dayRecords, setDayRecords] = useState<ServedRecord[]>([]);
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder>(() =>
    generateCustomerOrder(
      initialLoad.save.day,
      initialLoad.save.unlockedRecipes,
      'harian',
      0,
      getWeatherForDay(initialLoad.save.day),
      Math.random,
      initialLoad.save.unlockedSecretRecipes
    )
  );
  const [platedItems, setPlatedItems] = useState<MenuItemId[]>([]);
  const [servingOptions, setServingOptions] = useState<ServingOptions>(
    DEFAULT_SERVING_OPTIONS
  );
  const [activeCategory, setActiveCategory] = useState<CategoryId>('karbo');
  const [evaluation, setEvaluation] = useState<OrderEvaluation | null>(null);
  const [progressFeedback, setProgressFeedback] = useState<Omit<
    ProgressUpdateResult,
    'save'
  > | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [shopNotice, setShopNotice] = useState<string | null>(null);

  // Dapur Masak & Etalase Stock state
  const [activeWorkspace, setActiveWorkspace] = useState<'etalase' | 'dapur'>(
    'etalase'
  );
  const [kitchenSlots, setKitchenSlots] = useState<
    Record<CookingStationId, KitchenSlotState>
  >(() => createInitialKitchenSlots());
  const kitchenSlotsRef = useRef(kitchenSlots);
  kitchenSlotsRef.current = kitchenSlots;

  const [rawTray, setRawTray] = useState<RawTrayItem[]>([]);
  const [freshlyCookedItems, setFreshlyCookedItems] = useState<MenuItemId[]>(
    []
  );
  const [kitchenNotice, setKitchenNotice] = useState<string | null>(null);
  const [endlessAutoStock, setEndlessAutoStock] = useState<boolean>(true);

  const activeWeather =
    mode === 'harian'
      ? getWeatherForDay(save.day)
      : getWeatherForEndless(endlessServed);

  // Mirror screen state onto body[data-state]
  useEffect(() => {
    document.body.dataset.state = screen;
  }, [screen]);

  // Global audio teardown on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  // Sync procedural rain ambience with playing screen & weather
  useEffect(() => {
    audioEngine.setRaining(
      screen === 'playing' && activeWeather === 'hujan_rintik'
    );
  }, [screen, activeWeather]);

  // Gentle 250ms kitchen cooking tick while playing
  useEffect(() => {
    if (screen !== 'playing') return;
    const timer = window.setInterval(() => {
      const res = advanceKitchenSlots(kitchenSlotsRef.current, 0.25);
      if (res.slots !== kitchenSlotsRef.current) {
        kitchenSlotsRef.current = res.slots;
        setKitchenSlots(res.slots);
        if (res.dingStations.length > 0) {
          audioEngine.playKitchenDing();
        }
        if (res.burntStations.length > 0) {
          audioEngine.playBurntSizzle();
        }
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [screen]);

  const handleChangeWarungName = useCallback((rawName: string) => {
    setWarungNameInput(rawName);
    const sanitized = sanitizeWarungName(rawName);
    setSave((prev) => {
      const updated: GameSaveState = { ...prev, warungName: sanitized };
      persistSaveToStorage(updated);
      return updated;
    });
  }, []);

  const handleActivateZenCheat = useCallback(() => {
    setSave((prev) => {
      const updated = unlockZenModeViaCheat(prev);
      persistSaveToStorage(updated);
      return updated;
    });
    setHasSavedData(true);
  }, []);

  const startDailyMode = useCallback(() => {
    audioEngine.playClick();
    if (!audioEngine.isMuted()) {
      audioEngine.startBgm();
    }
    const sanitized = sanitizeWarungName(warungNameInput);
    const updatedSave: GameSaveState = {
      ...saveRef.current,
      warungName: sanitized,
    };
    setSave(updatedSave);
    persistSaveToStorage(updatedSave);

    const weather = getWeatherForDay(updatedSave.day);
    setMode('harian');
    setCustomerIndex(0);
    setDayRecords([]);
    setPlatedItems([]);
    setServingOptions(DEFAULT_SERVING_OPTIONS);
    setEvaluation(null);
    setProgressFeedback(null);
    setIsNotebookOpen(false);
    setActiveCategory('karbo');
    setActiveWorkspace('etalase');
    const resetSlots = createInitialKitchenSlots();
    kitchenSlotsRef.current = resetSlots;
    setKitchenSlots(resetSlots);
    setRawTray([]);
    setKitchenNotice(null);
    setCurrentOrder(
      generateCustomerOrder(
        updatedSave.day,
        updatedSave.unlockedRecipes,
        'harian',
        0,
        weather,
        Math.random,
        updatedSave.unlockedSecretRecipes
      )
    );
    setScreen('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [warungNameInput]);

  const startEndlessMode = useCallback(() => {
    if (!isZenModeUnlocked(saveRef.current)) return;
    audioEngine.playClick();
    if (!audioEngine.isMuted()) {
      audioEngine.startBgm();
    }
    const sanitized = sanitizeWarungName(warungNameInput);
    const updatedSave: GameSaveState = {
      ...saveRef.current,
      warungName: sanitized,
    };
    setSave(updatedSave);
    persistSaveToStorage(updatedSave);

    const weather = getWeatherForEndless(0);
    setMode('endless');
    setCustomerIndex(0);
    setEndlessServed(0);
    setEndlessBalance(0);
    setDayRecords([]);
    setPlatedItems([]);
    setServingOptions(DEFAULT_SERVING_OPTIONS);
    setEvaluation(null);
    setProgressFeedback(null);
    setIsNotebookOpen(false);
    setActiveCategory('karbo');
    setActiveWorkspace('etalase');
    setEndlessAutoStock(true);
    const resetSlots = createInitialKitchenSlots();
    kitchenSlotsRef.current = resetSlots;
    setKitchenSlots(resetSlots);
    setRawTray([]);
    setKitchenNotice(null);
    setCurrentOrder(
      generateCustomerOrder(
        3,
        ALL_RECIPE_IDS,
        'endless',
        0,
        weather,
        Math.random,
        updatedSave.unlockedSecretRecipes
      )
    );
    setScreen('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [warungNameInput]);

  // Keyboard Enter/Space to start on Title screen
  useEffect(() => {
    if (screen !== 'title') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (
          e.target instanceof HTMLElement &&
          (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT')
        ) {
          return;
        }
        e.preventDefault();
        startDailyMode();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen, startDailyMode]);

  const handleToggleMute = useCallback(() => {
    const nextMuted = audioEngine.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.playClick();
    }
  }, []);

  const handleResetSave = useCallback(() => {
    audioEngine.playClick();
    clearSaveInStorage();
    const fresh = createDefaultSave(warungNameInput);
    setSave(fresh);
    setHasSavedData(false);
  }, [warungNameInput]);

  const handleSelectCategory = useCallback((cat: CategoryId) => {
    audioEngine.playClick();
    setActiveCategory(cat);
  }, []);

  const handleToggleIngredient = useCallback(
    (id: MenuItemId) => {
      if (evaluation) return;
      const item = MENU_BY_ID[id];
      if (!item) return;

      const useStockLimits = mode === 'harian' || !endlessAutoStock;
      setPlatedItems((prev) => {
        if (prev.includes(id)) {
          audioEngine.playClick();
          return prev.filter((p) => p !== id);
        }
        if (
          useStockLimits &&
          item.cookingStation !== 'instan' &&
          (saveRef.current.itemStock[id] ?? 0) <= 0
        ) {
          audioEngine.playSoftMiss();
          return prev;
        }
        audioEngine.playIngredientSound(item.soundKind);
        return [...prev, id];
      });
    },
    [evaluation, mode, endlessAutoStock]
  );

  const handleRemoveItem = useCallback(
    (id: MenuItemId) => {
      if (evaluation) return;
      audioEngine.playClick();
      setPlatedItems((prev) => prev.filter((p) => p !== id));
    },
    [evaluation]
  );

  const handleResetPlate = useCallback(() => {
    if (evaluation) return;
    audioEngine.playClick();
    setPlatedItems([]);
    setServingOptions(DEFAULT_SERVING_OPTIONS);
  }, [evaluation]);

  const handleChangeSoupStyle = useCallback(
    (soupStyle: SoupStyle) => {
      if (evaluation) return;
      audioEngine.playClick();
      setServingOptions((prev) => ({ ...prev, soupStyle }));
    },
    [evaluation]
  );

  const handleChangeIceLevel = useCallback(
    (iceLevel: IceLevel) => {
      if (evaluation) return;
      audioEngine.playClick();
      setServingOptions((prev) => ({ ...prev, iceLevel }));
    },
    [evaluation]
  );

  const handleChangeSweetness = useCallback(
    (sweetness: SweetnessLevel) => {
      if (evaluation) return;
      audioEngine.playClick();
      setServingOptions((prev) => ({ ...prev, sweetness }));
    },
    [evaluation]
  );

  // Dapur Masak Interactive Handlers
  const handleStartCook = useCallback(
    (station: CookingStationId, itemId: MenuItemId) => {
      if (kitchenSlotsRef.current[station].itemId !== null) return;
      if (station === 'goreng') audioEngine.playFrySizzle();
      else if (station === 'rebus') audioEngine.playBoilingBubbles();
      else if (station === 'tumis') audioEngine.playSpatulaStir();
      else audioEngine.playClick();

      const next = startCookingInSlot(kitchenSlotsRef.current, station, itemId);
      kitchenSlotsRef.current = next;
      setKitchenSlots(next);
      setKitchenNotice(`Mulai memasak ${MENU_BY_ID[itemId].name}...`);
    },
    []
  );

  const handleStirTumis = useCallback(() => {
    const res = stirTumisSlot(kitchenSlotsRef.current);
    kitchenSlotsRef.current = res.slots;
    setKitchenSlots(res.slots);
    audioEngine.playSpatulaStir();
    if (res.reachedMatang) {
      audioEngine.playKitchenDing();
      setKitchenNotice('Tumisan sudah matang harum! Segera angkat ke Etalase.');
    } else if (res.burned) {
      audioEngine.playBurntSizzle();
      setKitchenNotice('Waduh, tumisan kegosongan! Buang ke tempat sampah ya.');
    }
  }, []);

  const handlePoundCobek = useCallback(() => {
    const res = poundCobekSlot(kitchenSlotsRef.current);
    kitchenSlotsRef.current = res.slots;
    setKitchenSlots(res.slots);
    audioEngine.playMortarPound();
    if (res.reachedMatang) {
      audioEngine.playKitchenDing();
      setKitchenNotice('Sambal sudah halus merata! Siap diangkat (+4 porsi).');
    }
  }, []);

  const handleLiftFromSlot = useCallback((station: CookingStationId) => {
    const res = liftFromSlot(kitchenSlotsRef.current, station);
    if (res.outcome === 'empty' || !res.itemId) return;

    if (res.outcome === 'gosong') {
      audioEngine.playSoftMiss();
      setKitchenNotice(
        `${MENU_BY_ID[res.itemId].name} sudah gosong! Buang ke Tempat Sampah.`
      );
      return;
    }

    kitchenSlotsRef.current = res.slots;
    setKitchenSlots(res.slots);

    if (res.outcome === 'mentah') {
      audioEngine.playSoftMiss();
      const rawEntry: RawTrayItem = {
        id: `raw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        itemId: res.itemId,
        progress: res.progress,
        station,
      };
      setRawTray((prev) => [...prev, rawEntry]);
      setKitchenNotice(
        `Masih mentah! Belum bisa disajikan — ${MENU_BY_ID[res.itemId].name} ditaruh di Baki Mentah.`
      );
      return;
    }

    // outcome === 'matang' -> add +4 portions to Etalase & mark Freshly Cooked
    audioEngine.playCoin();
    const liftedItemId = res.itemId;
    const item = MENU_BY_ID[liftedItemId];
    setSave((prev) => {
      const updatedStock: GameSaveState['itemStock'] = {
        ...prev.itemStock,
        [liftedItemId]: Math.min(
          99,
          (prev.itemStock[liftedItemId] ?? 0) + COOK_BATCH_YIELD
        ),
      };
      const updatedSave: GameSaveState = { ...prev, itemStock: updatedStock };
      persistSaveToStorage(updatedSave);
      return updatedSave;
    });
    setFreshlyCookedItems((prev) =>
      prev.includes(liftedItemId) ? prev : [...prev, liftedItemId]
    );
    setKitchenNotice(
      `${item.name} matang sempurna! +${COOK_BATCH_YIELD} porsi masuk ke Etalase (Bonus Freshly Cooked siap).`
    );
  }, []);

  const handleDiscardBurnt = useCallback(
    (station: CookingStationId) => {
      const res = discardBurntFromSlot(kitchenSlotsRef.current, station, mode);
      if (!res.discardedItemId) return;
      audioEngine.playTrashBin();
      kitchenSlotsRef.current = res.slots;
      setKitchenSlots(res.slots);

      if (res.wasteCost > 0) {
        setSave((prev) => {
          const updatedSave: GameSaveState = {
            ...prev,
            balance: prev.balance - res.wasteCost,
          };
          persistSaveToStorage(updatedSave);
          return updatedSave;
        });
        setKitchenNotice(
          `${MENU_BY_ID[res.discardedItemId].name} gosong dibuang ke Tempat Sampah (rugi bahan ${formatRupiah(res.wasteCost)}).`
        );
      } else {
        setKitchenNotice(
          `${MENU_BY_ID[res.discardedItemId].name} gosong dibuang ke Tempat Sampah.`
        );
      }
    },
    [mode]
  );

  const handleReCookRawTray = useCallback(
    (rawId: string) => {
      const entry = rawTray.find((r) => r.id === rawId);
      if (!entry) return;
      if (kitchenSlotsRef.current[entry.station].itemId !== null) {
        audioEngine.playSoftMiss();
        setKitchenNotice(
          'Stasiun masih dipakai! Kosongkan dulu untuk masak ulang.'
        );
        return;
      }
      audioEngine.playClick();
      const next = startCookingInSlot(
        kitchenSlotsRef.current,
        entry.station,
        entry.itemId,
        entry.progress
      );
      kitchenSlotsRef.current = next;
      setKitchenSlots(next);
      setRawTray((prev) => prev.filter((r) => r.id !== rawId));
      setKitchenNotice(
        `Melanjutkan masak ${MENU_BY_ID[entry.itemId].name}...`
      );
    },
    [rawTray]
  );

  const handleDiscardRawTray = useCallback((rawId: string) => {
    audioEngine.playTrashBin();
    setRawTray((prev) => prev.filter((r) => r.id !== rawId));
    setKitchenNotice('Bahan mentah dibuang ke Tempat Sampah.');
  }, []);

  const handleServeOrder = useCallback(() => {
    if (evaluation || platedItems.length === 0) return;

    const currentSave = saveRef.current;
    const useStockLimits = mode === 'harian' || !endlessAutoStock;
    const upgradesForEval =
      mode === 'harian' ? currentSave.unlockedUpgrades : [];
    const freshToUse = useStockLimits ? freshlyCookedItems : [];

    const result = evaluateOrder(
      currentOrder.items,
      platedItems,
      upgradesForEval,
      currentOrder.requestedPrefs,
      servingOptions,
      freshToUse
    );
    setEvaluation(result);

    if (result.tier === 'salah') {
      audioEngine.playSoftMiss();
    } else {
      audioEngine.playCoin();
    }

    const netDelta =
      mode === 'harian' ? result.totalPaid - result.ingredientCost : 0;
    const progress = applyServedProgress(
      currentSave,
      currentOrder,
      result,
      activeWeather,
      netDelta
    );

    const nextStock = useStockLimits
      ? consumeStockForOrder(progress.save.itemStock, platedItems)
      : progress.save.itemStock;

    const finalSave: GameSaveState = {
      ...progress.save,
      itemStock: nextStock,
    };

    if (useStockLimits) {
      setFreshlyCookedItems((prev) =>
        prev.filter((id) => (nextStock[id] ?? 0) > 0)
      );
    }

    setSave(finalSave);
    setHasSavedData(true);
    persistSaveToStorage(finalSave);
    setProgressFeedback({
      vipHeartUp: progress.vipHeartUp,
      newAchievements: progress.newAchievements,
    });

    if (mode === 'harian') {
      const record: ServedRecord = {
        orderId: currentOrder.id,
        customerName: currentOrder.customer.name,
        tier: result.tier,
        baseRevenue: result.baseRevenue,
        ingredientCost: result.ingredientCost,
        tipAmount: result.tipAmount,
        totalPaid: result.totalPaid,
      };
      setDayRecords((prev) => [...prev, record]);
    } else {
      setEndlessServed((c) => c + 1);
      setEndlessBalance((b) => b + result.totalPaid);
    }
  }, [
    evaluation,
    platedItems,
    mode,
    endlessAutoStock,
    freshlyCookedItems,
    currentOrder,
    servingOptions,
    activeWeather,
  ]);

  const customerQuota = getCustomersQuotaForDay(save.day);
  const isLastCustomerOfDay =
    mode === 'harian' && customerIndex + 1 >= customerQuota;

  const handleNextCustomer = useCallback(() => {
    audioEngine.playClick();
    const currentSave = saveRef.current;
    if (mode === 'harian' && isLastCustomerOfDay) {
      const summary = calculateDailySummary(currentSave.day, dayRecords);
      setDailySummary(summary);
      setShopNotice(null);
      const nextDaySave: GameSaveState = {
        ...currentSave,
        day: currentSave.day + 1,
      };
      setSave(nextDaySave);
      setHasSavedData(true);
      persistSaveToStorage(nextDaySave);
      setScreen('summary');
      return;
    }

    const nextIdx = customerIndex + 1;
    const nextWeather =
      mode === 'harian'
        ? getWeatherForDay(currentSave.day)
        : getWeatherForEndless(endlessServed);

    setCustomerIndex(nextIdx);
    setPlatedItems([]);
    setServingOptions(DEFAULT_SERVING_OPTIONS);
    setEvaluation(null);
    setProgressFeedback(null);
    setCurrentOrder(
      generateCustomerOrder(
        mode === 'harian' ? currentSave.day : 3,
        mode === 'harian' ? currentSave.unlockedRecipes : ALL_RECIPE_IDS,
        mode,
        nextIdx,
        nextWeather,
        Math.random,
        currentSave.unlockedSecretRecipes
      )
    );
  }, [mode, isLastCustomerOfDay, dayRecords, customerIndex, endlessServed]);

  const handleBuyRecipe = useCallback((id: MenuItemId) => {
    const res = purchaseRecipe(saveRef.current, id);
    if (res.ok) {
      audioEngine.playCoin();
      setSave(res.save);
      persistSaveToStorage(res.save);
    } else {
      audioEngine.playSoftMiss();
    }
    setShopNotice(res.message);
  }, []);

  const handleBuyUpgrade = useCallback((id: UpgradeId) => {
    const res = purchaseUpgrade(saveRef.current, id);
    if (res.ok) {
      audioEngine.playCoin();
      setSave(res.save);
      persistSaveToStorage(res.save);
    } else {
      audioEngine.playSoftMiss();
    }
    setShopNotice(res.message);
  }, []);

  const handleStartNextDay = useCallback(() => {
    audioEngine.playClick();
    const currentSave = saveRef.current;
    const nextWeather = getWeatherForDay(currentSave.day);
    setCustomerIndex(0);
    setDayRecords([]);
    setPlatedItems([]);
    setServingOptions(DEFAULT_SERVING_OPTIONS);
    setEvaluation(null);
    setProgressFeedback(null);
    setActiveCategory('karbo');
    setActiveWorkspace('etalase');
    const resetSlots = createInitialKitchenSlots();
    kitchenSlotsRef.current = resetSlots;
    setKitchenSlots(resetSlots);
    setRawTray([]);
    setKitchenNotice(null);
    setCurrentOrder(
      generateCustomerOrder(
        currentSave.day,
        currentSave.unlockedRecipes,
        'harian',
        0,
        nextWeather,
        Math.random,
        currentSave.unlockedSecretRecipes
      )
    );
    setScreen('playing');
  }, []);

  const handleExitToMenu = useCallback(() => {
    audioEngine.playClick();
    audioEngine.stopAll();
    setIsNotebookOpen(false);
    setScreen('title');
  }, []);

  const handleChangeWorkspace = useCallback((ws: 'etalase' | 'dapur') => {
    audioEngine.playClick();
    setActiveWorkspace(ws);
  }, []);

  const handleBackToEtalase = useCallback(() => {
    audioEngine.playClick();
    setActiveWorkspace('etalase');
  }, []);

  const handleOpenKitchen = useCallback(() => {
    audioEngine.playClick();
    setActiveWorkspace('dapur');
  }, []);

  const handleToggleEndlessAutoStock = useCallback(() => {
    audioEngine.playClick();
    setEndlessAutoStock((prev) => !prev);
  }, []);

  const handleOpenNotebook = useCallback(() => {
    audioEngine.playClick();
    setIsNotebookOpen(true);
  }, []);

  const activeUpgrades = useMemo(
    () => (mode === 'harian' ? save.unlockedUpgrades : ZEN_ALL_UPGRADES),
    [mode, save.unlockedUpgrades]
  );

  const kitchenUnlockedRecipes = useMemo(
    () => (mode === 'harian' ? save.unlockedRecipes : ALL_RECIPE_IDS),
    [mode, save.unlockedRecipes]
  );

  if (screen === 'title') {
    return (
      <TitleScreen
        save={save}
        warungNameInput={warungNameInput}
        hasSavedData={hasSavedData}
        muted={muted}
        onChangeWarungName={handleChangeWarungName}
        onStartDaily={startDailyMode}
        onStartEndless={startEndlessMode}
        onActivateZenCheat={handleActivateZenCheat}
        onResetSave={handleResetSave}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (screen === 'summary' && dailySummary) {
    return (
      <DailySummaryModal
        summary={dailySummary}
        save={save}
        shopNotice={shopNotice}
        onBuyRecipe={handleBuyRecipe}
        onBuyUpgrade={handleBuyUpgrade}
        onStartNextDay={handleStartNextDay}
        onReturnTitle={handleExitToMenu}
      />
    );
  }

  const mood: CustomerMood = evaluation ? evaluation.tier : 'neutral';

  return (
    <main className="min-h-screen w-full bg-[#24140b] px-3 py-2.5 md:px-5 md:py-3 flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto space-y-2 lg:space-y-2.5">
        <GameCounter
          warungName={save.warungName}
          mode={mode}
          day={save.day}
          weather={activeWeather}
          customerNumber={customerIndex + 1}
          customerQuota={customerQuota}
          endlessServed={endlessServed}
          balance={mode === 'harian' ? save.balance : endlessBalance}
          order={currentOrder}
          vipHearts={save.vipHearts}
          mood={mood}
          reactionDialogue={evaluation ? evaluation.reactionDialogue : null}
          upgrades={activeUpgrades}
          muted={muted}
          activeWorkspace={activeWorkspace}
          kitchenSlots={kitchenSlots}
          endlessAutoStock={endlessAutoStock}
          onChangeWorkspace={handleChangeWorkspace}
          onToggleEndlessAutoStock={handleToggleEndlessAutoStock}
          onOpenNotebook={handleOpenNotebook}
          onToggleMute={handleToggleMute}
          onExitToMenu={handleExitToMenu}
        />

        {activeWorkspace === 'dapur' ? (
          <KitchenPanel
            mode={mode}
            unlockedRecipes={kitchenUnlockedRecipes}
            itemStock={save.itemStock}
            kitchenSlots={kitchenSlots}
            rawTray={rawTray}
            kitchenNotice={kitchenNotice}
            onStartCook={handleStartCook}
            onStirTumis={handleStirTumis}
            onPoundCobek={handlePoundCobek}
            onLiftFromSlot={handleLiftFromSlot}
            onDiscardBurnt={handleDiscardBurnt}
            onReCookRawTray={handleReCookRawTray}
            onDiscardRawTray={handleDiscardRawTray}
            onBackToEtalase={handleBackToEtalase}
          />
        ) : (
          <>
            <PlatingStation
              platedItems={platedItems}
              servingOptions={servingOptions}
              evaluation={evaluation}
              progressFeedback={progressFeedback}
              isLastCustomerOfDay={isLastCustomerOfDay}
              onChangeSoupStyle={handleChangeSoupStyle}
              onChangeIceLevel={handleChangeIceLevel}
              onChangeSweetness={handleChangeSweetness}
              onRemoveItem={handleRemoveItem}
              onResetPlate={handleResetPlate}
              onServeOrder={handleServeOrder}
              onNextCustomer={handleNextCustomer}
            />

            <EtalasePanel
              activeCategory={activeCategory}
              mode={mode}
              unlockedRecipes={save.unlockedRecipes}
              platedItems={platedItems}
              itemStock={save.itemStock}
              freshlyCookedItems={freshlyCookedItems}
              endlessAutoStock={endlessAutoStock}
              disabled={Boolean(evaluation)}
              onSelectCategory={handleSelectCategory}
              onToggleIngredient={handleToggleIngredient}
              onOpenKitchen={handleOpenKitchen}
            />
          </>
        )}
      </div>

      {isNotebookOpen && (
        <NotebookModal
          save={save}
          mode={mode}
          onClose={() => {
            audioEngine.playClick();
            setIsNotebookOpen(false);
          }}
        />
      )}
    </main>
  );
}
