<template>
  <a-modal
    v-model="mvisible"
    title="RTO用户帮助"
    :footer="null"
    :afterClose="afterClose"
  >
    <div class="help-wrapper">
      <div class="help-description">
        <p>帮助文档正在准备中，即将上线发布</p>
      </div>
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
.help-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .help-description {
    text-align: center;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
