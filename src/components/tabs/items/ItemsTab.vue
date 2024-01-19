<script>
import ItemsInventory from "./ItemsInventory";

export default {
  name: "ItemsTab",
  components: {
    ItemsInventory
  },
  data() {
    return {
      exampleInventory: [
        {
          id: 100,
          prop: []
        },
        {
          id: 101,
          prop: [5]
        }
      ]
    }
  }
}
</script>

<template>
  <div>
    <ItemsInventory
      is-special
      :name="'Special'"
      :size="3"
      :items="exampleInventory"
    />
    <div class="item-tab__divide">
      <span>
        <ItemsInventory
          :name="'Normal'"
          :size="10"
          :items="exampleInventory"
        />
      </span>
      <span>
        <ItemsInventory
          is-debuff
          :name="'Debuff'"
          :size="40"
          :items="exampleInventory"
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
