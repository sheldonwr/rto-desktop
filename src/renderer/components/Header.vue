<template>
  <div class="header-wrap drag">
    <div class="logo-wrap">
      <img :src="require('assets/img/logo.png')">
      <p class="logo-title">工业装置RTO在线优化平台</p>
    </div>
    <div class="title-wrap">
      <p class="title">{{ $store.getters["file/title"] }}</p>
    </div>
    <div class="window-controls">
      <div class="window-icon no-drag" @click="windowControl('minimize')">
        <span class="rto_iconfont icon-minimize"></span>
      </div>
      <div class="window-icon no-drag" @click="windowControl('maximize')">
        <span
          :class="[
            'rto_iconfont',
            isWindowMaximized ? 'icon-maximize-restore' : 'icon-maximize',
          ]"
        ></span>
      </div>
      <div class="window-icon no-drag danger" @click="windowControl('close')">
        <span class="rto_iconfont icon-close"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isWindowMaximized() {
      return this.$store.state.window.maximized;
    },
  },
  created() {
    // window.ipcRenderer.on("window-close", () => {
    //   this.$store.dispatch("window/closeWindow");
    // });
  },
  methods: {
    windowControl(type) {
      if (type === "minimize") {
        this.$store.dispatch("window/minimizeWindow");
      } else if (type === "maximize") {
        this.$store.dispatch("window/maximizeWindow");
      } else if (type === "close") {
        this.$confirm({
          title: `确定关闭软件吗？`,
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            return this.$store.dispatch('window/closeWindow')
          },
          onCancel() {},
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  width: 100%;
  height: 37px;
  background: var(--e-app-title-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-wrap {
    display: flex;
    align-items: center;
    padding-left: 10px;
    width: 350px;
    img {
      height: 20px;
    }
    .logo-title {
      margin: 0 0 0 5px;
      font-size: 14px;
      color: var(--e-app-logo-color);
    }
  }
  .title {
    margin: 0;
    color: var(--e-app-title-color);
  }
  .window-controls {
    display: flex;
    width: 350px;
    justify-content: flex-end;
    .window-icon {
      cursor: pointer;
      padding: 8px 16px;
      .rto_iconfont {
        font-size: 13px;
        color: var(--e-app-title-color);
      }
      &:hover {
        background: var(--e-app-title-hover-color);
      }
      &.danger:hover {
        background: red;
      }
    }
  }
}
</style>
