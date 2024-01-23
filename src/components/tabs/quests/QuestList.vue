<script>
import { deepmergeAll } from "@/utility/deepmerge";
import QuestItem from "./QuestItem";

export default {
  name: "QuestList",
  components: {
    QuestItem
  },
  props: {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: deepmergeAll([{}, window.GameDatabase.rogue[`${this.type}Quests`]]),
      hover: false
    };
  }
};
</script>

<template>
  <div
    class="quest-list"
    :class="type"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @blur="hover = false"
  >
    <div class="quest-list__name">
      {{ name }}
    </div>
    <div class="quest-list__items-wrapper">
      <QuestItem
        v-for="item in items"
        :key="item.id"
        :quest="item"
        :advanced="hover"
        :has-reward="type === 'normal'"
      />
    </div>
  </div>
</template>

<style scoped>
.quest-list {
  --color1: #888;
  --color2: #555;
  --color3: #222;
  --color4: #111;
  --border: 0.2rem solid var(--color1);


  width: 30rem;
  height: 40rem;
  margin: 1rem;

  background: linear-gradient(
    180deg,
    var(--color3),
    var(--color4)
  );
  border: var(--border);
  border-radius: 0.4rem;

  transition: 0.2s width, 0.2s height, 2s cubic-bezier(.14,.88,.23,.99) margin;
}
.quest-list:hover {
  width: 45rem;
  height: 60rem;
  margin: 6rem;
}

.quest-list.debuff {
  --color1: var(--color-item-debuff);
  --color2: var(--color-item-debuff-dark1);
  --color3: var(--color-item-debuff-dark2);
  --color4: var(--color-item-debuff-dark3);
}

.quest-list.special {
  --color1: var(--color-item-special);
  --color2: var(--color-item-special-dark1);
  --color3: var(--color-item-special-dark2);
  --color4: var(--color-item-special-dark3);
}

.quest-list__name {
  font-size: 2em;
  font-weight: bold;
  color: var(--color1);
}

.quest-list__items-wrapper {
  width: 28rem;
  height: 35.2rem;
  margin: 0.3rem auto;

  background-color: var(--color4);
  border: var(--border);
  border-radius: 0.4rem;

  overflow-x: hidden;
  overflow-y: auto;

  transition: 0.2s width, 0.2s height;
}
.quest-list:hover > .quest-list__items-wrapper {
  width: 43rem;
  height: 55.2rem;
}
</style>
