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
        {
          id: 100,
          lv: 1,
          prop: []
        },
        {
          id: 100,
          lv: 2,
          prop: []
        },
        {
          id: 100,
          lv: 3,
          prop: []
        },
        {
          id: 100,
          lv: 4,
          prop: []
        }
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
          :items="[]"
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
