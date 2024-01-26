import { Currency } from "./currency";
import { DC } from "./constants";
import { GameUI } from "./ui";

export function rogueUpdate() {
  // Update hp & Check died
  Currency.maxHp.value = new Decimal(Currency.antimatter.value.add(1).log(10) / 10).max(Currency.maxHp.value);
  if (Currency.hp.value.lt(0.001)) {
    rogueDie();
  }

  // Unlocks
  if (
    !window.player.rogue.unlocks.hp &&
    window.player.dimensionBoosts >= 1
  ) window.player.rogue.unlocks.hp = true;
  if (
    !window.player.rogue.unlocks.quests &&
    window.player.dimensions.antimatter[1].amount.gte(1)
  ) window.player.rogue.unlocks.quests = true;
  if (
    !window.player.rogue.unlocks.items &&
    window.player.rogue.questCompleted.includes(true)
  ) {
    window.player.rogue.unlocks.items = true;
    Tab.rogue["rogue-items"].show();
  }

  window.player.rogue.itemsUnlocked[1001] = true;

  for (const [id, quest] of window.GameDatabase.rogue.quests) {
    if (window.player.rogue.questUnlocked[id] || !quest.isUnlocked()) continue;
    window.player.rogue.questUnlocked[id] = true;
  }

  // Debuff quest auto-complete
  for (const quest of window.GameDatabase.rogue.debuffQuests) {
    if (
      window.player.rogue.questCompleted[quest.id] ||
      quest.getProgress() < 1
    ) continue;
    window.player.rogue.questUnlocked[quest.id] = true;
    window.player.rogue.questCompleted[quest.id] = true;

    const item = window.GameDatabase.rogue.rollRewardTable(quest, 1, true)[0][1];
    const itemData = window.GameDatabase.rogue.items.get(item.id);
    grantItem(item);
    GameUI.notify.strike(`Got a new debuff card: ${itemData.nameStr(item.lv, item.props)}`);
  }
}

export function getXpRequirement() {
  const level = window.player.rogue.level;
  return DC.D1.add(0.25 + level / 50).pow(level).mul(10);
}

/**
 * @param {import("../core/secret-formula/rogue/items").RogueItem} item
 */
export function grantItem(item) {
  const itemData = window.GameDatabase.rogue.items.get(item.id);
  const type = itemData.type;
  if (type === "normal") {
    if (window.player.rogue.normalItems.length >= getInventorySize().normal) return false;
    const xpGain = item.lv ** 2;
    window.player.rogue.itemXps[itemData.id] += xpGain;
    window.player.rogue.normalItems.push(item);
    return true;
  }
  if (type === "debuff") {
    if (window.player.rogue.debuffItems.length >= getInventorySize().debuff) return false;
    window.player.rogue.debuffItems.push(item);
    return true;
  }
  if (type === "special") {
    if (window.player.rogue.specialItems.length >= getInventorySize().special) return false;
    window.player.rogue.specialItems.push(item);
    return true;
  }
  return false;
}

export function getInventorySize() {
  const sizes = {
    normal: 6,
    debuff: 40,
    special: 0
  };
  return sizes;
}

export function calcRogueDieRewards() {
  const rewards = {
    xp: Currency.maxHp.value,
    /** @type {number[]} */
    itemUnlocks: []
  };

  // Item Unlocks
  for (const [itemId, itemData] of window.GameDatabase.rogue.items) {
    if (
      window.player.rogue.itemsUnlocked[itemId] ||
      !itemData.isUnlocked()
    ) continue;
    rewards.itemUnlocks.push(itemId);
  }
  for (const item of window.player.rogue.debuffItems) {
    if (window.player.rogue.itemsUnlocked[item.id]) continue;
    rewards.itemUnlocks.push(item.id);
  }

  return rewards;
}

export function rogueDie() {
  window.player.rogue.dieCount++;
  GameUI.notify.error(`You died... #${window.player.rogue.dieCount}`);
  const rewards = calcRogueDieRewards();
  rogueReset();
  return rewards;
}

const nonResetAchievements = [22, 76];
export function rogueReset() {
  // Refer to https://github.com/toilet45/ADRedemption/blob/master/src/core/mending.js. Thank you royal!
  Tab.rogue["rogue-quests"].show();
  EventHub.dispatch(GAME_EVENT.ROGUE_DIE);

  for (const achievement of Achievements.all) {
    if (nonResetAchievements.includes(achievement.id)) continue;
    achievement.lock();
  }
  player.records.totalTimePlayed = player.records.realTimePlayed;

  window.player.rogue.seed = Math.floor(Math.random() * 2 ** 32);
  player.rogue.normalItems = [];
  player.rogue.debuffItems = [];
  player.rogue.specialItems = [];
  player.rogue.questCompleted.fill(false);

  const x = player.reality.glyphs.protectedRows;
  player.reality.glyphs.protectedRows = 0;
  for (let g = 0; g < 120; g++) {
    const glyph = Glyphs.inventory[g];
    if (glyph !== null && glyph.type !== "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
  }
  Glyphs.unequipAll(true);
  for (let h = 0; h < 120; h++) {
    const glyph = Glyphs.inventory[h];
    if (glyph !== null && glyph.type !== "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
  }
  player.reality.glyphs.protectedRows = x;

  player.blackHoleNegative = 1;
  player.isGameEnd = false;
  player.celestials.pelle.doomed = false;

  player.challenge = {
    normal: {
      current: 0,
      completedBits: 0,
      bestTimes: player.challenge.normal.bestTimes,
    },
    infinity: {
      current: 0,
      completedBits: 0,
      bestTimes: player.challenge.infinity.bestTimes,
    },
    eternity: {
      current: 0,
      unlocked: 0,
      requirementBits: 0,
    }
  };

  player.records.totalAntimatter = DC.E1;
  player.challenge.normal.bestTimes = Array.repeat(Decimal.pow10(Number.MAX_VALUE), 11);
  player.challenge.infinity.bestTimes = Array.repeat(Decimal.pow10(Number.MAX_VALUE), 8);

  player.celestials.teresa.pouredAmount = 0;
  player.celestials.teresa.unlockBits = 0;
  player.celestials.teresa.run = false;
  player.celestials.teresa.bestRunAM = DC.D1;
  player.celestials.teresa.bestAMSet = [];
  player.celestials.teresa.perkShop = Array.repeat(0, 5);
  player.celestials.teresa.lastRepeatedMachines = DC.D0;

  player.celestials.effarig.relicShards = 0;
  player.celestials.effarig.unlockBits = 0;
  player.celestials.effarig.run = false;

  player.celestials.enslaved.stored = 0;
  player.celestials.enslaved.storedReal = 0;
  player.celestials.enslaved.isAutoReleasing = false;
  player.celestials.enslaved.unlocks = [];
  player.celestials.enslaved.run = false;
  player.celestials.enslaved.completed = false;
  player.celestials.enslaved.tesseracts = 0;
  player.celestials.enslaved.hasSecretStudy = false;
  player.celestials.enslaved.progressBits = 0;

  let prevQuoteBits;
  prevQuoteBits = player.celestials.v.quoteBits;
  V.reset();
  V.updateTotalRunUnlocks();
  player.celestials.v.quoteBits = prevQuoteBits;

  prevQuoteBits = player.celestials.ra.quoteBits;
  Ra.reset();
  player.celestials.ra.quoteBits = prevQuoteBits;
  player.celestials.ra.petWithRemembrance = "";
  player.celestials.ra.alchemy = Array.from({ length: 21 }, () => ({ amount: 0, reaction: false }));
  player.celestials.ra.highestRefinementValue = {
    power: 0,
    infinity: 0,
    time: 0,
    replication: 0,
    dilation: 0,
    effarig: 0
  };
  player.celestials.ra.charged = new Set();

  prevQuoteBits = player.celestials.laitela.quoteBits;
  Laitela.reset(true);
  player.celestials.laitela.quoteBits = prevQuoteBits;

  player.celestials.pelle.upgrades.clear();
  player.celestials.pelle.remnants = 0;
  player.celestials.pelle.realityShards = DC.D0;
  player.celestials.pelle.records = {
    totalAntimatter: DC.D0,
    totalInfinityPoints: DC.D0,
    totalEternityPoints: DC.D0,
  };
  player.celestials.pelle.rebuyables.antimatterDimensionMult = 0;
  player.celestials.pelle.rebuyables.timeSpeedMult = 0;
  player.celestials.pelle.rebuyables.glyphLevels = 0;
  player.celestials.pelle.rebuyables.infConversion = 0;
  player.celestials.pelle.rebuyables.galaxyPower = 0;
  player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = 0;
  player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = 0;
  player.celestials.pelle.rebuyables.AntimatterMult = 0;
  player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = 0;
  player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = 0;
  player.celestials.pelle.rifts.vacuum.fill = DC.D0;
  player.celestials.pelle.rifts.vacuum.active = false;
  player.celestials.pelle.rifts.vacuum.reducedTo = 1;
  player.celestials.pelle.rifts.decay.fill = DC.D0;
  player.celestials.pelle.rifts.decay.active = false;
  player.celestials.pelle.rifts.decay.percentageSpent = 0;
  player.celestials.pelle.rifts.decay.reducedTo = 1;
  player.celestials.pelle.rifts.chaos.fill = 0;
  player.celestials.pelle.rifts.chaos.active = false;
  player.celestials.pelle.rifts.chaos.reducedTo = 1;
  player.celestials.pelle.rifts.recursion.fill = DC.D0;
  player.celestials.pelle.rifts.recursion.active = false;
  player.celestials.pelle.rifts.recursion.reducedTo = 1;
  player.celestials.pelle.rifts.paradox.fill = DC.D0;
  player.celestials.pelle.rifts.paradox.active = false;
  player.celestials.pelle.rifts.paradox.reducedTo = 1;
  player.celestials.pelle.progressBits = 0;
  player.celestials.pelle.galaxyGenerator.unlocked = false;
  player.celestials.pelle.galaxyGenerator.spentGalaxies = 0;
  player.celestials.pelle.galaxyGenerator.generatedGalaxies = 0;
  player.celestials.pelle.galaxyGenerator.phase = 0;
  player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
  player.celestials.pelle.collapsed.upgrades = false;
  player.celestials.pelle.collapsed.rifts = false;
  player.celestials.pelle.collapsed.galaxies = false;

  player.records.recentRealities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]
  );
  GameCache.averageRealTimePerEternity.invalidate();
  player.records.thisReality = {
    time: 0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    maxEP: DC.D0,
    bestEternitiesPerMs: DC.D0,
    maxReplicanti: DC.D0,
    maxDT: DC.D0,
    bestRSmin: 0,
    bestRSminVal: 0,
  };
  player.records.bestReality = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    glyphStrength: 0,
    RM: DC.D0,
    RMSet: [],
    RMmin: DC.D0,
    RMminSet: [],
    glyphLevel: 0,
    glyphLevelSet: [],
    bestEP: DC.D0,
    bestEPSet: [],
    speedSet: [],
    iMCapSet: [],
    laitelaSet: [],
  };
  player.reality.unlockedEC = 0;
  Perks.find(0).isBought = true;
  Perks.find(0).onPurchased();
  player.realities = 0;
  for (const perkId of [
    10, 12, 13, 14, 15, 16, 17, 30, 31, 40,
    41, 42, 43, 44, 45, 46, 51, 52, 53, 54,
    55, 56, 57, 60, 61, 62, 70, 71, 72, 73,
    80, 81, 82, 83, 100, 101, 102, 103, 104,
    105, 106, 201, 202, 203, 204, 205
  ]) {
    const perk = Perks.find(perkId);
    perk.isBought = false;
  }
  GameUI.update();
  player.reality.upgReqs = 1 << 18;
  player.reality.imaginaryUpgReqs = 0;
  player.reality.upgradeBits = 1 << 18;
  player.reality.imaginaryUpgradeBits = 0;
  player.reality.realityMachines = DC.D0;
  player.reality.reqLock.reality = 0;
  player.reality.reqLock.imaginary = 0;
  player.reality.imaginaryMachines = 0;
  player.reality.maxRM = DC.D0;
  player.reality.iMCap = 0;
  player.reality.glyphs.sac.power = 0;
  player.reality.glyphs.sac.infinity = 0;
  player.reality.glyphs.sac.replication = 0;
  player.reality.glyphs.sac.time = 0;
  player.reality.glyphs.sac.dilation = 0;
  player.reality.glyphs.sac.effarig = 0;
  player.reality.glyphs.sac.reality = 0;
  player.reality.glyphs.undo = [];
  player.reality.perkPoints = 0;
  for (let i = 1; i <= 5; i++) {
    player.reality.rebuyables[i] = 0;
  }
  for (let i = 1; i <= 10; i++) {
    player.reality.imaginaryRebuyables[i] = 0;
  }
  for (let i = 0; i < 2; i++) {
    player.blackHole[i].intervalUpgrades = 0;
    player.blackHole[i].powerUpgrades = 0;
    player.blackHole[i].durationUpgrades = 0;
    player.blackHole[i].phase = 0;
    player.blackHole[i].unlocked = false;
    player.blackHole[i].active = false;
    player.blackHole[i].activations = 0;
  }
  player.reality.achTimer = 0;

  resetEternityRuns();
  player.respec = false;
  player.infinitiesBanked = DC.D0;
  player.eternityUpgrades.clear();
  Currency.eternityPoints.reset();
  fullResetTimeDimensions();
  resetTimeDimensions();
  Currency.eternities.reset();
  Currency.timeShards.reset();
  Currency.timeTheorems.reset();
  player.records.bestEternity = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    bestEPminReality: DC.D0,
  };
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    11: 0,
    12: 0,
    13: 0
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();
  player.records.thisEternity = {
    time: 0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    bestIPMsWithoutMaxAll: DC.D0,
    bestEPmin: DC.D0,
    bestEPminVal: DC.D0,
    bestInfinitiesPerMs: DC.D0,
  };
  player.dilation.lastEP = DC.DM1;
  player.eternityUpgrades.clear();
  EternityUpgrade.epMult.reset();

  resetInfinityRuns();
  player.records.thisInfinity = {
    time: 0,
    realTime: 0,
    lastBuyTime: 0,
    maxAM: DC.D0,
    bestIPmin: DC.D0,
    bestIPminVal: DC.D0,
  };
  player.records.bestInfinity = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    bestIPminEternity: DC.D0,
    bestIPminReality: DC.D0,
  };
  Currency.infinityPoints.reset();
  InfinityDimensions.fullReset();
  Currency.infinities.reset();
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Replicanti.reset();
  InfinityChallenges.clearCompletions();
  playerInfinityUpgradesOnReset();
  player.IPMultPurchases = 0;

  Currency.antimatter.reset();
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.sacrificed = DC.D0;
  AntimatterDimensions.reset();
  resetTickspeed();

  for (const achievement of Achievements.all) {
    if (nonResetAchievements.includes(achievement.id)) continue;
    achievement.lock();
  }

  Glyphs.refreshActive();
  EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }
  Currency.maxHp.reset();
}
