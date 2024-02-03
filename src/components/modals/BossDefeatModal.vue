<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "BossDefeatModal",
  components: {
    ModalCloseButton,
    PrimaryButton
  },
  props: {
    bossId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      bossName: "",
      primaryColor: "#fff",
      nameStyle: "--color: #fff;"
    };
  },
  methods: {
    update() {
      const bossData = BossDatas[this.bossId];
      this.bossName = bossData.getName();
      this.primaryColor = bossData.getPrimaryColor();
      this.nameStyle = `--color: ${this.primaryColor}`;
    },
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
    <div>
      You defeated <span
        class="default-modal__name"
        :style="nameStyle"
      >{{ bossName }}</span>.<br>
      🎉 Congratulation 🎉
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click.native="emitClose"
    >
      Yay!
    </PrimaryButton>
  </div>
</template>

<style scoped>
.default-modal__name {
  --color: #fff;


  color: var(--color);
}
</style>
