export function updateQuests() {
  // Unlock quest
  for (const [id, quest] of window.GameDatabase.rogue.quests) {
    if (window.player.rogue.questUnlocked[id] || !quest.isUnlocked()) continue;
    window.player.rogue.questUnlocked[id] = true;
  }

  // Notify quest completeion
  for (const quest of window.GameDatabase.rogue.normalQuests) {
    if (
      window.player.rogue.questCompleteNotified[quest.id] ||
      quest.getProgress() < 1
    ) continue;
    window.player.rogue.questCompleteNotified[quest.id] = true;
    GameUI.notify.success(`Quest completed: ${quest.name()}`);
  }

  // Autocomplete debuff quests
  for (const quest of window.GameDatabase.rogue.debuffQuests) {
    if (
      window.player.rogue.questCompleted[quest.id] ||
      quest.getProgress() < 1
    ) continue;
    window.player.rogue.questUnlocked[quest.id] = true;
    window.player.rogue.questCompleted[quest.id] = true;

    const item = window.GameDatabase.rogue.rollRewardTable(quest, 1, true)[0][1];
    const itemData = window.GameDatabase.rogue.items.get(item.id);
    grantItem(item);
    GameUI.notify.strike(`Got a new debuff card: ${itemData.nameStr(item.lv, item.props)}`);
  }
}
