<script>
import ItemComponent from "@/components/ItemComponent";

export default {
  name: "ItemsInventory",
  components: {
    ItemComponent
  },
  props: {
    name: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    isSpecial: {
      type: Boolean,
      required: false,
      default: false
    },
    isDebuff: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      colCount: 8,
      rowCount: this.isSpecial ? 1 : 5
    };
  }
};
</script>

<template>
  <div
    class="items-inventory"
    :class="{ special: isSpecial, debuff: isDebuff }"
  >
    <div class="items-inventory__name">
      {{ name }}
    </div>
    <div
      v-for="row in rowCount"
      :key="row"
      class="items-inventory__row"
    >
      <div
        v-for="col in colCount"
        :key="col"
        class="items-inventory__cell"
        :class="{ locked: (row - 1) * colCount + (col - 1) >= size }"
      >
        <ItemComponent
          v-if="(row - 1) * colCount + (col - 1) < Math.min(items.length, size)"
          :is-special="isSpecial"
          :is-debuff="isDebuff"
          :item="items[(row - 1) * colCount + (col - 1)]"
        />
        <div
          v-else
        >
          <div
            v-if="(row - 1) * colCount + (col - 1) >= size"
          >
            <i class="fas fa-lock" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-inventory {
  width: 54.4rem;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.items-inventory__name {
  width: 100%;

  text-align: left;
  font-size: 2.5rem;
  font-weight: bold;
}

.items-inventory__row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.items-inventory__cell {
  width: 6rem;
  height: 8rem;
  margin: 0.4rem;

  background-color: #555;
  box-shadow: 0 0 3rem #0008 inset;
}

.items-inventory.special .items-inventory__cell {
  background-color: var(--color-item-special-dark3);
  box-shadow: 0 0 3rem var(--color-item-special-dark2) inset;
}

.items-inventory.debuff .items-inventory__cell {
  background-color: var(--color-item-debuff-dark3);
  box-shadow: 0 0 3rem var(--color-item-debuff-dark2) inset;
}

.items-inventory__cell.locked {
  background-color: #111;
}

.items-inventory.special .items-inventory__cell.locked {
  background-color: var(--color-item-special-dark3);
}

.items-inventory__cell.locked > div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 4em;
  color: #111;
  mix-blend-mode: difference;
}
</style>
