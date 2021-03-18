<template>
<a-spin :spinning="loading">
  <div id="app">
    <div class="title-wrap">
      <p class="title">RTO</p>
    </div>
    <div class="form-wrap">
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback label="host" prop="host">
          <a-input addon-before="http://" v-model="ruleForm.host" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="port" prop="port">
          <a-input-number v-model="ruleForm.port" :min="0" :max="65535" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" @click="submitForm('ruleForm')">
            连接
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</a-spin>
</template>

<script>
export default {
  name: "App",
  data() {
    let validateHost = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入host'));
      } else {
        callback();
      }
    };
    let validatePort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入port'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        host: '',
        port: '',
      },
      rules: {
        host: [
          { required: true, message: '请输入host', trigger: 'blur' },
          { validator: validateHost, trigger: 'change' }
        ],
        port: [
          { required: true, message: '请输入port', trigger: 'blur' },
          { validator: validatePort, trigger: 'change' }
        ]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
      loading: false
    }
  },
  components: {},
  mounted() {
    // window.ipcRenderer.send('splash-start')
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}
.title-wrap {
  -webkit-app-region: drag;
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .title {
    font-size: 50px;
    letter-spacing: 16px;
  }
}
.form-wrap {
  width: 80%;
}
// body {
//   -webkit-app-region: drag;
//   user-select: none;
//   width: 100vw;
//   height: 100vh;
//   background: #eaedf1;
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   .loading {
//     margin-top: -50px;
//     height: 240px;
//   }
//   .loading-desc {
//     width: 100%;
//     text-align: center;
//     margin-top: -30px;
//     color: rgba(0,0,0,.45);
//     font-size: 14px;
//   }
// }
</style>
