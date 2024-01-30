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
  <div
    class="collection-tab"
  >
    <ItemGrid
      :items="items"
      :cols="8"
      :advanced="true"
      :font-size="'1em'"
    />
  </div>
</template>

<style scoped>
.collection-tab {
  position: relative;
  padding: 3rem;
  margin: 1.5rem auto;
  width: 90rem;

  border: 0.2rem solid var(--color-rogue);
  border-radius: 0.4rem;
  background: linear-gradient(
    270deg,
    var(--color-rogue) -2%,
    #222 5%
  );
}

.collection-tab::after {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  content: "Collection";
  writing-mode: vertical-rl;
  text-orientation: sideways;
  color: #111;
  font-size: 2em;
  font-weight: bold;

  opacity: 0.7;
}
</style>
