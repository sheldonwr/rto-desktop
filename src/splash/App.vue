<template>
  <a-spin :spinning="loading">
    <div id="app">
      <div class="drag-wrap drag"></div>
      <img
        class="logo drag"
        :src="require('@/main/assets/logo.png')"
        width="60"
      />
      <div class="window-controls no-drag">
        <div class="window-icon danger" @click="quit">
          <span class="rto_iconfont icon-close"></span>
        </div>
      </div>
      <div class="form-container">
        <p class="title">工业装置RTO在线优化平台软件</p>
        <div class="form-wrap">
          <a-form-model ref="config" :model="config" :rules="rules">
            <a-form-model-item label="host" prop="host">
              <a-input style="width: 100%" placeholder="平台地址" v-model="config.host" />
            </a-form-model-item>
            <a-form-model-item label="port" prop="port">
              <a-input-number
                style="width: 100%"
                placeholder="服务端口"
                v-model="config.port"
                :min="0"
                :max="65535"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <a-button
          class="connnect-btn"
          type="primary"
          @click="submitForm('config')"
        >
          连接
        </a-button>
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
        callback(new Error("请输入平台地址"));
      } else {
        callback();
      }
    };
    let validatePort = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入服务端口"));
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
      window.ipcRenderer.send("window-close");
    },
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
  user-select: none;
  background: url("~assets/img/bg.png") no-repeat 50%;
  background-size: cover;
  position: relative;
  .logo {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .drag-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
  }
}
.ant-col.ant-form-item-label {
  display: none;
}
.ant-input, .ant-input-number-input {
  height: 34px !important;
  font-size: 16px !important;
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  .title {
    font-size: 36px;
    color: rgb(0, 93, 151);
    font-weight: bold;
  }
}
.form-wrap {
  width: 50%;
  padding-top: 40px;
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
.connnect-btn {
  width: 200px; 
  background: rgb(0, 93, 151) !important;
  margin-top: 20px;
}
</style>
