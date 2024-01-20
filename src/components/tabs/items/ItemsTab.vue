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
      normalInventory: [],
      debuffInventory: [],
      specialInventory: []
    };
  },
  methods: {
    update() {
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
      is-special
      :name="'Special'"
      :size="2"
      :items="specialInventory"
    />
    <div class="item-tab__divide">
      <span>
        <ItemsInventory
          :name="'Normal'"
          :size="8"
          :items="normalInventory"
        />
      </span>
      <span>
        <ItemsInventory
          is-debuff
          :name="'Debuff'"
          :size="40"
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
