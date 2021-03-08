<template>
  <div :style="{ display: isShow ? 'flex':'none' }" class="loading-wrap" id="rto-loading">
    <div class="loading-content">
      <img class="loading-icon" :src="require('@/splash/loading.gif')" />
      <p class="loading-desc"></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    close() {
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  top:0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  .loading-icon {
    width: 50px;
    // transform: rotate(0deg);
    // animation: 0.8s linear 0s infinite loading;
  }
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);;
  }
}
</style>