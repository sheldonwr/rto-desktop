<template>
  <div :style="{ display: isShow ? 'flex':'none' }" :class="['loading-wrap', { 'transparent': !opacity }]" id="rto-loading">
    <div class="loading-content">
      <img class="loading-icon" :src="require('assets/img/loading.png')" />
      <p class="loading-desc">{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      opacity: true,
      msg: ''
    }
  },
  methods: {
    close() {
      this.isShow = false;
    },
    show() {
      this.isShow = true;
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
  user-select: none;
  &.transparent {
    background: rgba(255,255,255,0.5);
  }
  .loading-content {
    width: 200px;
    text-align: center;
  }
  .loading-icon {
    width: 30px;
    transform: rotate(0deg);
    animation: 0.8s linear 0s infinite loading;
  }
  .loading-desc {
    margin-top: 10px;
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