<script>
import LevelingBar from "./LevelingBar";
import LevelingSkill from "./LevelingSkill";

export default {
  name: "LevelingTab",
  components: {
    LevelingBar,
    LevelingSkill
  }
};
</script>

<template>
  <div
    class="leveling-tab"
  >
    <LevelingBar />
    <LevelingSkill skill-key="dimension" />
  </div>
</template>

<style scoped>
</style>
