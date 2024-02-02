export const BOSS_ENUM = {
  MILKYWAY_GALAXY: 0
};

export function updateBoss(realDiff) {
  window.player.rogue.cutsceneTime += realDiff;
}

export function checkBossConditions() {
  if (
    !checkBossEncountered(BOSS_ENUM.MILKYWAY_GALAXY) &&
    window.player.galaxies >= 1
  ) enterBossFight(BOSS_ENUM.MILKYWAY_GALAXY);
}

export function checkBossCompleted(id) {
  return window.player.rogue.bossCompleted[id];
}

export function checkBossFighing(id) {
  return window.player.rogue.bossFightings[id];
}

export function checkBossEncountered(id) {
  return checkBossCompleted(id) || checkBossFighing(id);
}

export function enterBossFight(id) {
  playBossCutscene(id);
  window.player.rogue.bossFightings[id] = true;
}

export function playBossCutscene(id) {
  window.player.rogue.cutsceneId = id;
  window.player.rogue.cutsceneTime = 0;
}
