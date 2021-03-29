<template>
  <a-modal
    v-model="mvisible"
    title="新建项目"
    ok-text="确认"
    cancel-text="取消"
    :maskClosable="false"
    @ok="okHandler"
    @cancel="cancelHandler"
  >
    <div>
      <a-form-model
        ref="appCreateForm"
        :model="appCreateForm"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback label="项目名" prop="name">
          <a-input v-model="appCreateForm.name" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="cancelHandler">
        取消
      </a-button>
      <a-button key="ok" type="primary" :loading="loading" @click="okHandler">
        确定
      </a-button>
    </template>
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
      appCreateForm: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入项目名", trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      loading: false,
    };
  },
  methods: {
    okHandler() {
      this.$refs['appCreateForm'].validate(valid => {
        if (valid) {
          this.mvisible = false;
          this.createApp();
        } else {
          return false;
        }
      });
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    },
    createApp() {
      this.loading = true;
      this.$store.dispatch('file/create', this.appCreateForm.name).then( () => {
        this.loading = false
        this.$emit("input", false);
      }).catch( err => {
        console.error(err);
        this.loading = false;
        this.$message.error("创建失败");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
