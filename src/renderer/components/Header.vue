<template>
  <div class="header-wrap drag">
    <div class="logo-wrap">
      <img :src="require('assets/img/logo.png')">
    </div>
    <div class="title-wrap">
      <p>项目-乙烯装置全流程优化</p>
    </div>
    <div class="window-controls no-drag">
      <div class="window-icon" @click="windowControl('minimize')">
        <span class="iconfont icon-minimize"></span>
      </div>
       <div class="window-icon" @click="windowControl('maximize')">
        <span :class="['iconfont', isWindowMaximized ? 'icon-maximize-restore' : 'icon-maximize']"></span>
      </div>
       <div class="window-icon danger" @click="windowControl('close')">
        <span class="iconfont icon-close"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isWindowMaximized() {
      return this.$store.state.window.maximized;
    }
  },
  methods: {
    windowControl(type) {
      if(type === 'minimize') {
        this.$store.dispatch('window/minimizeWindow');
      }else if(type === 'maximize') {
        this.$store.dispatch('window/maximizeWindow');
      }else if(type === 'close') {
        this.$store.dispatch('window/closeWindow');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrap {
  width: 100%;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-wrap {
    display: flex;
    align-items: center;
    padding-left: 16px;
    img {
      width: 88px;
      height: 23px;
    }
  }
  .window-controls {
    display: flex;
    .window-icon {
      cursor: pointer;
      padding: 8px 14px;
      .iconfont {
        font-size: 14px;
      }
      &:hover {
        background: #aaa;
      }
      &.danger:hover {
        background: red;
      }
    }
  }
}
</style>
