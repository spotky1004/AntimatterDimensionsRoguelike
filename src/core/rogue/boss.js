import { DC } from "../constants";

const bossCount = 1;

export const BOSS_ENUM = {
  /** @type {0} */
  MILKYWAY: 0,
  /** @type {1} */
  TIMEWALL: 1
};

export const BossDatas = {
  [BOSS_ENUM.MILKYWAY]: {
    getName: () => "Milkyway Galaxy",
    getPrimaryColor: () => "#d381e6",
    checkCondition: () => window.player.galaxies >= 1 || checkBossEncountered(BOSS_ENUM.MILKYWAY),
    isDefeated: () => window.player.galaxies >= 2 || checkBossDefeated(BOSS_ENUM.MILKYWAY),
    calcAntimatterCap: () => 1e250,
    calcDamageMultiplier: () => {
      const t = window.player.lastUpdate - window.player.rogue.bossFightStartTimes[0];
      return DC.D1.add(t / 1000000);
    }
  },
  [BOSS_ENUM.TIMEWALL]: {
    getName: () => "The Time Wall",
    getPrimaryColor: () => "#f5ad42",
    checkCondition: () => window.player.infinities.gte(1) || checkBossEncountered(BOSS_ENUM.TIMEWALL),
    isDefeated: () => window.player.challenge.normal.completedBits > 2 || checkBossDefeated(BOSS_ENUM.TIMEWALL),
  }
};

export function updateBoss(realDiff) {
  window.player.rogue.cutsceneTime += realDiff;

  for (let i = 0; i < bossCount; i++) {
    if (
      BossDatas[i].isDefeated() ||
      !BossDatas[i].checkCondition() ||
      checkBossFighing(i)
    ) continue;
    enterBossFight(i);
  }

  for (let i = 0; i < bossCount; i++) {
    if (
      !checkBossFighing(i) ||
      !BossDatas[i].isDefeated()
    ) continue;
    defeatBoss(i);
  }
}

/**
 * @returns {boolean}
 */
export function checkBossFighing(id) {
  return window.player.rogue.bossFightings[id];
}

/**
 * @returns {boolean}
 */
export function checkBossDefeated(id) {
  return window.player.rogue.bossDefeated[id];
}

/**
 * @returns {boolean}
 */
export function checkBossEncountered(id) {
  return checkBossDefeated(id) || checkBossFighing(id);
}

export function enterBossFight(id) {
  playBossCutscene(id);
  window.player.rogue.bossFightings[id] = true;
  window.player.rogue.bossFightStartTimes[id] = player.lastUpdate;
}

export function defeatBoss(id) {
  Modal.bossDefeat.show({ bossId: id });
  window.player.rogue.bossFightings[id] = false;
  window.player.rogue.bossDefeated[id] = true;
}

export function playBossCutscene(id) {
  window.player.rogue.cutsceneId = id;
  window.player.rogue.cutsceneTime = 0;
}