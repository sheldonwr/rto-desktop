<template>
  <div id="app" class="drag">
    <img 
      :src="require('@/main/assets/logo.jpg')"
      width="50%">
    <p class="loading-text">初始化中<span>{{dot}}</span></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dot: '.'
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if(this.dot === '.') {
        this.dot = '..';
      }else if(this.dot === '..') {
        this.dot = '...';
      }else if(this.dot === '...') {
        this.dot = '.'
      }
    }, 1000);
  },
  beforeDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
</script>

<style>
.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
* {
  margin: 0;
}
#app {
  width: 100vw;
  height: 100vh;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
img {
    margin-top: 36px;
}
.drag-wrap {
  height: 40px;
}
.loading-text {
  margin-top: 16px;
  text-align: center;
}
</style>