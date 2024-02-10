import xorshift32 from "../../../utility/xorshift32";

/**
 * @typedef RogueQuestData
 * @prop {number} id
 * @prop {"normal" | "debuff" | "special"} type
 * @prop {() => string} name
 * @prop {() => string} description
 * @prop {() => number} getProgress range: [0, 1]
 * @prop {() => boolean} isUnlocked
 * @prop {[weight: number, id: number][]} [rewardTable] weight range: [1, 1e6]
 */

const numberify = x => (x instanceof Decimal ? x.toNumber() : Number(x));
const clampProgress = progress => Math.max(0, Math.min(1, numberify(progress)));

/** @type {Map<number, RogueQuestData>} */
const quests = new Map();
/** @param {RogueQuestData} data */
function addQuest(data) {
  const key = data.id;
  quests.set(key, data);
}

/**
 * @param {RogueQuestData} quest
 */
function rollRewardTable(quest, maxSelect = Infinity, surpassLock = false) {
  if (!quest.rewardTable) return [];

  const avaibles = quest.rewardTable.filter(([, id]) => surpassLock || window.player.rogue.itemsUnlocked[id]);
  let x = quest.id * window.player.rogue.seed;
  x = xorshift32(x);

  let pickCount = Math.floor(Math.sqrt(avaibles.length) + 1) + (x % 2);
  pickCount = Math.max(1, Math.min(maxSelect, avaibles.length, pickCount));

  /** @type {[itemData: import("./items").RogueItemData, item: import("./items").RogueItem][]} */
  const pickedItems = [];
  for (let i = 0; i < pickCount; i++) {
    x = xorshift32(x);
    const sum = avaibles.reduce((a, b) => a + b[0], 0);
    const r = x % sum;
    let acc = 0;
    for (let j = 0; j < avaibles.length; j++) {
      const [weight, id] = avaibles[j];
      acc += weight;
      if (acc <= r) continue;
      avaibles.splice(j, 1);

      x = xorshift32(x);
      const itemData = window.GameDatabase.rogue.items.get(id);
      const item = genItem(itemData, x);
      pickedItems.push([itemData, item]);
      break;
    }
  }

  return pickedItems;
}

// Normal
addQuest({
  id: 101,
  type: "normal",
  name: () => "Getting started",
  description: () => "Have a 2nd Antimatter Dimension",
  getProgress: () => clampProgress(window.player.dimensions.antimatter[1].amount),
  isUnlocked: () => true,
  rewardTable: [
    [5, 1001], [5, 1002], [3, 1003], [1, 1004], [1, 1005]
  ]
});
addQuest({
  id: 102,
  type: "normal",
  name: () => "No",
  description: () => `Have ${format(1e30)} Antimatter`,
  getProgress: () => clampProgress(window.player.antimatter.max(1).log(10) / 30),
  isUnlocked: () => true,
  rewardTable: [
    [5, 1001], [5, 1003], [9, 1004], [5, 1005], [6, 1006],
    [5, 1007], [2, 1010], [2, 1011], [2, 1012]
  ],
});
addQuest({
  id: 103,
  type: "normal",
  name: () => "90° × ∞",
  description: () => `Have 120 8th Antimatter Dimension`,
  getProgress: () => clampProgress(window.player.dimensions.antimatter[7].amount.div(120)),
  isUnlocked: () => window.player.rogue.questCompleted[101],
  rewardTable: [
    [1, 1001], [2, 1002], [3, 1003], [3, 1004], [3, 1005],
    [3, 1006], [3, 1007], [9, 1008], [30, 1010], [30, 1011],
    [30, 1012]
  ]
});

// Debuff
addQuest({
  id: 201,
  type: "debuff",
  name: () => "Getting debuffed",
  description: () => "Have a Dimension Boost",
  getProgress: () => clampProgress(window.player.dimensionBoosts),
  isUnlocked: () => false,
  rewardTable: [[1, 2002]],
});
addQuest({
  id: 202,
  type: "debuff",
  name: () => "It's hurt",
  description: () => `Lose 1&nbsp;<i class="fas fa-heart"></i>`,
  getProgress: () => clampProgress(Currency.maxHp.value.sub(Currency.hp.value).div(1).sub(0.001)),
  isUnlocked: () => false,
  rewardTable: [[1, 2001]]
});

const normalQuests = [...quests.entries()]
  .map(v => v[1])
  .filter(quest => quest.type === "normal");
const debuffQuests = [...quests.entries()]
  .map(v => v[1])
  .filter(quest => quest.type === "debuff");
const specialQuests = [...quests.entries()]
  .map(v => v[1])
  .filter(quest => quest.type === "special");

export {
  quests,
  normalQuests,
  debuffQuests,
  specialQuests,
  rollRewardTable
};
