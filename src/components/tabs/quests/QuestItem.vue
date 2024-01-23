<script>
export default {
  name: "QuestItem",
  props: {
    quest: {
      type: Object,
      required: true
    },
    advanced: {
      type: Boolean,
      default: false,
      required: false
    },
    hasReward: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      progress: 0,
      progressStr: "0%",
      completed: false,
      received: false,
      locked: true,
    };
  },
  methods: {
    update() {
      this.progress = window.GameDatabase.rogue.quests.get(this.quest.id).getProgress();
      this.progressStr = `--progress: ${this.progress === 0 ? -5 : this.progress * 100}% `;
      this.received = window.player.rogue.questCompleted[this.quest.id];
      this.completed = this.progress >= 1;
      this.locked = !window.player.rogue.questUnlocked[this.quest.id];
    },
    openReward() {
      if (!this.completed || this.received) return;
      Modal.rogueItemChoose.show({
        questId: this.quest.id
      });
    }
  }
};
</script>

<template>
  <div>
    <div
      v-if="!locked"
      class="quest-item"
      :class="{
        advanced,
        completed,
        received,
        hasReward,
      }"
      :style="progressStr"
    >
      <span class="quest-item__info">
        <div class="quest-item__name">
          {{ quest.name() }}
        </div>
        <div
          class="quest-item__description"
          v-html="quest.description()"
        />
      </span>
      <span
        v-if="hasReward"
        class="quest-item__receive"
        @click="openReward"
      >
        <i class="fa-solid fa-sack-dollar" />
      </span>
    </div>
    <div
      v-else
      class="quest-item-locked"
      :class="{ advanced }"
    >
      <i class="fas fa-lock" />
    </div>
  </div>
</template>

<style scoped>
.quest-item-locked {
  position: relative;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.8rem;

  background-color: var(--color4);
  filter: brightness(0.7);

  transition: 0.2s font-size, 0.2s height;
}

.quest-item-locked.advanced {
  font-size: 4rem;
  height: 6rem;
}

.quest-item-locked > i {
  color: var(--color3);
}

.quest-item {
  --progress: 0%;


  position: relative;
  display: flex;
  height: 3rem;
  padding: 0 0 0 1rem;

  background: linear-gradient(
    90deg,
    var(--color2) calc(var(--progress) / 2),
    var(--color1) var(--progress),
    #0000 calc(var(--progress) + 5%)
  );
  background-size: 100% 100%;

  transition: 0.2s height, 0.2s background-size;
  overflow: hidden;
}
.quest-item-locked::after, .quest-item::after {
  content: "";
  width: 80%;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  border-top: var(--border);
  opacity: 0.5;
}

.quest-item.advanced {
  height: 6rem;
}

.quest-item.received {
  filter: brightness(0.5);
  /* order: 10; */
}

.quest-item.advanced:not(.received).hasReward {
  background-size: 80% 100%;
}

.quest-item__info {
  flex-grow: 4;
}

.quest-item__name {
  display: flex;
  align-items: center;
  position: absolute;
  left: 1rem;
  top: 0;
  height: 100%;

  font-size: 1.5em;
  font-weight: bold;
  text-align: left;
  white-space: nowrap;

  transition: 0.2s font-size, 0.2s opacity;
}
.quest-item.advanced .quest-item__name {
  font-size: 3em;
  opacity: 0.15;
  user-select: none;
}

.quest-item__description {
  position: absolute;
  top: 0;
  left: 1rem;
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: left;
  font-size: 1.2em;
  white-space: nowrap;

  opacity: 0;
  transition: 0.2s opacity;
}
.quest-item.advanced .quest-item__description {
  opacity: 1;
}

.quest-item__receive {
  position: relative;
  flex-grow: 0;
  height: 100%;

  background: linear-gradient(
    180deg,
    #fcbd58,
    #e37842
  );

  transition: 0.2s flex-grow, 0.2s filter;
  overflow: hidden;
}

.quest-item.advanced:not(.received) .quest-item__receive {
  flex-grow: 1;
}

.quest-item:not(.completed:not(.received)) .quest-item__receive {
  filter: grayscale(1);
}

.quest-item.completed:not(.received) .quest-item__receive {
  cursor: pointer;
}
.quest-item.completed:not(.received) .quest-item__receive:hover {
  filter: brightness(1.3);
}

.quest-item__receive > i {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 2rem;

  transform: translate(-50%, -50%);
}
</style>
