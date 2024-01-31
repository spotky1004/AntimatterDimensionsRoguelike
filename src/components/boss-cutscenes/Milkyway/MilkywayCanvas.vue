<script>
const BOSS_NAME = "Milkyway Galaxy";

const colorRange = [
  [85, 123],
  [55, 61],
  [136, 125]
];
function getColor(x) {
  const col = [];
  for (let i = 0; i < 3; i++) {
    const [l, r] = colorRange[i];
    col.push(l * (0.5 - x / 2) + r * (x / 2 + 0.5));
  }
  return `rgb(${col.join(", ")})`;
}

export default {
  name: "MilkywayCanvas",
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
  },
  computed: {
    size() {
      return Math.min(innerHeight, innerWidth);
    },
    pixelPositions() {
      const size = this.size;

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = size;
      tmpCanvas.height = size;
      const ctx = tmpCanvas.getContext("2d");

      const fontSize = size * 1.5 / BOSS_NAME.length;

      ctx.font = `${fontSize}px Typewriter, serif`;
      ctx.fillStyle = "red";
      ctx.fillText(BOSS_NAME, 0, (size + fontSize) / 2);

      const imgData = ctx.getImageData(0, 0, size, size).data;
      /** @type {[x: number, y: number][]} */
      const avaiables = [];
      const offset = size / 2;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const r = imgData[(x + y * size) * 4];
          if (r >= 200 && fastRandom() > 0.95) avaiables.push([x - offset, y - offset]);
          else if (fastRandom() > 0.999) avaiables.push([x - offset, y - offset]);
        }
      }

      return avaiables
        .sort(() => Math.random() - 0.5);
    }
  },
  watch: {
    time() {
      this.updateCanvas();
    }
  },
  mounted() {
    this.ctx = this.$el.getContext("2d");
  },
  methods: {
    updateCanvas() {
      /** @type {CanvasRenderingContext2D} */
      const ctx = this.ctx;
      ctx.width = this.width;
      ctx.height = this.height;
      const centerX = this.width / 2;
      const centerY = this.height / 2;

      const t = this.time / 1000;
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.width, this.height);
      if (t < 5) {
        ctx.globalAlpha = t / 5;
        for (let i = 0; i < this.pixelPositions.length; i++) {
          const [x, y] = this.pixelPositions[i];
          const rad = (Math.sqrt(t) * 5 + i);
          const dist = (250 + (i * 13 % 250)) * (5 - t);
          const moveX = dist * Math.sin(rad);
          const moveY = dist * Math.cos(rad);
          const col = getColor(Math.sin(i + t * 6));
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x + centerX - 2 + moveX, y + centerY - 2 + moveY, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (t < 10) {
        ctx.globalAlpha = (10 - t) / 5;
        for (let i = 0; i < this.pixelPositions.length; i++) {
          const [x, y] = this.pixelPositions[i];
          const rad = (Math.sqrt(t) * 5 + i);
          const dist = (t - 5) ** 2 * 4;
          const moveX = dist * Math.sin(rad);
          const moveY = dist * Math.cos(rad);
          const col = getColor(Math.sin(i + t * 6));
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x + centerX - 2 + moveX, y + centerY - 2 + moveY, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
};
</script>

<template>
  <canvas
    class="canvas"
    :width="width"
    :height="height"
  />
</template>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
