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
 * @prop {() => boolean} unlocked
 */

/**
 * @param {number} x
 */
function roman(x) {
  return Notations.find("Roman").format(x);
}

/** @type {Map<number, RogueItemData>} */
const items = new Map([
  [100, {
    type: "normal",
    icon: '<i class="fas fa-1" />',
    rarity: "C",
    nameStr: lv => `First boost ${roman(lv)}`,
    descriptionStr: lv => `Boosts 1st Antimatter Dimension by ${format(DC.E1.pow(10 ** lv))}`,
    calcEffect: (effect, lv) => effect.adMults[1] = effect.adMults[1].mul(DC.E1.pow(10 ** lv)),
    unlocked: () => true
  }]
]);

function calculateRogueEffects() {
  const effect = {
    adAllMult: DC.D1,
    /** @type {(typeof Decimal)[]} */
    adMults: Array.range(0, 9).map(() => DC.D1),
  };

  const rogueItemKeys = ["normalItems", "debuffItems", "specialItems"];
  for (const key of rogueItemKeys) {
    for (const item of player.rogue[key]) {
      items.get(item.id).calcEffect(effect, item.props);
    }
  }

  return effect;
}
window.calculateRogueEffects = calculateRogueEffects;

export {
  items,
  calculateRogueEffects
};
