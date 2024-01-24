<script>
import QuestList from "./QuestList";

export default {
  name: "QuestsTab",
  components: {
    QuestList
  },
  data() {
    return {
      specialUnlocked: window.player.rogue.unlocks.special
    };
  },
  methods: {
    update() {
      this.specialUnlocked = window.player.rogue.unlocks.special;
    }
  }
};
</script>

<template>
  <div class="quests-tab">
    <QuestList
      type="normal"
      name="Normal Quests"
    />
    <QuestList
      type="debuff"
      name="Debuff Conditions"
    />
    <QuestList
      v-if="specialUnlocked"
      type="special"
      name="Special Quests"
    />
  </div>
</template>

<style scoped>
.quests-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70vmin;
}
</style>
