<script>
export default {
  name: "ItemTooltip",
  props: {
    item: {
      type: Object,
      required: true
    },
    itemData: {
      type: Object,
      required: true
    }
  },
  methods: {
    getName() {
      return this.itemData.nameStr(this.item.lv, this.item.props);
    },
    getDescription() {
      return this.itemData.descriptionStr(this.item.lv, this.item.props);
    }
  }
};
</script>

<template>
  <div
    class="rogue-item__tooltip"
    :class="{
      empty: item.id === -1,
      normal: itemData.type === 'normal',
      debuff: itemData.type === 'debuff',
      special: itemData.type === 'special',
    }"
  >
    <div
      class="rogue-item__tooltip__name"
      v-html="getName()"
    />
    <div
      class="rogue-item__tooltip__description"
      v-html="getDescription()"
    />
  </div>
</template>

<style scoped>
.rogue-item__tooltip {
  position: absolute;
  right: -22rem;
  top: 0;

  --color1: #888;
  --color2: #555;
  --color3: #333;
  --color4: #111;

  border: 0.2rem solid var(--color1);
  background-color: var(--color2);
  box-shadow: 0 0 2rem var(--color4) inset;
  border-radius: 0.4rem;

  z-index: 100;
  animation: ItemTooltipAppear 0.2s ease-in 0s forwards;
}

@keyframes ItemTooltipAppear {
  from {
    opacity: 0;
    transform: translateX(-6rem);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-8rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.rogue-item__tooltip.special {
  --color1: var(--color-rogue-special);
  --color2: var(--color-rogue-special-dark1);
  --color3: var(--color-rogue-special-dark2);
  --color4: var(--color-rogue-special-dark3);
}

.rogue-item__tooltip.debuff {
  --color1: var(--color-rogue-debuff);
  --color2: var(--color-rogue-debuff-dark1);
  --color3: var(--color-rogue-debuff-dark2);
  --color4: var(--color-rogue-debuff-dark3);
}

.rogue-item__tooltip__name {
  margin: 0 0 1rem 0;
  padding: 0 1rem;

  font-size: 1.4em;
  font-weight: bold;
  letter-spacing: -0.2rem;
  text-align: left;

  background: linear-gradient(
    90deg,
    var(--color4),
    #0000
  );
}

.rogue-item__tooltip__description {
  margin-bottom: 1rem;

  max-width: 20rem;
}
</style>
