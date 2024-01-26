import { DC } from "../../constants";
import { Notations } from "../../notations";

import xorshift32, { MAX } from "../../../utility/xorshift32";

/**
 * @typedef {{ id: number, lv: number, props: number[] }} RogueItem
 * @typedef {ReturnType<typeof calculateRogueEffects>} RogueEffects
 */
/**
 * @typedef RogueItemData
 * @prop {number} id
 * @prop {"normal" | "debuff" | "special"} type
 * @prop {string} icon
 * @prop {(lv: number, props: number[]) => string} nameStr
 * @prop {(lv: number, props: number[]) => string} descriptionStr
 * @prop {(effect: RogueEffects, lv: number, props: number[]) => void} calcEffect
 * @prop {() => string} unlockConditionStr
 * @prop {() => boolean[]} isUnlocked
 * @prop {number[]} xpReqs
 * @prop {number[]} levelChances ([0 ~ 1])[]
 * @prop {() => number[]} defaultProps
 */

function calculateRogueEffects() {
  const effect = {
    tickUpgrade: DC.D1,
    adAllMult: DC.D1,
    /** @type {(typeof Decimal)[]} */
    adMults: Array.range(0, 9).map(() => DC.D1),
    /** @type {(typeof Decimal)[]} */
    adPows: Array.range(0, 9).map(() => DC.D1),
    adDiscount: DC.D1,
    hpDelta: DC.D0,
    fire: {
      ad: false
    },
  };

  const rogueItemKeys = ["normalItems", "debuffItems", "specialItems"];
  for (const key of rogueItemKeys) {
    for (const item of [...window.player.rogue[key]]) {
      items.get(item.id).calcEffect(effect, item.lv, item.props);
    }
  }

  return effect;
}
window.calculateRogueEffects = calculateRogueEffects;

/**
 * @template {keyof RogueEffects} Name
 * @param {Name} name
 * @returns {RogueEffects[Name]}
 */
function getRogueEffect(name) {
  return GameCache.rogueItemEffects.value[name];
}
window.getRogueEffect = getRogueEffect;

/**
 * @param {RogueItemData} itemData
 */
function getItemTier(itemData) {
  let tier = 0;
  const itemXp = window.player.rogue.itemXps[itemData.id];
  const tierReqs = itemData.xpReqs;
  for (let i = 0; i < tierReqs.length; i++) {
    if (tierReqs[i] > itemXp) break;
    tier++;
  }
  return tier;
}
window.getItemTier = getItemTier;

/**
 * @param {RogueItemData} itemData
 * @param {number | null} forcedLevel
 * @returns {RogueItem}
 */
function genItem(itemData, seed = 0, forcedLevel = null) {
  let lv = 1;
  if (forcedLevel) {
    lv = forcedLevel;
  } else {
    const tier = getItemTier(itemData);
    let x = seed;
    for (let i = 0; i < tier; i++) {
      x = xorshift32(x);
      const r = x / MAX;
      const p = itemData.levelChances[i];
      if (r <= p) lv++;
    }
  }

  const item = {
    id: itemData.id,
    lv,
    props: itemData.defaultProps()
  };
  return item;
}
window.genItem = genItem;

const roman = x => Notations.find("Roman").format(x);
const faIcon = name => `<i class="fas fa-${name}"></i>`;

/** @type {Map<number, RogueItemData>} */
const items = new Map();
/** @param {RogueItemData} data */
function addItem(data) {
  const key = data.id;
  items.set(key, data);
}

// Noraml
addItem({
  id: 1001,
  type: "normal",
  icon: faIcon("1"),
  nameStr: lv => `${["First", "Second", "Third", "Fourth"][lv - 1]} Boost`,
  descriptionStr: lv => `Boosts 1st Antimatter Dimension by x${format(DC.D5.pow(lv))}`,
  calcEffect: (effect, lv) => effect.adMults[1] = effect.adMults[1].mul(DC.D5.pow(lv)),
  unlockConditionStr: () => `Free`,
  isUnlocked: () => true,
  xpReqs: [10, 80, 200],
  levelChances: [0.5, 0.6, 0.7],
  defaultProps: () => []
});
addItem({
  id: 1002,
  type: "normal",
  icon: faIcon("2"),
  nameStr: lv => `${["Quadratic", "Cubic", "Quartic", "Quintic"][lv - 1]} Equation`,
  descriptionStr: lv => `Boosts 2nd Antimatter Dimension's mult by ^${format((10 + lv) / 10, 2, 2)}`,
  calcEffect: (effect, lv) => effect.adPows[2] = effect.adPows[2].mul((10 + lv) / 10, 2, 2),
  unlockConditionStr: () => `Complete achievement 12`,
  isUnlocked: () => Achievement(12).isUnlocked,
  xpReqs: [20, 200, 2000],
  levelChances: [0.3, 0.4, 0.6],
  defaultProps: () => []
});
addItem({
  id: 1003,
  type: "normal",
  icon: faIcon("3"),
  nameStr: lv => `Half Life ${roman(lv)}`,
  descriptionStr: (lv, [s]) => {
    const e = window.player.records.totalTimePlayed;
    const boost = DC.D2.pow(lv).div(1 + (e - s) / (1e6 * lv)).max(1);
    return `Boosts Anaimatter Dimensions by x${format(boost, 2, 2)}.<br> But, decays overtime.`;
  },
  calcEffect: (effect, lv, [s]) => {
    const e = window.player.records.totalTimePlayed;
    const boost = DC.D2.pow(lv).div(1 + (e - s) / (1e6 * lv)).max(1);
    effect.adAllMult = effect.adAllMult.mul(boost);
  },
  unlockConditionStr: () => `Complete achievement 13`,
  isUnlocked: () => Achievement(13).isUnlocked,
  xpReqs: [20, 50, 100, 500],
  levelChances: [0.5, 0.6, 0.7, 0.8],
  defaultProps: () => [window.player.records.totalTimePlayed]
});
addItem({
  id: 1004,
  type: "normal",
  icon: faIcon("4"),
  nameStr: lv => `${4 * lv} Tickspeed`,
  descriptionStr: lv => `Boosts Tickspeed upgrade effect by x${format(DC.D1.add(0.004 * lv), 3, 3)}.`,
  calcEffect: (effect, lv) => effect.tickUpgrade = effect.tickUpgrade.mul(DC.D1.add(0.004 * lv)),
  unlockConditionStr: () => `Complete achievement 14`,
  isUnlocked: () => Achievement(14).isUnlocked,
  xpReqs: [40, 300],
  levelChances: [0.2, 0.2],
  defaultProps: () => []
});
addItem({
  id: 1005,
  type: "normal",
  icon: faIcon("5"),
  nameStr: lv => `Antimatter Punch ${roman(lv)}`,
  descriptionStr: lv => `Discount antimatter dimensions by /${format(DC.D5.pow(lv ** 2), 2)}`,
  calcEffect: (effect, lv) => effect.adDiscount = effect.adDiscount.mul(DC.D5.pow(lv ** 2)),
  unlockConditionStr: () => `Complete achievement 15`,
  isUnlocked: () => Achievement(15).isUnlocked,
  xpReqs: [10, 30, 70, 200, 500, 2000],
  levelChances: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  defaultProps: () => []
});
addItem({
  id: 1006,
  type: "normal",
  icon: faIcon("6"),
  nameStr: lv => `${"6".repeat(lv)}`,
  descriptionStr: lv => {
    let str = `Boosts 6th Antimatter Dimensions by ${format(DC.D6.pow(lv))}<br>`;
    str += `But, - ${format(6 * lv / 1000, 3, 3)} ${faIcon("heart")}/s`;
    return str;
  },
  calcEffect: (effect, lv) => {
    effect.adMults[6] = effect.adMults[6].mul(DC.D6.pow(lv));
    effect.hpDelta = effect.hpDelta.sub(6 * lv / 1000);
  },
  unlockConditionStr: () => `Complete achievement 16`,
  isUnlocked: () => Achievement(16).isUnlocked,
  xpReqs: [66],
  levelChances: [0.66],
  defaultProps: () => []
});
addItem({
  id: 1007,
  type: "normal",
  icon: faIcon("7"),
  nameStr: lv => `A luck related item ${roman(lv)}`,
  descriptionStr: lv => {
    let str = `For each Dimension Boost, `;
    str += `${format(10 / lv, 2, 2)}% chance to recover ${format(lv)} ${faIcon("heart")}`;
    return str;
  },
  calcEffect: (_, lv, props) => {
    const [prevDimBoost] = props;
    const curDimBoost = window.player.dimensionBoosts;
    const rollCount = Math.max(0, curDimBoost - prevDimBoost);
    props[0] = curDimBoost;

    const chance = 10 / lv;
    let recoverCount = 0;
    if (rollCount < 3 / chance) {
      for (let i = 0; i < rollCount; i++) {
        if (fastRandom() <= chance) recoverCount++;
      }
    } else {
      recoverCount = rollCount * chance * (1 + (fastRandom() * 2 - 1) / Math.sqrt(rollCount));
    }
    const recoverAmount = DC.D1.mul(lv).mul(recoverCount);
    Currency.hp.add(recoverAmount);
  },
  isUnlocked: () => Achievement(17).isUnlocked,
  xpReqs: [10, 30, 50, 100],
  levelChances: [0.3, 0.3, 0.3, 0.3],
  defaultProps: () => [window.player.dimensionBoosts]
});
addItem({
  id: 1008,
  type: "normal",
  icon: faIcon("8"),
  nameStr: lv => `Fake Infinity${"  ²³⁴⁵"[lv]}`,
  descriptionStr: lv => {
    let str = `+${format(2 * lv)} IP on next infinity.<br>`;
    str += `But, item destories itself on activate and attacks you at ${format(1.5 * lv, 1, 1)} ${faIcon("heart")}`;
    return str;
  },
  calcEffect: (_, lv, props) => {
    const curInfTime = player.records.thisInfinity.realTime;
    if (props[0] < curInfTime) {
      props[0] = curInfTime;
      return;
    }

    const thisIdx = window.player.rogue.normalItems.findIndex(v => v.props === props);
    window.player.rogue.normalItems.splice(thisIdx, 1);

    Currency.infinityPoints.add(2 * lv);
    Currency.hp.subtract(1.5 * lv);
  },
  unlockConditionStr: () => `Complete achievement 18`,
  isUnlocked: () => Achievement(18).isUnlocked,
  xpReqs: [50, 200, 500],
  levelChances: [0.5, 0.5, 0.5],
  defaultProps: () => [player.records.thisInfinity.realTime]
});

// Debuff
addItem({
  id: 2001,
  type: "debuff",
  icon: faIcon("fire-flame-curved"),
  rarity: "C",
  nameStr: lv => `Burning Dimensions ${roman(lv)}`,
  descriptionStr: lv => `-${format(lv / 1000, 3, 3)} ${faIcon("heart")} when you buy 10's Antimatter Dimensions`,
  calcEffect: (effect, lv, props) => {
    effect.fire.ad = true;

    const attackValue = lv / 1000;
    let diffSum = 0;
    for (let i = 0; i < 8; i++) {
      const curBoughtAmount = Math.floor(player.dimensions.antimatter[i].bought / 10);
      diffSum += Math.max(0, curBoughtAmount - props[i]);
      props[i] = curBoughtAmount;
    }
    Currency.hp.subtract(diffSum * attackValue);
  },
  unlockConditionStr: () => `Obtain item by debuff quest`,
  isUnlocked: () => false,
  xpReqs: [0, 0, 0],
  levelChances: [0.4, 0.2, 0.1],
  defaultProps: () => Array.from({ length: 8 }, (_, i) => player.dimensions.antimatter[i].bought)
});
addItem({
  id: 2002,
  type: "debuff",
  icon: faIcon("bug"),
  nameStr: lv => `${["A", "Two", "Three", "Four"][lv - 1]} Bug${" s"[Math.sign(lv - 1)]}`,
  descriptionStr: lv => `- ${format(lv / 1000, 3, 3)} ${faIcon("heart")}/s`,
  calcEffect: (effect, lv) => effect.hpDelta = effect.hpDelta.sub(lv / 1000),
  unlockConditionStr: () => `Obtain item by debuff quest`,
  isUnlocked: () => false,
  xpReqs: [0, 0, 0, 0],
  levelChances: [0.6, 0.5, 0.4, 0.3],
  defaultProps: () => []
});

export {
  items,
  calculateRogueEffects,
  getRogueEffect,
  getItemTier,
  genItem
};
