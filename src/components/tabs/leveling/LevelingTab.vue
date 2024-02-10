<script>
import LevelingBar from "./LevelingBar";
import LevelingPointDisplay from "./LevelingPointDisplay";
import LevelingRespecButton from "./LevelingRespecButton";
import LevelingSkill from "./LevelingSkill";

export default {
  name: "LevelingTab",
  components: {
    LevelingBar,
    LevelingPointDisplay,
    LevelingRespecButton,
    LevelingSkill
  }
};
</script>

<template>
  <div
    class="leveling-tab"
  >
    <LevelingBar />
    <LevelingPointDisplay />
    <LevelingRespecButton />
    <LevelingSkill skill-key="dimension" />
  </div>
</template>

<style scoped>
</style>
