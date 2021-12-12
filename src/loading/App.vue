<template>
  <div id="app" class="drag">
    <img 
      :src="require('@/main/assets/logo.jpg')"
      width="50%">
    <p class="loading-text">初始化中<span>{{dot}}</span></p>
    <div class="error-modal" v-show="showError">
      <div class="error-container no-drag">
        <div>
          <p class="error-msg" :title="errorMsg">{{ errorMsg }}</p>
        </div>
        <div>
          <button class="error-btn" @click="quit">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dot: '.',
      showError: false,
      errorMsg: '',
    }
  },
  created() {
    window.ipcRenderer.on('error-msg', (evt, msg) => {
      this.showError = true;
      this.errorMsg = msg;
    });
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
    window.ipcRenderer.removeAllListeners('error-msg');
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    quit() {
      window.ipcRenderer.send('app-quit', this.errorMsg);
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
.error-modal {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  background: rgba(0, 0, 0, 0.1);

}
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  width: 70%;
  height: 40%;
  background: #eee;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.error-msg {
  color: red;
  font-size: 16px;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.error-btn {
  width: 80px;
  padding: 5px 0;
  cursor: pointer;
}
</style>