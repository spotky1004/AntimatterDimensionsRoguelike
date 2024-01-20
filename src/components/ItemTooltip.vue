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
  data() {
    return {
      t: 0,
      intervalId: null
    };
  },
  mounted() {
    this.intervalId = setInterval(() => this.t++);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
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
      :key="t"
      class="rogue-item__tooltip__name"
      v-html="getName()"
    />
    <div
      :key="t + 1"
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

  border: 0.2rem solid var(--color1);
  background-color: var(--color2);
  box-shadow: 0 0 2rem var(--color4) inset;
  border-radius: 0.4rem;

  z-index: 100;
  animation: ItemTooltipAppear 0.2s ease-in 0s forwards;

  user-select: none;
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

.rogue-item__tooltip__name {
  margin: 0 0 1rem 0;
  padding: 0 1rem;

  font-size: 1.4em;
  font-weight: bold;
  letter-spacing: -0.2rem;
  text-align: left;

  color: #fff;
  background: linear-gradient(
    90deg,
    var(--color3),
    #0000
  );
}

.rogue-item__tooltip__description {
  margin-bottom: 1rem;

  color: #fff;
  max-width: 20rem;
}

.rogue-item__tooltip.special > .rogue-item__tooltip__description {
  color: #222;
}
</style>
