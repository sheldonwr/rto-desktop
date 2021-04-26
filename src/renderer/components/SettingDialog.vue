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
        <a-switch v-model="form.rightPanelCenter" @change="rightPanelCenterChanged" />
      </a-form-model-item>
      <a-form-model-item label="属性配置面板宽度" prop="rightPanelWidth">
        <a-input-number v-model="form.rightPanelWidth" :min="320" :max="640" @change="rightPanelWidthChanged" />
      </a-form-model-item>
      <a-form-model-item label="属性配置面板高度" prop="rightPanelHeight">
        <a-input-number v-model="form.rightPanelHeight" :min="320" :max="640" @change="rightPanelHeightChanged" />
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
        rightPanelCenter: true,
        rightPanelWidth: 640,
        rightPanelHeight: 640
      }
    };
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
    rightPanelCenterChanged() {
      window.appConfig.detachable.showAtCenter = this.form.rightPanelCenter;
      if(this.$store.state.view.paramVisible) {
        this.$store.dispatch('view/closeSettingPannel');
        this.$store.dispatch('view/showSettingPannel');
      }
    },
    rightPanelWidthChanged() {
      if(this.form.rightPanelWidth < 320 || this.form.rightPanelWidth > 640) {
        return
      }
      window.appConfig.detachable.detachedRightSize.width = this.form.rightPanelWidth
    },
    rightPanelHeightChanged() {
       if(this.form.rightPanelHeight < 320 || this.form.rightPanelHeight > 640) {
        return
      }
      window.appConfig.detachable.detachedRightSize.height = this.form.rightPanelHeight
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
