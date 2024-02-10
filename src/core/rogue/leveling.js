import { DC } from "../constants";

export function updateLeveling() {
  const xpReq = getXpRequirement();
  if (window.player.rogue.xp.gte(xpReq)) {
    window.player.rogue.xp = window.player.rogue.xp.sub(xpReq);
    window.player.rogue.level++;

    const curLevel = window.player.rogue.level;
    GameUI.notify.success(`+ Level ${curLevel - 1} -> ${curLevel} +`);
  }
}

export function addRogueXp(value) {
  window.player.rogue.xp = window.player.rogue.xp.add(value);
}

export function getXpRequirement() {
  const level = window.player.rogue.level;
  return DC.D1.add(0.25 + level / 50).pow(level).add(level - 1);
}

export function getAllocatedLevelingPoint() {
  let sum = 0;
  for (const skillKey of window.GameDatabase.rogue.skillKeys) {
    sum += window.player.rogue.leveling.allocates[skillKey];
  }
  return sum;
}

export function getAvaiableLevelingPoint() {
  return window.player.rogue.level - getAllocatedLevelingPoint();
}

export function checkSkillTierUps() {
  /** @type {{ [K in import("../secret-formula/rogue/leveling").SkillNames]: boolean }} */
  const ups = {};
  for (const skillKey of window.GameDatabase.rogue.skillKeys) {
    /** @type {import("../secret-formula/rogue/leveling").SkillData} */
    const skillData = window.GameDatabase.rogue.skillDatas[skillKey];
    /** @type {number} */
    const curTier = window.player.rogue.leveling.tiers[skillKey];
    const maxTier = skillData.tiers.length - 1;

    let isUp = false;
    if (curTier <= maxTier && skillData.tiers[curTier + 1].checkReq()) {
      isUp = true;
    }
    ups[skillKey] = isUp;
  }
  return ups;
}

export function calculateRogueSkillEffects() {
  const effects = getDefaultRogueEffects();
  for (const skillKey of window.GameDatabase.rogue.skillKeys) {
    /** @type {import("../secret-formula/rogue/leveling").SkillData} */
    const skillData = window.GameDatabase.rogue.skillDatas[skillKey];
    const tier = window.player.rogue.leveling.tiers[skillKey];
    const allocated = window.player.rogue.leveling.allocates[skillKey];
    skillData.calcEffect(effects, tier, allocated);
  }
  return effects;
}
