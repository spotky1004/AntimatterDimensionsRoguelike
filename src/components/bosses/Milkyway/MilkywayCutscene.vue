<script>
import MilkywayCanvas from "@/components/bosses/Milkyway/MilkywayCanvas";

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
      height: innerHeight,
      style: "--opacity: 0;"
    };
  },
  methods: {
    update() {
      this.width = innerWidth;
      this.height = innerHeight;
      if (this.time < 2000) {
        this.style = `--opacity: ${this.time / 2000};`;
      } else if (this.time < 7000) {
        this.style = `--opacity: 1;`;
      } else if (this.time < 10000) {
        this.style = `--opacity: ${(10 - this.time / 1000) / 3};`;
      }
    }
  }
};
</script>

<template>
  <div
    class="milkyway-cutscene"
    :style="style"
  >
    <MilkywayCanvas
      class="milkyway-cutscene__canvas"
      :width="width"
      :height="height"
      :time="time"
    />
    <div class="milkyway-cutscene__overlay" />
  </div>
</template>

<style scoped>
.milkyway-cutscene {
  --opacity: 0.8;


  opacity: var(--opacity);
}

.milkyway-cutscene__overlay {
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background: radial-gradient(
    #0000 40vmin,
    #000
  );

  z-index: 2;
}
</style>
