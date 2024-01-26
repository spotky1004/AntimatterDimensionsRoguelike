<script>
import { deepmergeAll } from "@/utility/deepmerge";
import ItemTooltip from "@/components/ItemTooltip";

export default {
  name: "ItemComponent",
  components: {
    ItemTooltip
  },
  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({ id: -1 })
    },
    advanced: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      hover: false,
      itemData: deepmergeAll([{}, GameDatabase.rogue.items.get(this.item.id) ?? { id: -1 }]),
      xpHave: 0,
      xpReq: 0,
      xpProgressStyle: `--progress: 0%;`
    };
  },
  methods: {
    update() {
      if (this.item && this.item.id !== -1) {
        const tier = window.GameDatabase.rogue.getItemTier(this.itemData);
        this.xpHave = window.player.rogue.itemXps[this.item.id];
        this.xpReq = this.itemData.xpReqs[tier] ?? Infinity;
        if (isFinite(this.xpReq)) {
          this.xpProgressStyle = `--progress: ${this.xpHave / this.xpReq * 100}%;`;
        } else {
          this.xpProgressStyle = `--progress: 100%;`;
        }
      }
    },
    getLevelRoman() {
      return Notations.find("Roman").format(this.item.lv);
    }
  }
};
</script>

<template>
  <div
    class="rogue-item-wrapper"
    :class="{
      empty: item.id === -1,
      normal: itemData.type === 'normal',
      debuff: itemData.type === 'debuff',
      special: itemData.type === 'special',
    }"
  >
    <div
      v-if="advanced"
      class="rogue-item__exp"
      :class="{ hover }"
      :style="xpProgressStyle"
    >
      <span>{{ xpHave }}</span><span v-if="isFinite(xpReq)">&nbsp;/ {{ xpReq }}</span>
    </div>
    <div
      class="rogue-item"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @blur="hover = false"
    >
      <div v-if="item.id !== -1">
        <div
          class="rogue-item__icon"
          v-html="itemData.icon"
        />
        <div
          class="rogue-item__lv"
        >
          {{ getLevelRoman() }}
        </div>
      </div>
      <div v-else />
    </div>
    <ItemTooltip
      v-if="hover"
      :item="item"
      :item-data="itemData"
      :advanced="advanced"
    />
  </div>
</template>

<style scoped>
.rogue-item-wrapper {
  --color1: #888;
  --color2: #555;
  --color3: #222;
  --color4: #111;


  position: relative;
}

.rogue-item-wrapper.special {
  --color1: var(--color-item-special);
  --color2: var(--color-item-special-dark1);
  --color3: var(--color-item-special-dark2);
  --color4: var(--color-item-special-dark3);
}

.rogue-item-wrapper.debuff {
  --color1: var(--color-item-debuff);
  --color2: var(--color-item-debuff-dark1);
  --color3: var(--color-item-debuff-dark2);
  --color4: var(--color-item-debuff-dark3);
}

.rogue-item {
  position: relative;

  width: 6rem;
  height: 8rem;

  user-select: none;
  box-shadow: 0 0 3rem var(--color3) inset;

  background: linear-gradient(
    -25deg,
    #fff0 30%,
    var(--color2) 60%,
    #fff0 90%
  ), var(--color4);
  background-size: 500%;

  z-index: 1;
  transition: 0.2s perspective, 0.2s transform, 0.2s background-size, 0.2s filter, 0.2s box-shadow;
}

.rogue-item:not(.empty) {
  border: 0.2rem solid var(--color1);
}
.rogue-item:not(.empty):hover {
  perspective: 30rem;
  filter: brightness(1.2) drop-shadow(1.5rem 1.5rem 1rem var(--color4));
  box-shadow: 0 0 3rem var(--color4) inset;
  transform: scale(1.4) rotateY(-15deg) rotateX(35deg);
  background-size: 300%;

  z-index: 101;
}

.rogue-item__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  color: var(--color2);
  filter: brightness(1.5);
  font-size: 3rem;
}

.rogue-item__lv {
  position: absolute;
  bottom: -1rem;
  right: -0.3rem;
  padding: 0.1rem 0.7rem;

  color: var(--color2);
  filter: brightness(1.1);
  font-size: 1.8em;
  font-weight: 900;
  letter-spacing: -0.9rem;
}

.rogue-item__exp {
  --progress: 0%;


  display: flex;
  justify-content: center;
  align-content: center;
  width: 50%;
  height: 0.7rem;
  margin-bottom: 0.2rem;

  color: #aaa;
  font-size: 0.7em;

  background: linear-gradient(
    90deg,
    var(--color1) var(--progress),
    var(--color2) var(--progress)
  );
  border-radius: 0.2rem;

  transition: 0.2s transform, 0.2s width;
}

.rogue-item__exp > span {
  mix-blend-mode: difference;
  color: #444;
  font-size: 0.8em;

  opacity: 0;

  transition: 0.2s opacity;
}

.rogue-item__exp.hover {
  width: 90%;
  transform: translate(1rem, -1rem) scale(1.4);

  z-index: 10;
}

.rogue-item__exp.hover > span {
  opacity: 1;
}
</style>
