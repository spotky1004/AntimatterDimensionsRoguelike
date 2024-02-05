<script>
export default {
  name: "MilkywayOverlay",
  data() {
    return {
      mulStr: "1.00",
      symbolStyle: `--transform: rotate(0deg) scale(1); --filter: grayscale(0) blur(0rem);`,
      textStyle: `--filter: grayscale(0); --trasnform: translate(0px, 0px) rotate(0deg); --font-size: 1.5rem;`
    };
  },
  methods: {
    update() {
      const t = (window.player.lastUpdate - window.player.rogue.bossFightStartTimes[0]) / 1000;
      const mul = BossDatas[BOSS_ENUM.MILKYWAY].calcDamageMultiplier().toNumber();
      this.mul = mul.toFixed(3);

      const textRotate = t ** 1.2;
      const textRotateRad = textRotate / 180 * Math.PI;
      const scale = Math.min(1 + t / 250, 10);
      this.symbolStyle = `
      --transform: rotate(${3 * t ** 1.2}deg) scale(${scale});
      --filter: grayscale(${Math.max(0, 1 - t / 1000)}) blur(${Math.min(3, t / 1000)}px);`;
      // eslint-disable-next-line
      this.textStyle = `--filter: grayscale(${Math.max(0, 1 - t / 1000)}); --trasnform: translate(calc(-50% + ${6 * scale * Math.cos(textRotateRad)}rem), calc(-50% + ${6 * scale * Math.sin(textRotateRad)}rem)) rotate(${textRotate + 90}deg); --font-size: ${1.5 * scale / 2}rem;`;
    }
  }
};
</script>

<template>
  <div
    class="milkyway-overlay"
  >
    <i
      class="milkyway-symbol fas fa-fan"
      :style="symbolStyle"
    />
    <div
      class="milkyway-multiplier"
      :style="textStyle"
    >
      x{{ mul }} <i class="fas fa-heart-crack" />
    </div>
  </div>
</template>

<style scoped>
.milkyway-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  opacity: 0.3;

  pointer-events: none;
  z-index: 100;
}

.milkyway-symbol {
  --transform: rotate(0deg) scale(1);
  --filter: grayscale(0) blur(0rem);


  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) var(--transform);

  font-size: 10rem;

  filter: var(--filter);
}

.milkyway-symbol:before {
  color: transparent;
  background-clip: text;
  background: radial-gradient(
    #000 5%,
    #815a8c
  );
  background-size: cover;
  background-clip: text;
}

.milkyway-multiplier {
  --filter: grayscale(0);
  --trasnform: translate(0px, 0px) rotate(0deg);
  --font-size: 1.5rem;


  position: absolute;
  top: 50%;
  left: 50%;

  color: #d59ee4;
  font-size: var(--font-size);

  filter: var(--filter);
  transform: var(--trasnform);
}
</style>
