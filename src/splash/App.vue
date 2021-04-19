<template>
  <a-spin :spinning="loading">
    <div id="app">
      <div class="title-wrap drag">
        <p class="title">RTO</p>
        <div class="window-controls no-drag">
          <div class="window-icon danger" @click="quit">
            <span class="rto_iconfont icon-close"></span>
          </div>
        </div>
      </div>
      <div class="form-wrap">
        <a-form-model
          ref="config"
          :model="config"
          :rules="rules"
          v-bind="layout"
        >
          <a-form-model-item has-feedback label="host" prop="host">
            <a-input v-model="config.host" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="port" prop="port">
            <a-input-number v-model="config.port" :min="0" :max="65535" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button type="primary" @click="submitForm('config')">
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
      if (value === "") {
        callback(new Error("请输入host"));
      } else {
        callback();
      }
    };
    let validatePort = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入port"));
      } else {
        callback();
      }
    };
    return {
      config: {
        host: "",
        port: "",
      },
      rules: {
        host: [
          { required: true, message: "请输入host", trigger: "blur" },
          { validator: validateHost, trigger: "change" },
        ],
        port: [
          { required: true, message: "请输入port", trigger: "blur" },
          { validator: validatePort, trigger: "change" },
        ],
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
      loading: true,
    };
  },
  created() {
    window.ipcRenderer.invoke("config-get").then((config) => {
      this.config = config;
      this.loading = false;
    });
  },
  components: {},
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          window.ipcRenderer
            .invoke("config-app", this.config)
            .then((res) => {
              window.ipcRenderer
                .invoke("config-set", this.config)
                .finally(() => {
                  window.ipcRenderer.send("splash-over");
                });
            })
            .catch((err) => {
              this.$message.error("连接失败");
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    quit() {
      window.ipcRenderer.send('window-close');
    }
  },
};
</script>

<style lang="scss">
.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}
.title-wrap {
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
.window-controls {
    position: absolute;
    top: 0;
    right: 0;
    .window-icon {
      cursor: pointer;
      padding: 8px 16px;
      .rto_iconfont {
        font-size: 13px;
        color: #333;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
      &.danger:hover {
        background: red;
      }
    }
  }
</style>
