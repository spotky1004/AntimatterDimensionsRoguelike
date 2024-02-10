<script>
export default {
  name: "LevelingRespecButton",
  data() {
    return {
      respecOnNextRun: false
    };
  },
  methods: {
    update() {
      this.respecOnNextRun = window.player.rogue.leveling.respecOnNextRun;
    },
    toggleRespec() {
      window.player.rogue.leveling.respecOnNextRun = !window.player.rogue.leveling.respecOnNextRun;
    }
  }
};
</script>

<template>
  <div
    class="leveling-respec-btn o-primary-btn"
    :class="{ toggled: respecOnNextRun }"
    @click="toggleRespec"
  >
    Respec on next run
  </div>
</template>

<style scoped>
.leveling-respec-btn {
  margin: 0 auto;
  width: 30rem;
  height: 3rem;
}

.leveling-respec-btn.toggled {
  background-color: var(--color-rogue);
  color: #000;
}
</style>
