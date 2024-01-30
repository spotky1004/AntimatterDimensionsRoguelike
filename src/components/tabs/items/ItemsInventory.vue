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
    },
    rowCount: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      colCount: 8
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
        <div v-else>
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
  --color1: #888;
  --color2: #555;
  --color3: #222;
  --color4: #111;


  position: relative;
  width: 90rem;
  margin: 1.5rem auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(
    270deg,
    var(--color1) -2%,
    var(--color3) 5%
  );
  border-radius: 0.4rem;
  box-shadow: 0 0 3rem var(--color4) inset;
  border: 0.2rem solid var(--color1);
}

.items-inventory.special {
  --color1: var(--color-item-special);
  --color2: var(--color-item-special-dark1);
  --color3: var(--color-item-special-dark2);
  --color4: var(--color-item-special-dark3);
}

.items-inventory.debuff {
  --color1: var(--color-item-debuff);
  --color2: var(--color-item-debuff-dark1);
  --color3: var(--color-item-debuff-dark2);
  --color4: var(--color-item-debuff-dark3);
}

.items-inventory__name {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  mix-blend-mode: difference;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  color: #222;
  text-align: left;
  font-size: 2.2rem;
  font-weight: bold;

  user-select: none;
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

  background-color: var(--color3);
  box-shadow: 0 0 3rem var(--color4) inset;
}

.items-inventory__cell.locked {
  background-color: var(--color3);
}

.items-inventory__cell.locked > div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2em;
  color: var(--color3);
  filter: drop-shadow(0 0 0.2rem var(--color2));
}
</style>
