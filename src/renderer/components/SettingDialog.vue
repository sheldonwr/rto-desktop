<template>
  <a-modal
    v-model="mvisible"
    title="设置"
    :footer="null"
    :afterClose="afterClose"
  >
  <div class="wrapper">
    <a-form-model
      ref="ruleForm"
      class="form-wrapper"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="属性配置面板居中显示" prop="rightPanelCenter">
        <a-switch v-model="form.rightPanelCenter" />
      </a-form-model-item>
    </a-form-model>
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
  data() {
    return {
      mvisible: this.value,
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  },
  computed: {
    form() {
      return this.$store.state.setting.form;
    }
  },
  watch: {
    value(val) {
      this.mvisible = val;
    },
  },
  methods: {
    afterClose() {
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .form-wrapper {
    width: 100%;
  }
}
</style>
