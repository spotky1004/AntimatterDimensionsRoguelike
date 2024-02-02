export function updateHp(realDiff) {
  Currency.maxHp.value = new Decimal(Currency.antimatter.value.add(1).log(10) / 10).max(Currency.maxHp.value);
  const delta = getHpDelta().mul(realDiff / 1000);
  Currency.hp.add(delta);
}

export function getHpDelta() {
  const delta = getRogueEffect("hpDelta");
  return delta;
}
