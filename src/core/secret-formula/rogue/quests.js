/**
 * @typedef RogueQuestData
 * @prop {number} id
 * @prop {"normal" | "debuff" | "special"} type
 * @prop {string} name
 * @prop {string} description
 * @prop {() => number} getProgress range: [0, 1]
 * @prop {() => boolean} isUnlocked
 */

const numberify = x => (x instanceof Decimal ? x.toNumber() : Number(x));
const clampProgress = progress => Math.max(0, Math.min(1, numberify(progress)));

const quests = new Map();
/** @param {RogueQuestData} data */
function addQuest(data) {
  const key = data.id;
  quests.set(key, data);
}

// Normal
addQuest({
  id: 101,
  type: "normal",
  name: "Getting started",
  description: "Have a 2nd Antimatter Dimension",
  getProgress: () => clampProgress(window.player.dimensions.antimatter[2].amount),
  isUnlocked: () => true,
});

// Debuff
addQuest({
  id: 201,
  type: "debuff",
  name: "Getting debuffed",
  description: "Have a Dimension Boost",
  getProgress: () => clampProgress(window.player.dimensionBoosts),
  isUnlocked: () => true,
});

export {
  quests
};
