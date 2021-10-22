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
      <a-button key="ok" type="primary" @click="okHandler" :loading="checkLoading">
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
        url: 'http://localhost:3391',
      },
      rules: {
        url: [{ required: true, message: "请输入前端显示链接", trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      checkLoading: false
    };
  },
  mounted() {
    
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    okHandler() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.checkLoading = true;
          this.checkUrl().then(() => {
            this.checkLoading = false;
            this.mvisible = false;
            this.$emit("input", false);
            window.open(this.form.url)
          }).catch(err => {
            if(this.mvisible) {
              this.$store.dispatch('showMessage', `无法访问${this.form.url}`)
            }
            this.checkLoading = false;
          })
        } else {
          return false;
        }
      });
    },
    checkUrl(url) {
      return new Promise( (resolve, reject) => {
        clearTimeout(this.timer);
        if(!this.form.url.startsWith('http://') && !this.form.url.startsWith('https://')) {
          reject();
        }else {
          this.timer = setTimeout(() => {
            this.checkLoading = false;
            reject()
          }, 10*1000);
          fetch(this.form.url).then(() => {
            resolve();
            clearTimeout(this.timer);
          }).catch(err => {
            reject(err)
            clearTimeout(this.timer);
          })
        }
      })
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    }
  },
};
</script>

<style lang="scss" scoped></style>
