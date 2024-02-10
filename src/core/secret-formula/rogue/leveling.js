/**
 * @typedef SkillTier
 * @prop {() => number} getMaxLevel
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
 * @prop {(tier: number, level: number) => string} getEffectStr
 * @prop {(effect: RogueEffects, tier: number, lv: number) => void} calcEffect
 * @prop {SkillTier[]} tiers
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
    getColor: tier => ["#df5050", "#cf8d11", "#8623b8"][tier],
    getEffectStr: (tier, lv) => {
      let str = "";
      str += `x${1 + lv} AD`;
      if (tier >= 1) str += `, x${1 + lv} ID`;
      if (tier >= 2) str += `, x${1 + lv} ED`;
      return str;
    },
    calcEffect: (effect, tier, lv) => {
      effect.adAllMult = effect.adAllMult.mul(1 + lv);
      // TODO: Boost all ID on tier 1
      // TODO: Boost all ED on tier 2
    },
    tiers: [
      {
        getMaxLevel: () => 8,
        checkReq: () => true,
        getReqStr: () => "Hello!",
      },
      {
        getMaxLevel: () => 16,
        checkReq: () => window.player.dimensions.infinity[0].amount.gt(0),
        getReqStr: () => "Have a First Infinity Dimension",
      },
      {
        getMaxLevel: () => 24,
        checkReq: () => window.player.dimensions.time[0].amount.gt(0),
        getReqStr: () => "Have a First Eternity Dimension"
      }
    ],
    perks: [
      {
        perkId: SKILL_PERKS.REOMVE_NORMAL_ITEM,
        getReq: () => 6,
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
