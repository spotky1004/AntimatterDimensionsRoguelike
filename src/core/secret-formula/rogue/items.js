import { DC } from "../../constants";
import { Notations } from "../../notations";

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
 * @prop {() => boolean[]} isUnlocked
 * @prop {(seed: number) => RogueItem} itemGen
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
    for (const item of window.player.rogue[key]) {
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
  isUnlocked: () => Achievement(11).isUnlocked,
  itemGen: seed => ({
    id: 1001,
    lv: 1 + (seed % 2),
    props: []
  })
});
addItem({
  id: 1002,
  type: "normal",
  icon: faIcon("2"),
  nameStr: lv => `${["Quadratic", "Cubic", "Quartic", "Quintic"][lv - 1]} Equation`,
  descriptionStr: lv => `Boosts 2nd Antimatter Dimension's mult by ^${format(1 + lv / 5, 2, 2)}`,
  calcEffect: (effect, lv) => effect.adPows[2] = effect.adPows[2].mul(1 + lv / 5, 2, 2),
  isUnlocked: () => Achievement(12).isUnlocked,
  itemGen: seed => ({
    id: 1002,
    lv: 1 + Math.floor((seed % 7) / 5),
    props: []
  })
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
  isUnlocked: () => Achievement(13).isUnlocked,
  itemGen: seed => ({
    id: 1003,
    lv: 1 + (seed % 2),
    props: [window.player.records.totalTimePlayed]
  })
});
addItem({
  id: 1004,
  type: "normal",
  icon: faIcon("4"),
  nameStr: lv => `${4 * lv} Tickspeed`,
  descriptionStr: lv => `Boosts Tickspeed upgrade effect by x${format(DC.D1.add(0.004 * lv), 3, 3)}.`,
  calcEffect: (effect, lv) => effect.tickUpgrade = effect.tickUpgrade.mul(DC.D1.add(0.004 * lv)),
  isUnlocked: () => Achievement(14).isUnlocked,
  itemGen: seed => ({
    id: 1004,
    lv: 1 + Math.floor((seed % 3) / 2),
    props: []
  })
});
addItem({
  id: 1005,
  type: "normal",
  icon: faIcon("5"),
  nameStr: lv => `Antimatter Punch ${roman(lv)}`,
  descriptionStr: lv => `Discount antimatter dimensions by /${format(DC.D5.pow(lv ** 2), 2)}`,
  calcEffect: (effect, lv) => effect.adDiscount = effect.adDiscount.mul(DC.D5.pow(lv ** 2)),
  isUnlocked: () => Achievement(15).isUnlocked,
  itemGen: seed => ({
    id: 1005,
    lv: 1 + (seed % 2),
    props: []
  })
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
  isUnlocked: () => true,
  itemGen: seed => ({
    id: 2001,
    lv: 1 + (seed % 2),
    props: Array.from({ length: 8 }, (_, i) => player.dimensions.antimatter[i].bought)
  }),
});
addItem({
  id: 2002,
  type: "debuff",
  icon: faIcon("bug"),
  nameStr: lv => `${["A", "Two", "Three", "Four"][lv - 1]} Bug${" s"[Math.sign(lv - 1)]}`,
  descriptionStr: lv => `- ${format(lv / 1000, 3, 3)} ${faIcon("heart")}/s`,
  calcEffect: (effect, lv) => effect.hpDelta = effect.hpDelta.sub(lv / 1000),
  isUnlocked: () => true,
  itemGen: seed => ({
    id: 2002,
    lv: 1 + seed % 4,
    props: []
  })
});

export {
  items,
  calculateRogueEffects,
  getRogueEffect
};
