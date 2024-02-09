/**
 * @typedef SkillTierReq
 * @prop {() => number} maxLevel
 * @prop {() => boolean} req
 * @prop {() => boolean} reqStr
 */
/**
 * @typedef SkillPerk
 * @prop {number} perkId
 * @prop {() => number} req
 * @prop {() => string} description
 */
/**
 * @typedef SkillData
 * @prop {(tier: number) => string} name
 * @prop {(tier: number) => string} color
 * @prop {(effect: RogueEffects, lv: number, tier: number) => void} calcEffect
 * @prop {SkillTierReq[]} tierReqs
 * @prop {SkillPerk[]} perks
 */
/**
 * @typedef {"dimension"} SkillNames
 */

export const SKILL_PERKS = {
  REOMVE_NORMAL_ITEM: 0,
  ROLL_MORE_ITEM: 1
};

/** @type {{ [K in SkillNames]: SkillData }} */
export const skillDatas = {
  dimension: {
    name: () => "Dimension",
    color: () => "#89cf11",
    calcEffect: (effect, lv) => {
      effect.adAllMult = effect.adAllMult.mul(1 + lv);
    },
    tierReqs: [
      {
        maxLevel: () => 8,
        req: () => true,
        reqStr: () => "Hello!",
      },
      {
        maxLevel: () => 16,
        req: () => true,
        reqStr: () => "Unlock Infinity Dimensions",
      }
    ],
    perks: [
      {
        perkId: SKILL_PERKS.REOMVE_NORMAL_ITEM,
        req: () => 5,
        description: () => "Ability to remove Normal Items"
      },
      {
        perkId: SKILL_PERKS.ROLL_MORE_ITEM,
        req: () => 15,
        description: () => "50% chance to roll 1 more item"
      }
    ]
  }
};
