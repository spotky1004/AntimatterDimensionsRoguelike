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
      avaiableLP: 0,
      hoveringAt: -1,
      showingPreview: false
    };
  },
  methods: {
    update() {
      const skillKey = this.skillKey;
      const data = window.GameDatabase.rogue.skillDatas[skillKey];
      this.tier = window.player.rogue.leveling.tiers[skillKey];
      this.name = data.getName(this.tier);
      this.colorStyle = `--color: ${data.getColor(this.tier)};`;
      this.maxLevel = data.tiers[this.tier].getMaxLevel();
      this.avaiableLP = getAvaiableLevelingPoint();
      this.allocated = window.player.rogue.leveling.allocates[skillKey];

      if (
        this.hoveringAt > this.allocated &&
        this.isAvaiable(this.hoveringAt)
      ) {
        this.showingPreview = true;
      } else {
        this.showingPreview = false;
      }
      const showingLevel = this.showingPreview ? this.hoveringAt : this.allocated;
      this.effectStr = data.getEffectStr(this.tier, showingLevel);

      this.perkStrs = Array(this.maxLevel + 1).fill(null);
      for (const perk of data.perks) {
        const req = perk.getReq();
        this.perkStrs[req] = perk.getDescription();
      }
    },
    buy(idx) {
      if (!this.isAvaiable(idx)) return;
      window.player.rogue.leveling.allocates[this.skillKey] = idx;
    },
    isBought(idx) {
      return this.allocated >= idx;
    },
    willBuy(idx) {
      return !this.isBought(idx) && this.showingPreview && this.hoveringAt >= idx;
    },
    isAvaiable(idx) {
      return !this.isBought(idx) && this.allocated + this.avaiableLP >= idx;
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
    :class="{ 'is-preview': showingPreview }"
    :style="colorStyle"
  >
    <div
      class="leveling-skill__name"
    >
      {{ name }}
    </div>
    <div
      class="leveling-skill__bar"
      @mouseout="hoveringAt = -1"
    >
      <span
        v-for="i in maxLevel"
        :key="i"
        class="leveling-skill__bar__cell"
        :class="{
          'has-perk': perkStrs[i] !== null,
          'bought': isBought(i),
          'will-buy': willBuy(i),
          'avaiable': isAvaiable(i)
        }"
        @click="buy(i)"
        @mouseover="hoveringAt = i"
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
      <span v-if="!showingPreview">provides</span>
      <span v-else>will provide</span>
      {{ effectStr }}
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
  z-index: 1;
  user-select: none;
  pointer-events: none;
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
  z-index: 0;
}
.leveling-skill:hover > .leveling-skill__bar {
  top: 0;
  height: 9.5rem;
}

.leveling-skill__bar__cell {
  position: relative;
  flex: 1 1;

  filter: brightness(0.4);
  background-color: var(--color);

  user-select: none;
  transition: flex-grow 0.3s, filter 0.3s;
  overflow: hidden;
}
.leveling-skill__bar__cell.avaiable {
  filter: brightness(0.6);
}
.leveling-skill__bar__cell.will-buy {
  filter: brightness(1.2);
}
.leveling-skill__bar__cell.bought {
  filter: brightness(1);
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

.leveling-skill__bar__cell > * {
  pointer-events: none;
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
  transition: opacity 0.3s, top 0.3s;
}
.leveling-skill__bar__cell:nth-child(5n) > .leveling-skill__bar__cell_idx {
  color: #666;
  font-size: 3rem;
}
.leveling-skill__bar__cell:not(:last-child) {
  border-right: 0.2rem solid #333;
}
.leveling-skill__bar__cell.has-perk:hover > .leveling-skill__bar__cell_idx {
  top: -4rem;
  opacity: 0;
}

.leveling-skill__bar__perk {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 8rem;
  width: 80%;
  height: 100%;
  margin: 0 10%;

  color: #fff;

  opacity: 0;

  z-index: 10;
  transition: opacity 0.3s, top 0.3s;
}
.leveling-skill__bar__cell:hover > .leveling-skill__bar__perk {
  top: 0;
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

  transition: font-size 0.3s, bottom 0.3s, color 0.3s;
}
.leveling-skill__bar__cell:hover > .leveling-skill__bar__perk-mark {
  bottom: -2.7rem;

  font-size: 7rem;
  color: #111;
}

.leveling-skill__effect {
  position: absolute;
  top: 10rem;
  left: 1rem;

  font-size: 1.5rem;
  color: var(--color);
  filter: brightness(0.7);
}
.leveling-skill.is-preview > .leveling-skill__effect {
  filter: brightness(1);
}
</style>
