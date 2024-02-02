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
