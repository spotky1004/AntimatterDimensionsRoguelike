<script>
import MilkywayOverlay from "@/components/bosses/Milkyway/MilkywayOverlay";

export default {
  name: "BossSymbols",
  components: {
    MilkywayOverlay
  },
  data() {
    return {
      fightings: Array(10).fill(false)
    };
  },
  methods: {
    update() {
      this.fightings = [...window.player.rogue.bossFightings];
    }
  }
};
</script>

<template>
  <div
    id="boss-symbols"
  >
    <MilkywayOverlay v-if="fightings[0]" />
  </div>
</template>

<style scoped>
</style>
