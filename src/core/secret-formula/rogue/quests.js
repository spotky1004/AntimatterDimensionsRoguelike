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
function rollRewardTable(quest, maxSelect = Infinity) {
  if (!quest.rewardTable) return [];

  const avaibles = quest.rewardTable.filter(([, id]) => window.player.rogue.itemsUnlocked[id]);
  let x = quest.id * window.player.rogue.seed;
  x = xorshift32(x);

  let pickCount = Math.floor(avaibles.length / 2) + (x % 2);
  pickCount = Math.max(1, Math.min(maxSelect, avaibles.length, pickCount));

  /** @type {number[]} */
  const pickedItemIds = [];
  for (let i = 0; i < pickCount; i++) {
    x = xorshift32(x);
    const sum = avaibles.reduce((a, b) => a + b[0], 0);
    const r = x % sum;
    let acc = 0;
    for (let j = 0; j < avaibles.length; j++) {
      const [weight, id] = avaibles[j];
      acc += weight;
      if (acc <= r) continue;
      x = xorshift32(x);
      avaibles.splice(j, 1);
      pickedItemIds.push([id, x]);
      break;
    }
  }

  /** @type {[itemData: import("./items").RogueItemData, seed: number][]} */
  const pickedItems = pickedItemIds.map(([id, seed]) => [window.GameDatabase.rogue.items.get(id), seed]);
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
  rewardTable: [[5, 1001], [3, 1002], [2, 1003], [1, 1004]]
});
addQuest({
  id: 102,
  type: "normal",
  name: () => "e30",
  description: () => `Have ${format(1e30)} Antimatter`,
  getProgress: () => clampProgress(window.player.antimatter.max(1).log(10) / 30),
  isUnlocked: () => true,
  rewardTable: [[4, 1001], [3, 1002], [2, 1003], [9, 1004], [5, 1005]],
});
addQuest({
  id: 103,
  type: "normal",
  name: () => "(90° × ∞)²",
  description: () => `Have 8 8th Antimatter Dimension`,
  getProgress: () => clampProgress(window.player.dimensions.antimatter[7].amount.div(8)),
  isUnlocked: () => window.player.rogue.questCompleted[101],
  rewardTable: [[1, 1002], [1, 1004]]
});
addQuest({
  id: 104,
  type: "normal",
  name: () => "666",
  description: () => `Have exactly 6 Dim Boosts, 6 6th Antimatter Dimension`,
  getProgress: () => {
    const dimBoost = window.player.dimensionBoosts;
    const dim6 = window.player.dimensions.antimatter[5].amount.toNumber();

    let progress = 0;
    if (dimBoost <= 6) progress += dimBoost / 12;
    if (dim6 <= 6) progress += dim6 / 12;
    return clampProgress(progress);
  },
  isUnlocked: () => window.player.dimensionBoosts > 0,
  rewardTable: [[1, 1001], [1, 1002], [1, 1003], [1, 1004], [1, 1005]]
});

// Debuff
addQuest({
  id: 201,
  type: "debuff",
  name: () => "Getting debuffed",
  description: () => "Have a Dimension Boost",
  getProgress: () => clampProgress(window.player.dimensionBoosts),
  isUnlocked: () => false,
  rewardTable: [[1, 2001], [1, 2002]],
});
addQuest({
  id: 202,
  type: "debuff",
  name: () => 'More <i class="fas fa-fire"></i>',
  description: () => `Lose 10 <i class="fas fa-heart"></i>`,
  getProgress: () => clampProgress(Currency.maxHp.value.sub(Currency.hp.value).div(10)),
  isUnlocked: () => false,
  rewardTable: [[5, 2001], [1, 2002]]
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
