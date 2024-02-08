import { v4 as uuidv4 } from "uuid";

import xorshift32, { MAX } from "../../utility/xorshift32";
import { DC } from "../constants";

/**
 * @typedef {{ uuid: string, id: number, lv: number, props: number[] }} RogueItem
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

/**
 * @param {number} id
 */
export function grantItemById(id, level = 1) {
  const itemData = window.GameDatabase.rogue.items.get(id);
  const item = genItem(itemData, 0, level);
  grantItem(item);
}

export function getInventorySize() {
  const sizes = {
    normal: 4,
    debuff: 40,
    special: 0
  };
  return sizes;
}

const rogueEffectDatas = {
  tickUpgrade: {
    default: () => DC.D1,
    merge: (a, b) => a.mul(b)
  },
  adAllMult: {
    default: () => DC.D1,
    merge: (a, b) => a.mul(b)
  },
  adMults: {
    /** @type {() => (typeof Decimal)[]} */
    default: () => Array.range(0, 9).map(() => DC.D1),
    merge: (a, b) => a.map((ai, i) => ai.mul(b[i]))
  },
  adPows: {
    /** @type {() => (typeof Decimal)[]} */
    default: () => Array.range(0, 9).map(() => DC.D1),
    merge: (a, b) => a.map((ai, i) => ai.mul(b[i]))
  },
  adDiscount: {
    default: () => DC.D1,
    merge: (a, b) => a.mul(b)
  },
  hpRegen: {
    default: () => DC.D0,
    merge: (a, b) => a.add(b)
  },
  hpMinus: {
    default: () => DC.D0,
    merge: (a, b) => a.add(b)
  },
  fire: {
    default: () => ({
      ad: false
    }),
    merge: (a, b) => {
      const out = {};
      for (const key of rogueEffectFireKeys) {
        out[key] = a[key] || b[key];
      }
      return out;
    }
  }
};
const rogueEffectKeys = Object.keys(rogueEffectDatas);
const rogueEffectFireKeys = Object.keys(rogueEffectDatas.fire.default());

export function getDefaultRogueEffects() {
  /** @type {{ [K in keyof typeof rogueEffectDatas]: ReturnType<(typeof rogueEffectDatas)[K]["default"]> }} */
  const effects = {};
  for (const key of rogueEffectKeys) {
    effects[key] = rogueEffectDatas[key].default();
  }
  return effects;
}

const rogueInventoryKeys = ["normalItems", "debuffItems", "specialItems"];
export function calculateRogueItemEffects() {
  const effect = getDefaultRogueEffects();

  const items = window.GameDatabase.rogue.items;
  for (const key of rogueInventoryKeys) {
    for (const item of [...window.player.rogue[key]]) {
      items.get(item.id).calcEffect(effect, item.lv, item.props);
    }
  }

  return effect;
}

const rogueEffectLayerKeys = ["dimboost", "galaxy", "infinity", "eternity", "reality", "rogue"];
export function calculateRogueEffects() {
  const mergedEffect = calculateRogueItemEffects();

  for (const effectKey of rogueEffectKeys) {
    let newValue = mergedEffect[effectKey];
    const mergeFunc = rogueEffectDatas[effectKey].merge;
    for (const leyerKey of rogueEffectLayerKeys) {
      newValue = mergeFunc(newValue, window.player.rogue.effects[leyerKey][effectKey]);
    }
    mergedEffect[effectKey] = newValue;
  }

  return mergedEffect;
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
    uuid: uuidv4(),
    id: itemData.id,
    lv,
    props: itemData.defaultProps()
  };
  return item;
}

/**
 * @param {string} uuid
 * @returns {RogueItem?}
 */
export function getItemByUUID(uuid) {
  for (const item of window.player.rogue.normalItems) {
    if (item.uuid === uuid) return item;
  }
  for (const item of window.player.rogue.debuffItems) {
    if (item.uuid === uuid) return item;
  }
  for (const item of window.player.rogue.specialItems) {
    if (item.uuid === uuid) return item;
  }
  return null;
}

/**
 * @param {RogueItem} item
 */
export function canUseItem(item) {
  const itemData = window.GameDatabase.rogue.items.get(item.id);
  if (typeof itemData.click === "undefined") return false;
  return itemData.click.canClick(item.lv, item.props);
}

/**
 * @param {RogueItem} item
 */
export function useItem(item) {
  const itemData = window.GameDatabase.rogue.items.get(item.id);
  if (!canUseItem(item) || typeof itemData.click === "undefined") return false;

  GameUI.notify.info(`Used item: ${itemData.nameStr(item.lv, item.props)}`);
  itemData.click.handler(item.lv, item.props);
  return true;
}
