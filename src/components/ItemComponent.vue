<script>
export default {
  name: "ItemComponent",
  props: {
    item: {
      type: Object,
      required: false
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
}
</script>

<template>
  <div
    class="rogue-item"
    :class="{ empty: !item, special: isSpecial, debuff: isDebuff }"
  >
    <div v-if="item">
      <div>
        Nr.{{ item.id }}
      </div>
    </div>
    <div v-else>
      
    </div>
  </div>
</template>

<style scoped>
  .rogue-item {
    width: 6rem;
    height: 8rem;

    user-select: none;
    background-color: #222;
    box-shadow: 0 0 3rem #333 inset;
  }
  .rogue-item:not(.empty) {
    border: 0.2rem solid #666;
  }

  .special {
    background-color: var(--color-item-special-dark3);
    box-shadow: 0 0 3rem var(--color-item-special-dark2) inset;
  }
  .special:not(.empty) {
    border: 0.2rem solid var(--color-item-special-dark1);
  }

  .debuff {
    background-color: var(--color-item-debuff-dark3);
    box-shadow: 0 0 3rem var(--color-item-debuff-dark2) inset;
  }
  .debuff:not(.empty) {
    border: 0.2rem solid var(--color-item-debuff-dark1);
  }
</style>
