<template>
  <a-modal
    v-model="mvisible"
    title="前端显示"
    ok-text="确认"
    cancel-text="取消"
    :maskClosable="false"
    @ok="okHandler"
    @cancel="cancelHandler"
  >
    <div>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback label="地址" prop="url">
          <a-input v-model="form.url" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="cancelHandler">
        取消
      </a-button>
      <a-button key="ok" type="primary" @click="okHandler">
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
    }
  },
  watch: {
    value(val) {
      this.mvisible = val;
    }
  },
  data() {
    return {
      mvisible: this.value,
      form: {
        url: '',
      },
      rules: {
        url: [{ required: true, message: "请输入前端显示链接", trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    };
  },
  mounted() {
    
  },
  methods: {
    okHandler() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.mvisible = false;
          this.$emit("input", false);
          window.open(this.form.url)
        } else {
          return false;
        }
      });
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    }
  },
};
</script>

<style lang="scss" scoped></style>
