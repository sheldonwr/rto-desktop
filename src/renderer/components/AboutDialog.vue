<template>
  <a-modal
    v-model="mvisible"
    title="关于"
    :footer="null"
    :afterClose="afterClose"
  >
    <div class="about-wrapper">
      <div class="about-description">
        <p>版本：RTO 0.1.8-beta</p>
      </div>
      <p>Copyright © 2011-2021 华东理工大学 版权所有</p>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.mvisible = val;
    },
  },
  data() {
    return {
      mvisible: this.value,
    };
  },
  methods: {
    afterClose() {
      this.$emit('input', false)
    }
  }
};
</script>

<style lang="scss" scoped>
.about-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .about-description {
    text-align: center;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
