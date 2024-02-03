import { DC } from "../constants";

export const BOSS_ENUM = {
  /** @type {0} */
  MILKYWAY: 0,
  /** @type {1} */
  TIMEWALL: 1
};

export const BossDatas = {
  [BOSS_ENUM.MILKYWAY]: {
    getName: () => "Milkyway Galaxy",
    checkCondition: () => window.player.galaxies >= 1 || checkBossEncountered(BOSS_ENUM.MILKYWAY),
    isDefeated: () => window.player.galaxies >= 2 || checkBossCompleted(BOSS_ENUM.MILKYWAY),
    calcAntimatterCap: () => 1e200,
    calcDamageMultiplier: () => {
      const t = window.player.lastUpdate - window.player.rogue.bossFightStartTimes[0];
      return DC.D1.add(t / 1000000);
    }
  },
  [BOSS_ENUM.TIMEWALL]: {
    getName: () => "The Time Wall",
    checkCondition: () => window.player.infinities.gte(1) || checkBossEncountered(BOSS_ENUM.TIMEWALL),
    isDefeated: () => window.player.challenge.normal.completedBits > 2 || checkBossCompleted(BOSS_ENUM.TIMEWALL)
  }
};

export function updateBoss(realDiff) {
  window.player.rogue.cutsceneTime += realDiff;
  checkBossConditions();
}

export function checkBossConditions() {
  if (
    !checkBossEncountered(BOSS_ENUM.MILKYWAY) &&
    window.player.galaxies >= 1
  ) enterBossFight(BOSS_ENUM.MILKYWAY);
}

/**
 * @returns {boolean}
 */
export function checkBossCompleted(id) {
  return window.player.rogue.bossCompleted[id];
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
export function checkBossEncountered(id) {
  return checkBossCompleted(id) || checkBossFighing(id);
}

export function enterBossFight(id) {
  playBossCutscene(id);
  window.player.rogue.bossFightings[id] = true;
  window.player.rogue.bossFightStartTimes[id] = player.lastUpdate;
}

export function playBossCutscene(id) {
  window.player.rogue.cutsceneId = id;
  window.player.rogue.cutsceneTime = 0;
}
