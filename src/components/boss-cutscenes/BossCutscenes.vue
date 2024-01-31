<script>
import MilkywayCutscene from "@/components/boss-cutscenes/Milkyway/MilkywayCutscene";

export default {
  name: "BossCutscenes",
  components: {
    MilkywayCutscene
  },
  data() {
    return {
      id: -1,
      time: 0,
    };
  },
  methods: {
    update() {
      this.id = window.player.rogue.cutsceneId;
      this.time = window.player.rogue.cutsceneTime;
    }
  }
};
</script>

<template>
  <div
    class="boss-cutscene"
  >
    <MilkywayCutscene
      v-if="id === 0 && time <= 5000000"
      :time="time"
    />
  </div>
</template>

<style scoped>
.boss-cutscene {
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background-color: #000;
}
</style>
