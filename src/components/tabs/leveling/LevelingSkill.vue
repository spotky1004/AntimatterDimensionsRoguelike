<script>
export default {
  name: "LevelingSkill",
  props: {
    skillKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      name: "Unknown",
      effectStr: "None",
      colorStyle: "--color: #fff;",
      tier: 0,
      allocated: 0,
      maxLevel: 0,
      perkStrs: [],
    };
  },
  methods: {
    update() {
      const skillKey = this.skillKey;
      const data = window.GameDatabase.rogue.skillDatas[skillKey];
      this.tier = window.player.rogue.leveling.tiers[skillKey];
      this.name = data.getName(this.tier);
      this.allocated = window.player.rogue.leveling.allocates[skillKey];
      this.effectStr = data.getEffectStr(this.tier, this.allocated);
      this.colorStyle = `--color: ${data.getColor(this.tier)};`;
      this.maxLevel = data.tiers[this.tier].getMaxLevel();

      this.perkStrs = Array(this.maxLevel + 1).fill(null);
      for (const perk of data.perks) {
        const req = perk.getReq();
        this.perkStrs[req] = perk.getDescription();
      }
    },
    getEffectStrAt(allocated) {
      return data.getEffectStr(this.tier, allocated);
    }
  }
};
</script>

<template>
  <div
    class="leveling-skill"
    :style="colorStyle"
  >
    <div
      class="leveling-skill__name"
    >
      {{ name }}
    </div>
    <div
      class="leveling-skill__bar"
    >
      <span
        v-for="i in maxLevel"
        :key="i"
        class="leveling-skill__bar__cell"
        :class="{ 'has-perk': perkStrs[i] !== null }"
      >
        <div
          class="leveling-skill__bar__cell_idx"
        >
          {{ i }}
        </div>
        <div
          v-if="perkStrs[i] !== null"
          class="leveling-skill__bar__perk"
        >
          {{ perkStrs[i] }}
        </div>
        <div
          v-if="perkStrs[i] !== null"
          class="leveling-skill__bar__perk-mark"
        >
          <i class="fas fa-star" />
        </div>
      </span>
    </div>
    <div
      class="leveling-skill__effect"
    >
      provides {{ effectStr }}
    </div>
  </div>
</template>

<style scoped>
.leveling-skill {
  --color: #fff;


  position: relative;
  margin: 1rem auto 3rem auto;
  width: 80%;
  height: 10rem;
}

.leveling-skill__name {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 1rem;

  color: var(--color);
  font-size: 3rem;
  font-weight: bold;
  text-align: left;

  transition:
    font-size 0.3s,
    mix-blend-mode 0.3s,
    color 0.3s;
  z-index: 10;
  user-select: none;
}
.leveling-skill:hover > .leveling-skill__name {
  mix-blend-mode: difference;
  color: #1114;
  font-size: 6.5rem;

  pointer-events: none;
}

.leveling-skill__bar {
  position: absolute;
  top: 4.5rem;
  width: 100%;
  display: flex;
  height: 5rem;

  border: 0.2rem solid var(--color);
  border-radius: 1rem;

  transition: height 0.3s, top 0.3s;
}
.leveling-skill:hover > .leveling-skill__bar {
  top: 0;
  height: 9.5rem;
}

.leveling-skill__bar__cell {
  position: relative;
  flex: 1 1;

  filter: brightness(0.5);
  background-color: var(--color);

  user-select: none;
  transition: flex-grow 0.3s;
  overflow: hidden;
}
.leveling-skill__bar__cell:first-child {
  border-radius: 1rem 0 0 1rem;
}
.leveling-skill__bar__cell:last-child {
  border-radius: 0 1rem 1rem 0;
}
.leveling-skill__bar__cell:nth-child(5n) {
  color: #999;
}
.leveling-skill__bar__cell.has-perk:hover {
  flex: 2 2;
}

.leveling-skill__bar__cell_idx {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  mix-blend-mode: difference;
  color: #333;
  font-size: 2rem;

  z-index: 9;
  transition: opacity 0.3s;
}
.leveling-skill__bar__cell:nth-child(5n) > .leveling-skill__bar__cell_idx {
  color: #666;
  font-size: 3rem;
}
.leveling-skill__bar__cell:not(:last-child) {
  border-right: 0.2rem solid #333;
}
.leveling-skill__bar__cell.has-perk:hover > .leveling-skill__bar__cell_idx {
  opacity: 0;
}

.leveling-skill__bar__perk {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 80%;
  height: 100%;
  margin: 0 10%;

  color: #fff;

  opacity: 0;

  z-index: 10;
  transition: opacity 0.3s;
}
.leveling-skill__bar__cell:hover > .leveling-skill__bar__perk {
  opacity: 1;
}

.leveling-skill__bar__perk-mark {
  position: absolute;
  bottom: -1.7rem;
  right: -0.5rem;

  color: #222;
  mix-blend-mode: difference;
  font-size: 5rem;

  transform: rotate(-30deg);

  transition: font-size 0.3s, bottom 0.3s;
}
.leveling-skill__bar__cell:hover > .leveling-skill__bar__perk-mark {
  bottom: -2.7rem;
  font-size: 7rem;
}

.leveling-skill__effect {
  position: absolute;
  top: 10rem;
  left: 1rem;

  font-size: 1.5rem;
  color: var(--color);
  filter: brightness(0.7);
}
</style>
