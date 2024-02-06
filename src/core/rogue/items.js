import { DC } from "../constants";
import xorshift32, { MAX } from "../../utility/xorshift32";

/**
 * @typedef {{ id: number, lv: number, props: number[] }} RogueItem
 * @typedef {ReturnType<typeof calculateRogueEffects>} RogueEffects
 * @typedef {import("../secret-formula/rogue/items").RogueItemData} RogueItemData
 */

/**
 * @param {import("../core/secret-formula/rogue/items").RogueItem} item
 */
export function grantItem(item) {
  const itemData = window.GameDatabase.rogue.items.get(item.id);
  const type = itemData.type;
  if (type === "normal") {
    if (window.player.rogue.normalItems.length >= getInventorySize().normal) return false;
    const xpGain = item.lv ** 2;
    window.player.rogue.itemXps[itemData.id] += xpGain;
    window.player.rogue.normalItems.push(item);
    return true;
  }
  if (type === "debuff") {
    if (window.player.rogue.debuffItems.length >= getInventorySize().debuff) return false;
    const xpGain = item.lv;
    window.player.rogue.itemXps[itemData.id] += xpGain;
    window.player.rogue.debuffItems.push(item);
    return true;
  }
  if (type === "special") {
    if (window.player.rogue.specialItems.length >= getInventorySize().special) return false;
    const xpGain = item.lv;
    window.player.rogue.itemXps[itemData.id] += xpGain;
    window.player.rogue.specialItems.push(item);
    return true;
  }
  return false;
}

export function getInventorySize() {
  const sizes = {
    normal: 4,
    debuff: 40,
    special: 0
  };
  return sizes;
}

export function calculateRogueEffects() {
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

  const items = window.GameDatabase.rogue.items;
  const rogueItemKeys = ["normalItems", "debuffItems", "specialItems"];
  for (const key of rogueItemKeys) {
    for (const item of [...window.player.rogue[key]]) {
      items.get(item.id).calcEffect(effect, item.lv, item.props);
    }
  }

  return effect;
}

/**
 * @template {keyof RogueEffects} Name
 * @param {Name} name
 * @returns {RogueEffects[Name]}
 */
export function getRogueEffect(name) {
  return GameCache.rogueItemEffects.value[name];
}

/**
 * @param {RogueItemData} itemData
 */
export function getItemTier(itemData) {
  let tier = 0;
  const itemXp = window.player.rogue.itemXps[itemData.id];
  const tierReqs = itemData.xpReqs;
  for (let i = 0; i < tierReqs.length; i++) {
    if (tierReqs[i] > itemXp) break;
    tier++;
  }
  return tier;
}

/**
 * @param {RogueItemData} itemData
 * @param {number | null} forcedLevel
 * @returns {RogueItem}
 */
export function genItem(itemData, seed = 0, forcedLevel = null) {
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