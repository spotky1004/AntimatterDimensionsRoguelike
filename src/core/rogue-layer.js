export function rogueUpdate() {
  for (const [id, item] of window.GameDatabase.rogue.items) {
    if (window.player.rogue.itemsUnlocked[id] || !item.isUnlocked()) continue;
    window.player.rogue.itemsUnlocked[id] = true;
  }

  for (const [id, quest] of window.GameDatabase.rogue.quests) {
    if (window.player.rogue.questUnlocked[id] || !quest.isUnlocked()) continue;
    window.player.rogue.questUnlocked[id] = true;
  }

  for (const quest of window.GameDatabase.rogue.debuffQuests) {
    if (
      window.player.rogue.questCompleted[quest.id] ||
      quest.getProgress() < 1
    ) continue;
    window.player.rogue.questUnlocked[quest.id] = true;
    window.player.rogue.questCompleted[quest.id] = true;

    const itemData = window.GameDatabase.rogue.rollRewardTable(quest, 1)[0];
    const item = itemData.itemGen();
    window.player.rogue.debuffItems.push(item);
    GameUI.notify.strike(`Got a new debuff card: ${itemData.nameStr(item.lv, item.props)}`);
  }
}

export function rogueDie() {
  // Refer to https://github.com/toilet45/ADRedemption/blob/master/src/core/mending.js. Thank you royal!
  Tab.rogue["rogue-items"].show();
  EventHub.dispatch(GAME_EVENT.ROGUE_DIE);
}
