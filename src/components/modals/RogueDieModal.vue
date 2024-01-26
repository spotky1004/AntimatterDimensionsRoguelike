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
  <div>
    <div class="rogue-die__title">
      You died...
    </div>
  </div>
</template>

<script scoped>
</script>
