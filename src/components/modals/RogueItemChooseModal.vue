<script>
import ItemComponent from "@/components/ItemComponent";
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RogueItemChooseModal",
  components: {
    ModalCloseButton,
    PrimaryButton,
    ItemComponent
  },
  props: {
    questId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectIdx: -1,
      items: []
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  methods: {
    update() {
      this.items = this.genItems();
    },
    genItems() {
      const quest = window.GameDatabase.rogue.quests.get(this.questId);
      const rolledItems = window.GameDatabase.rogue.rollRewardTable(quest).map(r => r[1]);
      return rolledItems;
    },
    select(idx) {
      this.selectIdx = idx;
    },
    confirmModal() {
      const quest = window.GameDatabase.rogue.quests.get(this.questId);
      const canReceive =
        quest.getProgress() >= 1 &&
        window.player.rogue.questUnlocked[this.questId] &&
        !window.player.rogue.questCompleted[this.questId];
      if (!canReceive) return;

      const item = this.genItems()[this.selectIdx];
      const result = grantItem(item);
      if (result) {
        window.player.rogue.questCompleted[this.questId] = true;
        this.emitClose();
      } else {
        GameUI.notify.error("Your inventory is full!");
      }
    }
  }
};
</script>

<template>
  <div
    class="c-modal-message l-modal-content--centered"
  >
    <ModalCloseButton
      class="c-modal__close-btn"
      @click="emitClose"
    />
    <div
      class="c-modal-message__text"
      v-html="'Choose an Item'"
    />
    <div
      v-if="items.length > 0"
      class="rogue-choose-list"
    >
      <ItemComponent
        v-for="(item, i) in items"
        :key="i"
        :item="item"
        :class="{ selected: selectIdx === i }"
        @click.native="() => select(i)"
      />
    </div>
    <div
      v-else
      class="rogue-choose-nothing"
    >
      Loot table is empty.<br>
      Complete some new Achievements and die to unlock items.
    </div>
    <PrimaryButton
      v-if="selectIdx !== -1"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click.native="confirmModal"
    >
      Done
    </PrimaryButton>
  </div>
</template>

<style scoped>
.c-modal-message__text {
  font-size: 1.2em;
}

.rogue-choose-list {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

.rogue-choose-nothing {
  opacity: 0.5;
}

.rogue-choose-list > * {
  margin: 0 1rem;
  cursor: pointer;
}

.rogue-choose-list > *.selected {
  box-shadow: 0 0 1rem #fff;
}
</style>
