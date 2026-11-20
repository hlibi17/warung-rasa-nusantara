import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACHIEVEMENTS,
  ALL_RECIPE_IDS,
  CATEGORY_TABS,
  CUSTOMERS,
  DEFAULT_UNLOCKED_RECIPES,
  MENU_BY_ID,
  MENU_ITEMS,
  SECRET_RECIPES,
  VIP_PROFILES,
} from './data';
import {
  advanceKitchenSlots,
  applyServedProgress,
  calculateDailySummary,
  COBEK_MAX_GRINDS,
  consumeStockForOrder,
  createDefaultItemStock,
  createDefaultSave,
  createInitialKitchenSlots,
  DEFAULT_WARUNG_NAME,
  discardBurntFromSlot,
  evaluateOrder,
  formatRupiah,
  FRESHLY_COOKED_BONUS_PER_ITEM,
  generateCustomerOrder,
  getAvailableRecipes,
  getCookingStatus,
  getWeatherForDay,
  getWeatherForEndless,
  isApproachingBurn,
  isZenModeUnlocked,
  liftFromSlot,
  ORDER_DIALOGUE_TEMPLATES,
  poundCobekSlot,
  purchaseRecipe,
  purchaseUpgrade,
  sanitizeWarungName,
  startCookingInSlot,
  stirTumisSlot,
  unlockZenModeViaCheat,
} from './rules';

test('catalog contains 37 menu items across 5 categories, 20 customers (8 VIP + 12 Regular), 16 secret recipes, and 40+ dialogue templates', () => {
  assert.equal(CATEGORY_TABS.length, 5);
  assert.equal(MENU_ITEMS.length, 37);
  assert.equal(
    MENU_ITEMS.filter((m) => m.category === 'karbo').length,
    4
  );
  assert.equal(
    MENU_ITEMS.filter((m) => m.category === 'lauk_utama').length,
    9
  );
  assert.equal(
    MENU_ITEMS.filter((m) => m.category === 'lauk_pendamping').length,
    8
  );
  assert.equal(
    MENU_ITEMS.filter((m) => m.category === 'sayur_sambal').length,
    9
  );
  assert.equal(
    MENU_ITEMS.filter((m) => m.category === 'minuman').length,
    7
  );

  assert.equal(CUSTOMERS.length, 20);
  assert.equal(CUSTOMERS.filter((c) => c.isVip).length, 8);
  assert.equal(CUSTOMERS.filter((c) => !c.isVip).length, 12);
  assert.equal(VIP_PROFILES.length, 8);
  assert.equal(SECRET_RECIPES.length, 16);
  assert.equal(ACHIEVEMENTS.length, 8);

  const totalTemplates = Object.values(ORDER_DIALOGUE_TEMPLATES).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  assert.ok(
    totalTemplates >= 40,
    `Expected >= 40 order dialogue templates, got ${totalTemplates}`
  );
});

test('warung name sanitization trims, caps length, and falls back to default', () => {
  assert.equal(sanitizeWarungName(''), DEFAULT_WARUNG_NAME);
  assert.equal(sanitizeWarungName('   '), DEFAULT_WARUNG_NAME);
  assert.equal(sanitizeWarungName('  Warteg   Mbak Yanti  '), 'WARTEG MBAK YANTI');
  assert.equal(sanitizeWarungName('A'.repeat(40)).length, 28);
});

test('weather cycles cleanly across days and endless customers', () => {
  assert.equal(getWeatherForDay(1), 'pagi_cerah');
  assert.equal(getWeatherForDay(2), 'sore_senja');
  assert.equal(getWeatherForDay(3), 'hujan_rintik');
  assert.equal(getWeatherForDay(4), 'pagi_cerah');

  assert.equal(getWeatherForEndless(0), 'pagi_cerah');
  assert.equal(getWeatherForEndless(3), 'sore_senja');
  assert.equal(getWeatherForEndless(6), 'hujan_rintik');
});

test('order generation respects locked recipes in Mode Harian and supports all 37 items + porsi_ekstra in Mode Endless', () => {
  const lockedIds = MENU_ITEMS.filter((m) => !m.defaultUnlocked).map((m) => m.id);
  const lockedSet = new Set(lockedIds);
  assert.equal(lockedSet.size, 21);

  for (let i = 0; i < 60; i++) {
    const order = generateCustomerOrder(
      1,
      DEFAULT_UNLOCKED_RECIPES,
      'harian',
      i,
      'pagi_cerah',
      () => ((i * 0.137 + 0.05) % 1)
    );
    assert.ok(order.items.length >= 2);
    for (const id of order.items) {
      assert.equal(lockedSet.has(id), false, `Locked item ${id} must not appear on Day 1`);
    }
  }

  const endlessAvailable = getAvailableRecipes(DEFAULT_UNLOCKED_RECIPES, 'endless');
  assert.equal(endlessAvailable.length, 37);
  assert.equal(endlessAvailable.length, ALL_RECIPE_IDS.length);

  // Sample many Mode Endless orders and verify extra-portion & diverse customers appear
  let sawExtraPortion = false;
  const seenCustomers = new Set<string>();
  for (let i = 0; i < 120; i++) {
    const order = generateCustomerOrder(
      3,
      ALL_RECIPE_IDS,
      'endless',
      i,
      i % 3 === 0 ? 'hujan_rintik' : 'pagi_cerah',
      () => ((i * 0.293 + 0.07) % 1)
    );
    seenCustomers.add(order.customer.id);
    if (order.patternType === 'porsi_ekstra') {
      sawExtraPortion = true;
      const laukCount = order.items.filter(
        (id) =>
          MENU_BY_ID[id].category === 'lauk_utama' ||
          MENU_BY_ID[id].category === 'lauk_pendamping'
      ).length;
      assert.ok(laukCount >= 2, 'Extra portion order must include >= 2 main/side dishes');
    }
  }
  assert.ok(sawExtraPortion, 'Expected porsi_ekstra orders to be generated');
  assert.ok(seenCustomers.size >= 12, `Expected diverse customer rotation, saw ${seenCustomers.size}`);
});

test('VIP heart progression unlocks secret recipes at 3 and 5 hearts for Phase 3 VIPs and awards achievements', () => {
  let save = createDefaultSave();
  assert.equal(Object.keys(save.vipHearts).length, 8);

  const riko = CUSTOMERS.find((c) => c.id === 'riko')!;
  const order = {
    id: 'test-riko-1',
    customer: riko,
    items: ['nasi_putih', 'tempe_orek', 'sambal_matah', 'es_teh'] as const,
    requestedPrefs: {},
    patternType: 'langsung' as const,
    isRiddle: false,
    dialogue: 'Test',
    hintText: 'Test',
  };
  const perfectEval = evaluateOrder(
    [...order.items],
    [...order.items],
    [],
    {},
    { soupStyle: 'pisah', iceLevel: 'normal', sweetness: 'manis' }
  );

  // Serve #1: 1 -> 2 hearts, unlocks Pelanggan Pertama
  const res1 = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    perfectEval,
    'pagi_cerah',
    15000
  );
  save = res1.save;
  assert.equal(save.vipHearts.riko, 2);
  assert.ok(save.unlockedAchievements.includes('pelanggan_pertama'));
  assert.equal(res1.vipHeartUp?.unlockedSecretRecipe, undefined);

  // Serve #2: 2 -> 3 hearts, unlocks Kombo Tanggal Tua & Sahabat Anak Kos
  const res2 = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    perfectEval,
    'pagi_cerah',
    15000
  );
  save = res2.save;
  assert.equal(save.vipHearts.riko, 3);
  assert.equal(res2.vipHeartUp?.unlockedSecretRecipe?.id, 'kombo_tanggal_tua');
  assert.ok(save.unlockedSecretRecipes.includes('kombo_tanggal_tua'));
  assert.ok(save.unlockedAchievements.includes('sahabat_anak_kos'));

  // Serve #3 and #4: 3 -> 4 -> 5 hearts, unlocks Paket Anak Kos Spesial & Keluarga Warung
  save = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    perfectEval,
    'pagi_cerah',
    15000
  ).save;
  const res4 = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    perfectEval,
    'pagi_cerah',
    15000
  );
  save = res4.save;
  assert.equal(save.vipHearts.riko, 5);
  assert.equal(res4.vipHeartUp?.unlockedSecretRecipe?.id, 'paket_anak_kos_spesial');
  assert.ok(save.unlockedAchievements.includes('keluarga_warung'));

  // Serve #5 with sambal_matah -> unlocks Pecinta Pedas (5 spicy items served)
  const res5 = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    perfectEval,
    'pagi_cerah',
    15000
  );
  assert.ok(res5.save.unlockedAchievements.includes('pecinta_pedas'));

  // Verify new VIP Koh Hendra unlocks Pesmol Sultan at 3 hearts
  const kohHendra = CUSTOMERS.find((c) => c.id === 'koh_hendra')!;
  const kohOrder = {
    id: 'test-koh-1',
    customer: kohHendra,
    items: ['nasi_kuning', 'ikan_pesmol', 'sambal_matah', 'es_jeruk'] as const,
    requestedPrefs: {},
    patternType: 'langsung' as const,
    isRiddle: false,
    dialogue: 'Test',
    hintText: 'Test',
  };
  const kohEval = evaluateOrder([...kohOrder.items], [...kohOrder.items], []);
  let kohSave = applyServedProgress(
    save,
    { ...kohOrder, items: [...kohOrder.items] },
    kohEval,
    'pagi_cerah',
    20000
  ).save;
  const kohRes2 = applyServedProgress(
    kohSave,
    { ...kohOrder, items: [...kohOrder.items] },
    kohEval,
    'pagi_cerah',
    20000
  );
  assert.equal(kohRes2.save.vipHearts.koh_hendra, 3);
  assert.equal(kohRes2.vipHeartUp?.unlockedSecretRecipe?.id, 'pesmol_sultan');
});

test('Pak Darman night service unlocks Teman Jaga Malam achievement', () => {
  const save = createDefaultSave();
  const darman = CUSTOMERS.find((c) => c.id === 'pak_darman')!;
  const order = {
    id: 'darman-night',
    customer: darman,
    items: ['tahu_goreng', 'perkedel', 'wedang_jahe'] as const,
    requestedPrefs: {},
    patternType: 'cuaca' as const,
    isRiddle: false,
    dialogue: 'Test',
    hintText: 'Test',
  };
  const evalOk = evaluateOrder([...order.items], [...order.items], []);
  const res = applyServedProgress(
    save,
    { ...order, items: [...order.items] },
    evalOk,
    'hujan_rintik',
    10000
  );
  assert.ok(res.save.unlockedAchievements.includes('penjaga_malam'));
});

test('order evaluation handles new cold drinks, kuah siram, sempurna, kurang_tepat, and salah', () => {
  const perfect = evaluateOrder(
    ['nasi_kuning', 'kuah_gulai', 'es_sirup'],
    ['nasi_kuning', 'kuah_gulai', 'es_sirup'],
    ['rice_cooker'],
    { soupStyle: 'siram', iceLevel: 'tanpa_es', sweetness: 'tawar' },
    { soupStyle: 'siram', iceLevel: 'tanpa_es', sweetness: 'tawar' }
  );
  assert.equal(perfect.tier, 'sempurna');
  assert.ok(perfect.tipAmount >= 6500);

  const missedPref = evaluateOrder(
    ['nasi_putih', 'sayur_lodeh', 'es_cendol'],
    ['nasi_putih', 'sayur_lodeh', 'es_cendol'],
    [],
    { soupStyle: 'siram', iceLevel: 'tanpa_es' },
    { soupStyle: 'pisah', iceLevel: 'normal', sweetness: 'manis' }
  );
  assert.equal(missedPref.tier, 'kurang_tepat');
  assert.equal(missedPref.mismatchedPrefs.length, 2);

  const wrong = evaluateOrder(
    ['nasi_putih', 'ayam_goreng', 'es_teh'],
    ['tahu_goreng', 'kopi_hitam'],
    []
  );
  assert.equal(wrong.tier, 'salah');
  assert.equal(wrong.tipAmount, 0);
});

test('daily summary and shop purchases work accurately for new unlockable recipes', () => {
  const summary = calculateDailySummary(1, [
    {
      orderId: '1',
      customerName: 'Bang Jaka',
      tier: 'sempurna',
      baseRevenue: 21000,
      ingredientCost: 7000,
      tipAmount: 3000,
      totalPaid: 24000,
    },
  ]);
  assert.equal(summary.netProfit, 17000);

  const save = { ...createDefaultSave(), balance: 80000 };
  const okMendoan = purchaseRecipe(save, 'tempe_mendoan');
  assert.equal(okMendoan.ok, true);
  assert.equal(okMendoan.save.balance, 54000);

  const okEtalase = purchaseUpgrade(okMendoan.save, 'etalase_besar');
  assert.equal(okEtalase.ok, false);
  assert.equal(formatRupiah(35000), 'Rp 35.000');
});

test('all 37 menu items have valid cookingStation assignments across goreng, rebus, tumis, cobek, and instan', () => {
  const counts = { goreng: 0, rebus: 0, tumis: 0, cobek: 0, instan: 0 };
  for (const item of MENU_ITEMS) {
    counts[item.cookingStation] += 1;
  }
  assert.equal(counts.goreng, 9);
  assert.equal(counts.rebus, 8);
  assert.equal(counts.tumis, 4);
  assert.equal(counts.cobek, 3);
  assert.equal(counts.instan, 13);
});

test('Dapur Masak stations transition Mentah -> Matang -> Gosong, support Tumis stir & Cobek grinding, and enforce lift/trash rules', () => {
  let slots = createInitialKitchenSlots();
  slots = startCookingInSlot(slots, 'goreng', 'ayam_goreng');
  assert.equal(getCookingStatus(slots.goreng), 'mentah');

  // Early lift while mentah
  const early = liftFromSlot(slots, 'goreng');
  assert.equal(early.outcome, 'mentah');
  assert.equal(early.itemId, 'ayam_goreng');
  assert.equal(early.slots.goreng.itemId, null);

  // Resume from progress and cook into Matang (50-85%)
  slots = startCookingInSlot(early.slots, 'goreng', 'ayam_goreng', 25);
  const stepMatang = advanceKitchenSlots(slots, 6); // 25 + 5.2*6 = 56.2%
  slots = stepMatang.slots;
  assert.equal(getCookingStatus(slots.goreng), 'matang');
  assert.deepEqual(stepMatang.dingStations, ['goreng']);

  // Approaching burn warning (76-85%)
  const stepWarn = advanceKitchenSlots(slots, 4.5); // 56.2 + 23.4 = 79.6%
  slots = stepWarn.slots;
  assert.equal(isApproachingBurn(slots.goreng), true);
  assert.equal(getCookingStatus(slots.goreng), 'matang');

  // Lifting while Matang yields outcome 'matang'
  const liftedMatang = liftFromSlot(slots, 'goreng');
  assert.equal(liftedMatang.outcome, 'matang');
  assert.equal(liftedMatang.slots.goreng.itemId, null);

  // Letting rebus run past 85% enters Gosong and cannot be lifted, must be discarded
  slots = startCookingInSlot(liftedMatang.slots, 'rebus', 'sayur_sop', 48);
  const stepBurn = advanceKitchenSlots(slots, 10); // 48 + 45 = 93%
  slots = stepBurn.slots;
  assert.equal(getCookingStatus(slots.rebus), 'gosong');
  assert.deepEqual(stepBurn.burntStations, ['rebus']);
  const blockedLift = liftFromSlot(slots, 'rebus');
  assert.equal(blockedLift.outcome, 'gosong');

  const discardedHarian = discardBurntFromSlot(slots, 'rebus', 'harian');
  assert.equal(discardedHarian.discardedItemId, 'sayur_sop');
  assert.equal(
    discardedHarian.wasteCost,
    Math.round(MENU_BY_ID.sayur_sop.cost * 0.5)
  );
  assert.equal(discardedHarian.slots.rebus.itemId, null);

  const discardedEndless = discardBurntFromSlot(slots, 'rebus', 'endless');
  assert.equal(discardedEndless.wasteCost, 0);

  // Tumis stir boosts progress
  slots = startCookingInSlot(slots, 'tumis', 'tumis_kangkung');
  const stir1 = stirTumisSlot(slots);
  assert.equal(stir1.slots.tumis.progress, 14);
  assert.equal(stir1.slots.tumis.stirBoostCount, 1);

  // Cobek grinding never burns and reaches Matang at 5-6 grinds
  slots = startCookingInSlot(slots, 'cobek', 'sambal_terasi');
  for (let i = 1; i <= COBEK_MAX_GRINDS; i++) {
    const res = poundCobekSlot(slots);
    slots = res.slots;
    if (i < 5) {
      assert.equal(getCookingStatus(slots.cobek), 'mentah');
      assert.equal(res.reachedMatang, false);
    } else if (i === 5) {
      assert.equal(getCookingStatus(slots.cobek), 'matang');
      assert.equal(res.reachedMatang, true);
    } else {
      assert.equal(getCookingStatus(slots.cobek), 'matang');
      assert.equal(res.reachedMatang, false);
    }
  }
  // Advancing time does not burn Cobek
  const cobekAfterTime = advanceKitchenSlots(slots, 30);
  assert.equal(getCookingStatus(cobekAfterTime.slots.cobek), 'matang');
});

test('portion stock consumption and Freshly Cooked bonus tip work properly', () => {
  const stock = createDefaultItemStock();
  assert.equal(stock.ayam_goreng, 4);
  assert.equal(stock.nasi_putih, 99);

  const afterServe = consumeStockForOrder(stock, [
    'nasi_putih',
    'ayam_goreng',
    'sambal_terasi',
  ]);
  assert.equal(afterServe.nasi_putih, 99); // instan stays unlimited
  assert.equal(afterServe.ayam_goreng, 3);
  assert.equal(afterServe.sambal_terasi, 3);

  const evalFresh = evaluateOrder(
    ['nasi_putih', 'ayam_goreng', 'sambal_terasi'],
    ['nasi_putih', 'ayam_goreng', 'sambal_terasi'],
    [],
    {},
    { soupStyle: 'pisah', iceLevel: 'normal', sweetness: 'manis' },
    ['ayam_goreng', 'sambal_terasi']
  );
  assert.equal(
    evalFresh.freshlyCookedBonus,
    FRESHLY_COOKED_BONUS_PER_ITEM * 2
  );
  assert.equal(evalFresh.tipAmount, 3000 + FRESHLY_COOKED_BONUS_PER_ITEM * 2);
});

test('Mode Zen starts locked, unlocks automatically when all 37 menus are bought, and unlocks via hidden cheat', () => {
  const fresh = createDefaultSave();
  assert.equal(fresh.zenModeUnlocked, false);
  assert.equal(isZenModeUnlocked(fresh), false);

  const lockedItems = MENU_ITEMS.filter((m) => !m.defaultUnlocked);
  assert.equal(lockedItems.length, 21);

  let save = { ...fresh, balance: 5_000_000 };
  for (let i = 0; i < lockedItems.length - 1; i++) {
    const res = purchaseRecipe(save, lockedItems[i].id);
    assert.equal(res.ok, true);
    save = res.save;
    assert.equal(isZenModeUnlocked(save), false);
  }

  const finalRes = purchaseRecipe(save, lockedItems[lockedItems.length - 1].id);
  assert.equal(finalRes.ok, true);
  assert.equal(finalRes.save.unlockedRecipes.length, 37);
  assert.equal(finalRes.save.zenModeUnlocked, true);
  assert.equal(isZenModeUnlocked(finalRes.save), true);
  assert.match(finalRes.message, /Mode Zen/i);

  const cheated = unlockZenModeViaCheat(fresh);
  assert.equal(cheated.zenModeUnlocked, true);
  assert.equal(isZenModeUnlocked(cheated), true);
});


