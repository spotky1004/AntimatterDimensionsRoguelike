import { DC } from "../../constants";
import { Notations } from "../../notations";

/**
 * @typedef {ReturnType<typeof calculateRogueEffects>} RogueEffects
 */
/**
 * @typedef RogueItemData
 * @prop {"normal" | "debuff" | "special"} type
 * @prop {string} icon
 * @prop {"C" | "B" | "A" | "S"} rarity
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

/**
 * @param {number} x
 */
function roman(x) {
  return Notations.find("Roman").format(x);
}

/**
 * @param {string} name
 */
function faIcon(name) {
  return `<i class="fas fa-${name}"></i>`;
}

/** @type {Map<number, RogueItemData>} */
const items = new Map([
  // Normal
  [1001, {
    type: "normal",
    icon: faIcon("1"),
    rarity: "C",
    nameStr: lv => `${["First", "Second", "Third", "Fourth"][lv - 1]} Boost`,
    descriptionStr: lv => `Boosts 1st Antimatter Dimension by x${format(DC.E1.pow(lv))}`,
    calcEffect: (effect, lv) => effect.adMults[1] = effect.adMults[1].mul(DC.E1.pow(lv)),
    isUnlocked: () => Achievement(11).isUnlocked,
    itemGen: () => ({
      id: 1001,
      lv: 1,
      props: []
    })
  }],
  [1002, {
    type: "normal",
    icon: faIcon("2"),
    rarity: "C",
    nameStr: lv => `${["Quadratic", "Cubic", "Quartic", "Quintic"][lv - 1]} Equation`,
    descriptionStr: lv => `Boosts 2nd Antimatter Dimension's mult by ^${format(lv + 1)}`,
    calcEffect: (effect, lv) => effect.adPows[2] = effect.adPows[2].mul(lv + 1),
    isUnlocked: () => Achievement(12).isUnlocked,
    itemGen: () => ({
      id: 1002,
      lv: 1,
      props: []
    })
  }],
  [1003, {
    type: "normal",
    icon: faIcon("3"),
    rarity: "C",
    nameStr: lv => `Half Life ${roman(lv)}`,
    descriptionStr: (lv, [s]) => {
      const e = window.player.records.totalTimePlayed;
      const boost = DC.E1.pow(lv).div(1 + (e - s) / (1e6 * lv)).max(1);
      return `Boosts Anaimatter Dimensions by x${format(boost, 2, 2)}.<br> But, decays overtime.`;
    },
    calcEffect: (effect, lv, [s]) => {
      const e = window.player.records.totalTimePlayed;
      const boost = DC.E1.pow(lv).div(1 + (e - s) / (1e6 * lv)).max(1);
      effect.adAllMult = effect.adAllMult.mul(boost);
    },
    isUnlocked: () => Achievement(13).isUnlocked,
    itemGen: () => ({
      id: 1003,
      lv: 1,
      props: [window.player.records.totalTimePlayed]
    })
  }],
  [1004, {
    type: "normal",
    icon: faIcon("4"),
    rarity: "C",
    nameStr: lv => `${4 * lv} Tickspeed`,
    descriptionStr: lv => `Boosts Tickspeed upgrade effect by x${format(DC.D1.add(0.004 * lv), 3, 3)}.`,
    calcEffect: (effect, lv) => effect.tickUpgrade = effect.tickUpgrade.mul(DC.D1.add(0.004 * lv)),
    isUnlocked: () => Achievement(14).isUnlocked,
    itemGen: () => ({
      id: 1004,
      lv: 1,
      props: []
    })
  }],
  [1005, {
    type: "normal",
    icon: faIcon("5"),
    rarity: "C",
    nameStr: lv => `Antimatter Punch ${roman(lv)}`
  }],

  // Debuff
  [2001, {
    type: "debuff",
    icon: faIcon("fire-flame-curved"),
    rarity: "C",
    nameStr: lv => `Burning Dimensions ${roman(lv)}`,
    descriptionStr: lv => `-${lv ** 2 / 100} ${faIcon("heart")} when you buy a Normal Dimension`,
    calcEffect: () => "TODO",
    isUnlocked: () => true,
    itemGen: () => ({
      id: 2001,
      lv: 1,
      props: []
    }),
  }]
]);

export {
  items,
  calculateRogueEffects,
  getRogueEffect
};
