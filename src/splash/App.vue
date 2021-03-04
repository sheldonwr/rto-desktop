<template>
  <div id="app">
    <img class="loading" :src="require('@/splash/loading.gif')">
    <p class="loading-desc">RTO 启动中...</p>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  mounted() {
    window.ipcRenderer.send('splash-start')
  }
}
</script>

<style lang="scss">
body {
  -webkit-app-region: drag;
  user-select: none;
  width: 100vw;
  height: 100vh;
  background: #eaedf1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .loading {
    margin-top: -50px;
    height: 240px;
  }
  .loading-desc {
    width: 100%;
    text-align: center;
    margin-top: -30px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
  }
}
</style>
