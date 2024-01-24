<script>
import ItemComponent from "../ItemComponent";

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
      const rolled = window.GameDatabase.rogue.rollRewardTable(quest);
      return rolled.map(([itemData, seed]) => itemData.itemGen(seed));
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
      window.player.rogue.questCompleted[this.questId] = true;

      const item = this.genItems()[this.selectIdx];
      grantItem(item);
      this.emitClose();
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
    <div class="rogue-choose-list">
      <ItemComponent
        v-for="(item, i) in items"
        :key="i"
        :item="item"
        :class="{ selected: selectIdx === i }"
        @click.native="() => select(i)"
      />
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

.rogue-choose-list > * {
  margin: 0 1rem;
  cursor: pointer;
}

.rogue-choose-list > *.selected {
  box-shadow: 0 0 1rem #fff;
}
</style>
