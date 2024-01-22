import { DC } from "../../constants";
import { Notations } from "../../notations";

/**
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
 * @prop {() => { id: number, lv: number, props: number[] }} itemGen
 */

function calculateRogueEffects() {
  const effect = {
    tickUpgrade: DC.D1,
    adAllMult: DC.D1,
    /** @type {(typeof Decimal)[]} */
    adMults: Array.range(0, 9).map(() => DC.D1),
    /** @type {(typeof Decimal)[]} */
    adPows: Array.range(0, 9).map(() => DC.D1),
    hpDelta: DC.D0,
    fire: {
      ad: false
    }
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
  itemGen: () => ({
    id: 1001,
    lv: 1,
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
  itemGen: () => ({
    id: 1002,
    lv: 1,
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
  itemGen: () => ({
    id: 1003,
    lv: 1,
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
  itemGen: () => ({
    id: 1004,
    lv: 1,
    props: []
  })
});
addItem({
  id: 1005,
  type: "normal",
  icon: faIcon("5"),
  nameStr: lv => `Antimatter Punch ${roman(lv)}`
});

// Debuff
addItem({
  id: 2001,
  type: "debuff",
  icon: faIcon("fire-flame-curved"),
  rarity: "C",
  nameStr: lv => `Burning Dimensions ${roman(lv)}`,
  descriptionStr: lv => `-${format(lv ** 2 / 1000, 3, 3)} ${faIcon("heart")} when you buy a Normal Dimension`,
  calcEffect: (effect, lv, props) => {
    effect.fire.ad = true;

    const attackValue = lv ** 2 / 1000;
    let diffSum = 0;
    for (let i = 0; i < 8; i++) {
      const curBoughtAmount = player.dimensions.antimatter[i].bought;
      diffSum += Math.max(0, curBoughtAmount - props[i]);
      props[i] = curBoughtAmount;
    }
    Currency.hp.subtract(diffSum * attackValue);
  },
  isUnlocked: () => true,
  itemGen: () => ({
    id: 2001,
    lv: 1,
    props: Array.from({ length: 8 }, (_, i) => player.dimensions.antimatter[i].bought)
  }),
});

export {
  items,
  calculateRogueEffects,
  getRogueEffect
};
