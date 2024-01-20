<script>
import ItemsInventory from "./ItemsInventory";

export default {
  name: "ItemsTab",
  components: {
    ItemsInventory
  },
  data() {
    return {
      exampleNormalInventory: [
        window.GameDatabase.rogue.items.get(1001).itemGen(),
        window.GameDatabase.rogue.items.get(1002).itemGen(),
        window.GameDatabase.rogue.items.get(1003).itemGen(),
        window.GameDatabase.rogue.items.get(1004).itemGen()
      ],
      exampleDebuffInventory: [
        window.GameDatabase.rogue.items.get(2001).itemGen(),
      ]
    };
  }
};
</script>

<template>
  <div>
    <ItemsInventory
      is-special
      :name="'Special'"
      :size="2"
      :items="[]"
    />
    <div class="item-tab__divide">
      <span>
        <ItemsInventory
          :name="'Normal'"
          :size="8"
          :items="exampleNormalInventory"
        />
      </span>
      <span>
        <ItemsInventory
          is-debuff
          :name="'Debuff'"
          :size="40"
          :items="exampleDebuffInventory"
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
