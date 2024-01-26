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
    <ItemsInventory
      :name="'Normal'"
      :size="inventorySizes.normal"
      :items="normalInventory"
      :row-count="2"
    />
    <ItemsInventory
      is-debuff
      :name="'Debuff'"
      :size="inventorySizes.debuff"
      :items="debuffInventory"
      :row-count="Math.max(1, Math.ceil(debuffInventory.length / 8))"
    />
  </div>
</template>

<style scoped>
</style>
