<script>
import ItemGrid from "@/components/ItemGrid";

export default {
  name: "CollectionTab",
  components: {
    ItemGrid
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    update() {
      const items = [];
      for (const [itemId, itemData] of window.GameDatabase.rogue.items) {
        const isUnlocked = window.player.rogue.itemsUnlocked[itemId];
        if (isUnlocked) {
          const tier = window.GameDatabase.rogue.getItemTier(itemData);
          const item = window.GameDatabase.rogue.genItem(itemData, 0, tier + 1);
          items.push(item);
        } else {
          items.push({ id: -1 });
        }
      }
      this.items = items;
    }
  },
};
</script>

<template>
  <div>
    <ItemGrid
      :items="items"
      :cols="8"
      :advanced="true"
      :font-size="'1em'"
    />
  </div>
</template>

<style scoped>
</style>
