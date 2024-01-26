<script>
import ItemComponent from "@/components/ItemComponent";

export default {
  name: "ItemGrid",
  components: {
    ItemComponent
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    cols: {
      type: Number,
      default: 8,
      required: false
    },
    advanced: {
      type: Boolean,
      default: false,
      required: false
    },
    fontSize: {
      type: String,
      default: "1em",
      required: false
    }
  },
  data() {
    return {
      rows: Math.ceil(this.items.length / this.cols),
      style: `
      --font-size: ${this.fontSize};
      --col-count: ${Math.min(this.items.length, this.cols)};
      --row-count: ${Math.ceil(this.items.length / this.cols)};`
    };
  }
};
</script>

<template>
  <div
    class="rogue-item-grid"
    :class="{ advanced }"
    :style="style"
  >
    <span
      v-for="(item, i) in items"
      :key="i"
    >
      <ItemComponent
        v-if="item && item.id !== -1"
        class="rogue-item-grid__item"
        :item="item"
        :advanced="advanced"
      />
      <div
        v-else
        class="rogue-item-grid__empty"
      >
        <i class="fas fa-question" />
      </div>
    </span>
  </div>
</template>

<style scoped>
.rogue-item-grid {
  --font-size: 1em;
  --col-count: 8;
  --row-count: 1;


  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(var(--col-count), 7rem);
  grid-template-rows: repeat(var(--row-count), 1fr);
  column-gap: 0.6rem;
  row-gap: 0.3rem;

  font-size: var(--font-size);
}

.rogue-item-grid__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 8rem;

  font-size: 3rem;
  color: #444;
  text-shadow: 0 0 0.5rem #000;

  background-color: #222;
  box-shadow: 0 0 2rem #111 inset;
}

.rogue-item-grid.advanced .rogue-item-grid__empty {
  margin-top: 0.9rem;
}

.rogue-item-grid__item:hover {
  z-index: 10;
}
</style>
