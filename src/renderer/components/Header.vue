<template>
  <div class="header-wrap drag">
    <div class="logo-wrap">
      <img :src="require('assets/img/logo.png')">
    </div>
    <div class="title-wrap">
      <p class="title">{{ $store.getters['file/title'] }}</p>
    </div>
    <div class="window-controls no-drag">
      <div class="window-icon" @click="windowControl('minimize')">
        <span class="rto_iconfont icon-minimize"></span>
      </div>
       <div class="window-icon" @click="windowControl('maximize')">
        <span :class="['rto_iconfont', isWindowMaximized ? 'icon-maximize-restore' : 'icon-maximize']"></span>
      </div>
       <div class="window-icon danger" @click="windowControl('close')">
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
    }
  },
  created() {
    window.ipcRenderer.on('window-close', () => {
      this.$store.dispatch('window/closeWindow');
    })
  },
  methods: {
    windowControl(type) {
      if(type === 'minimize') {
        this.$store.dispatch('window/minimizeWindow');
      }else if(type === 'maximize') {
        this.$store.dispatch('window/maximizeWindow');
      }else if(type === 'close') {
        this.$store.dispatch('window/closeWindow')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrap {
  width: 100%;
  height: 37px;
  background: rgba(255,255,255,0.6);
  box-shadow: 0px 0px 1px 0px 
		rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-wrap {
    display: flex;
    align-items: center;
    padding-left: 16px;
    width: 150px;
    img {
      width: 88px;
      height: 23px;
    }
  }
  .window-controls {
    display: flex;
    width: 150px;
    justify-content: flex-end;
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
}
</style>
