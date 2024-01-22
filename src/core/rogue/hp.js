export function updateHp(realDiff) {
  const delta = getHpDelta().mul(realDiff / 1000);
  Currency.hp.add(delta);
}

export function getHpDelta() {
  const delta = getRogueEffect("hpDelta");
  return delta;
}
