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
  return DC.D1.add(0.25 + level / 50).pow(level);
}
