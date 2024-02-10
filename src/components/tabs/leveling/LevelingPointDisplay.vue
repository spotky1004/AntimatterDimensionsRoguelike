<script>
export default {
  name: "LevelingPointDisplay",
  data() {
    return {
      levelingPoint: 0
    };
  },
  methods: {
    update() {
      this.levelingPoint = getAvaiableLevelingPoint();
    }
  }
};
</script>

<template>
  <div
    class="leveling-point-display"
  >
    You have
    <span class="leveling-point">{{ levelingPoint }}</span>
    Leveling Point<span v-if="levelingPoint !== 1">s</span>
  </div>
</template>

<style scoped>
.leveling-point {
  font-size: 5rem;

  color: var(--color-rogue);
}
</style>
