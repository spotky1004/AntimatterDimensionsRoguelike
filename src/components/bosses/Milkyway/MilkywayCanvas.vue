<script>
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
      const bossName = BossDatas[BOSS_ENUM.MILKYWAY].getName();
      const size = this.size;

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = size;
      tmpCanvas.height = size;
      const ctx = tmpCanvas.getContext("2d");

      const fontSize = size * 1.5 / bossName.length;

      ctx.font = `${fontSize}px Typewriter, serif`;
      ctx.fillStyle = "red";
      ctx.fillText(bossName, 0, (size + fontSize) / 2);

      const imgData = ctx.getImageData(0, 0, size, size).data;
      /** @type {[x: number, y: number][]} */
      const avaiables = [];
      const offset = size / 2;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const r = imgData[(x + y * size) * 4];
          if (r >= 200 && fastRandom() > 0.92) avaiables.push([x - offset, y - offset, 0]);
          else if (
            fastRandom() > 0.999 &&
            Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) < size / 2
          ) avaiables.push([x - offset, y - offset, 1]);
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
    this.ctx.clearRect(0, 0, this.width, this.height);
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
      if (t < 5) {
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "#23032e";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = t / 5;
        for (let i = 0; i < this.pixelPositions.length; i++) {
          const [x, y, type] = this.pixelPositions[i];
          const rad = (Math.sqrt(t) * 5 + i);
          const dist = (250 + (i * 13 % 250)) * (5 - t);
          const moveX = dist * Math.sin(rad);
          const moveY = dist * Math.cos(rad);
          const col = type === 0 ? "#aaa" : getColor(Math.sin(rad));
          const size = (i % 2) + 2;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x + centerX - size + moveX, y + centerY - size + moveY, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (t < 6) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#23032e";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = 1;
        const gm = (t - 5) ** 4;
        for (let i = 0; i < this.pixelPositions.length; i++) {
          const [x, y, type] = this.pixelPositions[i];
          const col = type === 0 ? "#aaa" : getColor(Math.sin(i + t * 6));
          const size = (i % 2) + 2;
          const m = gm ** ((i % 12) / 3);
          const xm = x * (1 - m) + centerX;
          const ym = y * (1 - m) + centerY;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(xm - size, ym - size, size, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (t < 10) {
        ctx.globalAlpha = (10 - t) / 12;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = (10 - t) / 4;
        for (let i = 0; i < this.pixelPositions.length; i++) {
          const rad = 3 * t + i / 3;
          const dist = (t - 5.5) ** 8 * (1 + (i % 255) / 16);
          const moveX = dist * Math.sin(rad);
          const moveY = dist * Math.cos(rad);
          const col = getColor(Math.sin(i + t * 6));
          const size = (i % 2) + 2;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(centerX - size + moveX, centerY - size + moveY, size, 0, 2 * Math.PI);
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
