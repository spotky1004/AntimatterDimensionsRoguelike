/**
 * @typedef SkillTierReq
 * @prop {() => number} maxLevel
 * @prop {() => boolean} checkReq
 * @prop {() => boolean} getReqStr
 */
/**
 * @typedef SkillPerk
 * @prop {number} perkId
 * @prop {() => number} getReq
 * @prop {() => string} getDescription
 */
/**
 * @typedef SkillData
 * @prop {(tier: number) => string} getName
 * @prop {(tier: number) => string} getColor
 * @prop {(effect: RogueEffects, lv: number, tier: number) => void} calcEffect
 * @prop {SkillTierReq[]} tierReqs
 * @prop {SkillPerk[]} perks
 */
/**
 * @typedef {"dimension"} SkillNames
 */

const SKILL_PERKS = {
  REOMVE_NORMAL_ITEM: 0,
  ROLL_MORE_ITEM: 1
};

/** @type {{ [K in SkillNames]: SkillData }} */
const skillDatas = {
  dimension: {
    getName: () => "Dimension",
    getColor: tier => ["#89cf11", "#cf8d11", "#8623b8"][tier],
    calcEffect: (effect, lv) => {
      effect.adAllMult = effect.adAllMult.mul(1 + lv);
      // TODO: Boost all ID on tier 1
      // TODO: Boost all ED on tier 2
    },
    tierReqs: [
      {
        maxLevel: () => 8,
        checkReq: () => true,
        getReqStr: () => "Hello!",
      },
      {
        maxLevel: () => 16,
        checkReq: () => window.player.dimensions.infinity[0].amount.gt(0),
        getReqStr: () => "Have a First Infinity Dimension",
      },
      {
        maxLevel: () => 24,
        checkReq: () => window.player.dimensions.time[0].amount.gt(0),
        getReqStr: () => "Have a First Eternity Dimension"
      }
    ],
    perks: [
      {
        perkId: SKILL_PERKS.REOMVE_NORMAL_ITEM,
        getReq: () => 5,
        getDescription: () => "Ability to remove Normal Items"
      },
      {
        perkId: SKILL_PERKS.ROLL_MORE_ITEM,
        getReq: () => 15,
        getDescription: () => "50% chance to roll 1 more item"
      }
    ]
  }
};

const skillKeys = Object.keys(skillDatas);

export {
  SKILL_PERKS,
  skillDatas,
  skillKeys
};
