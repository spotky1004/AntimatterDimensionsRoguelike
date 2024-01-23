<script>
export default {
  name: "HealthDisplay",
  data() {
    return {
      healthStr: "1.000",
      maxHealthStr: "1.000",
      healthDelatStr: "± 0.000",
      progressStyle: `--hp-left: 0%`,
      locked: true,
    };
  },
  methods: {
    update() {
      this.healthStr = format(Currency.hp.value, 3, 3);
      this.maxHealthStr = format(Currency.maxHp.value, 3, 3);
      const ratio = Currency.hp.value.div(Currency.maxHp.value).max(0).min(1).toNumber();
      this.progressStyle = `
        --filter: hue-rotate(-${(1 - ratio) * 100}deg) brightness(${1 + (1 - ratio) / 2});
        --hp-left: ${ratio * 100}%;
      `;

      const delta = getHpDelta();
      const sign = ["-", "±", "+"][delta.sign() + 1];
      this.healthDelatStr = `${sign} ${format(delta.abs(), 3, 3)}/s`;
      this.locked = !window.player.rogue.unlocks.hp;
    }
  }
};
</script>

<template>
  <div
    class="health-display"
    :class="{ locked }"
    :style="progressStyle"
  >
    <span class="health-display__nums">
      {{ healthStr }} / {{ maxHealthStr }} ({{ healthDelatStr }})
    </span>
    <i class="health-display-icon fas fa-heart" />
  </div>
</template>

<style scoped>
.health-display {
  --filter: hue-rotate(0deg) brightness(1);
  --hp-left: 30%;


  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2rem;

  color: #111;

  background: linear-gradient(
    90deg,
    #5e7d24 0%,
    var(--color-rogue) 48%,
    #0000 50%
  ), repeating-linear-gradient(
    45deg,
    #111 0%,
    #111 0.8%,
    #411 0.8%,
    #411 0.9%,
    #111 0.9%
  );
  filter: var(--filter);

  background-position: calc(100% - var(--hp-left)), calc(var(--hp-left) / 5);
  background-size: 200%;

  z-index: 50;
  pointer-events: all;
  user-select: none;

  border-top: 0.2rem solid #5e7d24;

  transition: 0.3s background-position;
}

.health-display.locked {
  filter: brightness(0) !important;
}

.health-display:hover::after {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  content: "Based on total antimatter";
}

.health-display__nums {
  mix-blend-mode: difference;
  color: #aaa;
}

.health-display-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 5.5rem;
  height: 5.5rem;
  padding: 0 1rem 1rem 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  font-size: 2em;

  color: #5e7d24;
  background-color: var(--color-rogue);
  border-left: 0.2rem solid #5e7d24;
  border-top: 0.2rem solid #5e7d24;
  border-radius: 100% 0 0 0;
}
</style>
