<script>
import { deepmergeAll } from "@/utility/deepmerge";
import ItemsInventory from "./ItemsInventory";

export default {
  name: "ItemsTab",
  components: {
    ItemsInventory
  },
  data() {
    return {
      specialUnlocked: window.player.rogue.unlocks.special,
      inventorySizes: getInventorySize(),
      normalInventory: [],
      debuffInventory: [],
      specialInventory: []
    };
  },
  methods: {
    update() {
      this.specialUnlocked = window.player.rogue.unlocks.special;
      this.inventorySizes = getInventorySize();
      this.normalInventory = deepmergeAll([[], window.player.rogue.normalItems]);
      this.debuffInventory = deepmergeAll([[], window.player.rogue.debuffItems]);
      this.specialInventory = deepmergeAll([[], window.player.rogue.specialItems]);
    }
  }
};
</script>

<template>
  <div>
    <ItemsInventory
      v-if="specialUnlocked"
      is-special
      :name="'Special'"
      :size="inventorySizes.special"
      :items="specialInventory"
    />
    <div class="item-tab__divide">
      <span>
        <ItemsInventory
          :name="'Normal'"
          :size="inventorySizes.normal"
          :items="normalInventory"
        />
      </span>
      <span>
        <ItemsInventory
          is-debuff
          :name="'Debuff'"
          :size="inventorySizes.debuff"
          :items="debuffInventory"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.item-tab__divide {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.item-tab__divide > span {
  width: 60rem;
}
</style>
