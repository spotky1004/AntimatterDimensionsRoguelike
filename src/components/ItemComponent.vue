<script>
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
    }
  },
  data() {
    return {
      hover: false,
      itemData: GameDatabase.rogue.items.get(this.item.id) ?? {}
    };
  },
  methods: {
    getLevelRoman() {
      return Notations.find("Roman").format(this.item.lv);
    }
  }
};
</script>

<template>
  <div class="rogue-item-wrapper">
    <div
      class="rogue-item"
      :class="{
        empty: item.id === -1,
        normal: itemData.type === 'normal',
        debuff: itemData.type === 'debuff',
        special: itemData.type === 'special',
      }"
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
    />
  </div>
</template>

<style scoped>
  .rogue-item-wrapper {
    position: relative;
  }

  .rogue-item {
    position: relative;

    width: 6rem;
    height: 8rem;

    user-select: none;
    background-color: #222;
    box-shadow: 0 0 3rem #333 inset;

    background: linear-gradient(
      -25deg,
      #fff0 30%,
      #fff5 60%,
      #fff0 90%
    ), #222;
    background-size: 500%;

    z-index: 1;
    transition: 0.2s perspective, 0.2s transform, 0.2s background-size, 0.2s filter, 0.2s box-shadow;
  }

  .rogue-item:not(.empty) {
    border: 0.2rem solid #666;
  }
  .rogue-item:not(.empty):hover {
    perspective: 30rem;
    filter: brightness(1.2) drop-shadow(1.5rem 1.5rem 1rem #000a);
    box-shadow: 0 0 3rem #111 inset;
    transform: scale(1.4) rotateY(-15deg) rotateX(35deg);
    background-size: 300%;

    z-index: 101;
  }

  .special {
    background-color: var(--color-item-special-dark3);
    box-shadow: 0 0 3rem var(--color-item-special-dark2) inset;
  }
  .special:not(.empty) {
    border: 0.2rem solid var(--color-item-special-dark1);
  }

  .debuff {
    background-color: var(--color-item-debuff-dark3);
    box-shadow: 0 0 3rem var(--color-item-debuff-dark2) inset;
  }
  .debuff:not(.empty) {
    border: 0.2rem solid var(--color-item-debuff-dark1);
  }

  .rogue-item__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    mix-blend-mode: difference;
    color: #ccc;
    font-size: 3rem;
  }

  .rogue-item__lv {
    position: absolute;
    bottom: -1rem;
    right: -0.3rem;
    padding: 0.1rem 0.7rem;

    mix-blend-mode: difference;
    color: #bbb;
    font-size: 1.8em;
    font-weight: 900;
    letter-spacing: -0.9rem;
  }
</style>
