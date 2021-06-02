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
      <a-form-model-item label="主题" prop="theme">
        <a-select v-model="form.theme" style="width: 150px" @change="themeChanged">
          <a-select-option value="default">默认</a-select-option>
          <a-select-option value="light">浅色</a-select-option>
          <a-select-option value="dark">深色</a-select-option>
        </a-select>
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
      form: {
        theme: 'default'
      }
    };
  },
  created() {
    this.form.theme = this.$store.state.theme;
  },
  watch: {
    value(val) {
      this.mvisible = val;
    }
  },
  methods: {
    afterClose() {
      this.$emit("input", false);
    },
    themeChanged() {
      this.$store.commit("theme", this.form.theme);
    }
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
