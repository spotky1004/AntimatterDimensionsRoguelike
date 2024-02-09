import { DC } from "../constants";

export function updateHp(realDiff) {
  Currency.maxHp.value = new Decimal(Currency.antimatter.value.add(1).log(10) / 10).max(Currency.maxHp.value);
  const delta = getHpDelta().mul(realDiff / 1000);
  Currency.hp.add(delta);
}

export function calcDamageMultiplier() {
  let mul = DC.D1;
  if (checkBossFighing(BOSS_ENUM.MILKYWAY)) {
    mul = mul.mul(BossDatas[BOSS_ENUM.MILKYWAY].calcDamageMultiplier());
  }
  return mul;
}

export function getHpDelta() {
  let delta = getRogueEffect("hpRegen");
  delta = delta.minus(GameCache.damageMultiplier.value.mul(getRogueEffect("hpMinus")));
  return delta;
}
