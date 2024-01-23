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

const MAX = 2 ** 32;
const MAXN = 2n ** 32n;
/**
 * @param {bigint} n
 */
function xorshift32(n) {
  let x = BigInt(n);
  x ^= (x << 13n) % MAXN;
  x ^= x >> 17n;
  x ^= (x << 5n) % MAXN;
  return Number(x);
}

/**
 * @param {RogueQuestData} quest
 * @returns {import("./items").RogueItemData[]}
 */
function rollRewardTable(quest, maxSelect = Infinity) {
  if (!quest.rewardTable) return [];

  const avaibles = quest.rewardTable.filter(([, id]) => window.player.rogue.itemsUnlocked[id]);
  let x = quest.id * window.player.rogue.seed % MAX;
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
      avaibles.splice(j, 1);
      pickedItemIds.push(id);
      break;
    }
  }

  /** @type {import("./items").RogueItemData[]} */
  const pickedItems = pickedItemIds.map(id => window.GameDatabase.rogue.items.get(id));
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
  rewardTable: [[4, 1001], [3, 1002], [2, 1003], [9, 1004]],
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
