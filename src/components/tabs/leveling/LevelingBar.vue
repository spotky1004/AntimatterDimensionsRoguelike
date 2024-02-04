<script>
export default {
  name: "LevelingBar",
  data() {
    return {
      levelStr: "0",
      curXpStr: "0.000",
      xpReqStr: "1.000",
      style: "--progress: 50%",
    };
  },
  methods: {
    update() {
      this.levelStr = window.player.rogue.level.toString();
      const curXp = window.player.rogue.xp;
      const xpReq = getXpRequirement();
      this.curXpStr = format(curXp, 3, 3);
      this.xpReqStr = format(xpReq, 3, 3);
      this.style = `--progress: ${curXp.div(xpReq).toNumber() * 100}%`;
    }
  }
};
</script>

<template>
  <div
    class="leveling-bar"
    :style="style"
  >
    <span class="leveling-bar__level">
      {{ levelStr }}
    </span>
    <span class="leveling-bar__xp">
      {{ curXpStr }}xp / {{ xpReqStr }}xp
    </span>
  </div>
</template>

<style scoped>
.leveling-bar {
  --progress: 50%;


  position: relative;
  width: 80%;
  padding: 0.5rem;
  margin: 2rem auto;
  height: 3rem;

  background: linear-gradient(
    90deg,
    var(--color-rogue) var(--progress),
    #111 var(--progress)
  );
  border-radius: 0.4rem;
  border: 0.4rem solid var(--color-rogue-dark);
  box-shadow: 0 0 1rem var(--color-rogue-dark) inset, 0 0 1rem var(--color-rogue-dark) inset;
}

.leveling-bar__level {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  font-size: 5rem;
  font-weight: bold;
  color: var(--color-rogue);
  text-shadow:
    -0.4rem 0 var(--color-rogue-dark),
    0 0.4rem var(--color-rogue-dark),
    0.4rem 0 var(--color-rogue-dark),
    0 -0.4rem var(--color-rogue-dark),
    0.3rem 0.3rem var(--color-rogue-dark),
    -0.3rem 0.3rem var(--color-rogue-dark),
    0.3rem -0.3rem var(--color-rogue-dark),
    -0.3rem -0.3rem var(--color-rogue-dark),
    0 0 1rem var(--color-rogue-dark);

  user-select: none;
}

.leveling-bar__xp {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);

  mix-blend-mode: difference;
}
</style>
