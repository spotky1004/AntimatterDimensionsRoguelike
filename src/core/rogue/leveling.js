export function addRogueXp(value) {
  window.player.rogue.xp = window.player.rogue.xp.add(value);
}

export function getXpRequirement() {
  const level = window.player.rogue.level;
  return DC.D1.add(0.25 + level / 50).pow(level);
}
