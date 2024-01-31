<script>
import MilkywayCanvas from "@/components/boss-cutscenes/Milkyway/MilkywayCanvas";

export default {
  name: "MilkywayCutscene",
  components: {
    MilkywayCanvas
  },
  props: {
    time: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      width: innerWidth,
      height: innerHeight
    };
  },
  methods: {
    update() {
      this.width = innerWidth;
    }
  }
};
</script>

<template>
  <div>
    <MilkywayCanvas
      :width="width"
      :height="height"
      :time="time"
    />
  </div>
</template>

<style scoped>
</style>
