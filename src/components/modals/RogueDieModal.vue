<script>
import ItemGrid from "@/components/ItemGrid";
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RogueDieModal",
  components: {
    ModalCloseButton,
    PrimaryButton,
    ItemGrid
  },
  props: {
    rewards: {
      type: Object,
      required: true
    }
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    dieCountStr() {
      return format(window.player.rogue.dieCount);
    },
    xpGainStr() {
      return format(this.rewards.xp, 3, 3);
    },
    unlockedItems() {
      const items = [];
      for (const itemId of this.rewards.itemUnlocks) {
        const itemData = window.GameDatabase.rogue.items.get(itemId);
        const item = genItem(itemData, 0, 1);
        items.push(item);
      }
      return items;
    },
    skillTierUpDatas() {
      /**
       * @typedef TierUpData
       * @prop {string} key
       * @prop {string} name
       * @prop {string} colorStyle
       * @prop {string} condition
       */
      /** @type {TierUpData[]} */
      const tierUpDatas = [];
      for (const skillKey of window.GameDatabase.rogue.skillKeys) {
        if (!this.rewards.skillTierUps[skillKey]) continue;
        /** @type {import("../../core/secret-formula/rogue/leveling").SkillData} */
        const data = window.GameDatabase.rogue.skillDatas[skillKey];
        /** @type {number} */
        const newTier = window.player.rogue.leveling.tiers[skillKey] + 1;
        /** @type {TierUpData} */
        tierUpDatas.push({
          key: skillKey,
          name: data.getName(newTier),
          colorStyle: `--color: ${data.getColor(newTier)};`,
          condition: data.tierReqs[newTier].getReqStr()
        });
      }
      return tierUpDatas;
    }
  },
  methods: {
    confirmModal() {
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
      v-html="`You died... #${dieCountStr}`"
    />
    <div
      v-if="rewards.xp.gt(0)"
      class="rogue-die__section"
    >
      <div class="rogue-die__section__title">
        Exp gain
      </div>
      <div class="rogue-die__xp">
        {{ xpGainStr }}
      </div>
    </div>
    <div
      v-if="rewards.itemUnlocks.length !== 0"
      class="rogue-die__section"
    >
      <div class="rogue-die__section__title">
        Items Unlock
      </div>
      <ItemGrid
        :items="unlockedItems"
        :cols="4"
        :font-size="'0.8em'"
      />
    </div>
    <div
      v-if="skillTierUpDatas.length !== 0"
      class="rogue-die__section"
    >
      <div class="rogue-die__section__title">
        Skill Tier Up
      </div>
      <div
        v-for="data in skillTierUpDatas"
        :key="data.key"
        class="rogue-die__skill-up"
        :style="data.colorStyle"
      >
        <div
          class="rogue-die__skill-up__title"
        >
          <span>{{ data.name }}</span> skill tier up!
        </div>
        <div
          class="rogue-die__skill-up__condition"
        >
          {{ data.condition }}
        </div>
      </div>
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click.native="confirmModal"
    >
      Okey
    </PrimaryButton>
  </div>
</template>

<style scoped>
.c-modal-message__text {
  font-size: 1.2em;
}

.rogue-die__section {
  width: 80%;
  margin: 1rem 0;
  padding: 0 0.5rem 0.5rem 0;

  background-color: #111;
  border: 0.2rem solid var(--color-rogue);
  border-radius: 0.4rem;
}

.rogue-die__section__title {
  padding: 0.2rem 0 0.2rem 2rem;
  margin-bottom: 0.4rem;

  text-align: left;
  color: #000;
  font-size: 1.1em;

  background: linear-gradient(
    90deg,
    var(--color-rogue),
    #0000 60%
  );
}

.rogue-die__xp {
  font-size: 1.2em;
}

.rogue-die__skill-up {
  --color: #f00;


  margin: 0.8rem auto;
  padding: 0.2rem 0.8rem;
  width: 90%;

  border: 0.2rem solid var(--color);
  border-radius: 0.4rem;
  background: linear-gradient(
    135deg,
    #0000 10%,
    var(--color)
  );
}

.rogue-die__skill-up__title {
  text-align: left;
}

.rogue-die__skill-up__title > span {
  color: var(--color);
  font-size: 1.6em;
  font-weight: bold;
}

.rogue-die__skill-up__condition {
  margin-top: -0.6rem;

  text-align: right;

  opacity: 0.4;
}
</style>
