<template>
  <div class="rto_log">
    <div class="resize-bar" @mousedown.stop="resizeMousedown"></div>
    <a-tabs type="card">
      <a-tab-pane key="1" tab="日志">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="log-head">
            <ul class="log-head-inner clearfix">
              <li class="pull-left source">节点</li>
              <li class="pull-left time">时间</li>
              <li class="pull-left message">内容</li>
              <li class="pull-left severity">分级</li>
              <li class="pull-left condition">状态</li>
            </ul>
          </div>
          <ul class="log-content-wrap">
            <li
              class="clearfix"
              v-for="log in $store.state.log.allLogs"
              :key="log.id"
            >
              <span class="pull-left single-line source">{{ log.fnode }}</span>
              <span class="pull-left single-line time">{{ log.ftime }}</span>
              <span class="pull-left single-line message">{{ log.title }}</span>
              <span class="pull-left single-line severity">{{
                log.level
              }}</span>
              <span class="pull-left single-line condition"></span>
            </li>
          </ul>
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="2" tab="项目日志">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="logview">
            <div class="logview-content">
              <div>{{ appLog }}</div>
            </div>
          </div>
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="3" tab="组件日志">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="logview">
            <div class="logview-content">
              <div>{{ compLog }}</div>
            </div>
          </div>
        </ResizeTabContent>
      </a-tab-pane>
    </a-tabs>
    <div class="close-wrap" @click="close">
      <span class="rto_iconfont icon-close"></span>
    </div>
  </div>
</template>

<script>
import ResizeTabContent from "components/ResizeTabContent";

export default {
  name: "log",
  components: {
    ResizeTabContent,
  },
  data() {
    return {
      allLogs: [],
      // 项目日志
      appLog: "",
      // 组件日志
      compLog: "",
      resizeHeight: 240,
      maxHeight: 240,
      minHeight: 100
    };
  },
  created() {
  },
  mounted() {
    this.maxHeight = window.innerHeight - 100;
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  watch: {
    "$store.state.view.logPanelVisible": {
      handler(visible) {
        if(visible) {
          this.getAppLog();
        }else if(visible && this.$store.state.edit.selectedNode) {
          this.getCompLog();
        }else if(!this.$store.state.edit.selectedNode) {
          this.clearCompLog();
          this.compLog = '';
        }else {
          this.clearAppLog();
          this.clearCompLog();
        }
      }
    },
    "$store.state.edit.selectedNode": {
      handler(selectedNode) {
        if(selectedNode && this.$store.state.view.logPanelVisible) {
          this.nodeId = selectedNode.id;
          this.getCompLog();
        }else {
          this.clearCompLog();
          this.compLog = '';
        }
      },
    },
    "$store.state.status.appStatus": {
      handler() {
        let isLogging = this.$store.getters["status/isLogging"];
        if(isLogging && this.$store.state.view.logPanelVisible) {
          this.getAppLog();
        }else if(isLogging && this.$store.state.edit.selectedNode && this.$store.state.view.logPanelVisible) {
          this.getCompLog();
        }else {
           this.clearAppLog();
           this.clearCompLog();
        }
      },
    },
  },
  methods: {
    close() {
      this.$store.commit("view/logPanelVisible", false);
    },
    getAppLog() {
      // 项目日志
      let appId = this.$store.state.file.currentApp.id;
      if(!appId) {
        return;
      }
      this.clearAppLog();
      this.appLog = '';
      let curlogPos = 0;
      this.$store.dispatch("log/getAppLog", {appId: appId, curlogPos}).then((res) => {
        if(res && res.text) {
          this.appLog = res.text
          curlogPos = res.nextLogPosition;
        }
      });
      if(this.$store.getters["status/isLogging"]) {
        this.appLogInterval = setInterval(() => {
          this.$store.dispatch("log/getAppLog", {appId: appId, curlogPos}).then((res) => {
            if(res && res.text) {
              this.appLog += res.text
              curlogPos = res.nextLogPosition;
            }
          });
        }, 1500);
      }
    },
    getCompLog() {
      // 组件日志
      let appId = this.$store.state.file.currentApp.id;
      if(!appId || !this.nodeId) {
        return;
      }
      this.clearCompLog();
      this.compLog = '';
      let curlogPos = 0;
      this.$store.dispatch("log/getComponentLog", {appId: appId, nodeId: this.nodeId, curlogPos}).then((res) => {
        if(res && res.text) {
          this.compLog = res.text
          curlogPos = res.nextLogPosition;
        }
      });
      if(this.$store.getters["status/isLogging"]) {
        this.compLogInterval = setInterval(() => {
          this.$store.dispatch("log/getComponentLog", {appId: appId, nodeId: this.nodeId, curlogPos}).then((res) => {
            if(res && res.text) {
              this.compLog += res.text
              curlogPos = res.nextLogPosition;
            }
          });
        }, 1500);
      }
    },
    clearAppLog() {
      if(this.appLogInterval) {
        clearInterval(this.appLogInterval);
        this.appLogInterval = null;
      }
    },
    clearCompLog() {
      if(this.compLogInterval) {
        clearInterval(this.compLogInterval);
        this.compLogInterval = null;
      }
    },
    resizeHandler() {
      this.maxHeight = window.innerHeight - 100;
    },
    resizeMousedown(e) {
      e.preventDefault();
      this.startDrag = true;
      this.dragPre = e.clientY;
      this.orgHeight = this.resizeHeight;
      document.addEventListener("mousemove", this.resizeMove);
      document.addEventListener("mouseup", this.resizeMouseUp);
    },
    resizeMove(e) {
      if (!this.startDrag) {
        return;
      }
      e.preventDefault();
      let diff = this.dragPre - e.clientY;
      this.resizeHeight = Math.min(
        this.maxHeight,
        Math.max(this.minHeight, this.orgHeight + diff)
      );
    },
    resizeMouseUp(e) {
      if (!this.startDrag) {
        return;
      }
      this.startDrag = false;
      document.removeEventListener("mousemove", this.resizeMove);
      document.removeEventListener("mouseup", this.resizeMouseUp);
    },
  },
};
</script>

<style lang="scss">
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rto_log {
  .ant-tabs-bar {
    margin-bottom: 0;
  }
}
.logview {
  border: 0;
}
</style>

<style lang="scss" scoped>
.rto_log {
  position: fixed;
  z-index: 99999;
  background: #fff;
  bottom: 0;
  width: 100vw;
  .resize-bar {
    position: absolute;
    left: 0;
    top: -5px;
    right: 0;
    height: 8px;
    background: transparent;
    cursor: ns-resize;
    &:hover {
      background-color: rgba(0,132,255,.16);
    }
  }
  .clearfix:after {
    content: " ";
    display: block;
    clear: both;
  }
  .pull-left {
    float: left !important;
  }
  .source {
    width: calc(50% - 220px);
  }
  .time {
    width: 200px;
  }
  .message {
    width: calc(50% - 140px);
  }
  .severity {
    width: 80px;
  }
  .condition {
    width: 80px;
  }
  ul {
    margin-bottom: 0;
  }
  .close-wrap {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      opacity: 0.5;
    }
    .rto_iconfont {
      font-size: 10px;
    }
  }
}
.tab-content {
  height: 240px;
}
.log-head-inner {
  box-sizing: border-box;
  line-height: 38px;
  font-size: 12px;
  color: #333;
  background: #f2f2f2;
  padding: 0 30px 0 12px;
}
.log-content-wrap {
  box-sizing: border-box;
  height: calc(100% - 38px);
  background: #fff;
  padding: 0 30px 0 12px;
  font-size: 12px;
  color: #888;
  line-height: 28px;
  overflow: auto;
}
.logview {
  padding: 12px;
  height: 100%;
  user-select: text;
  white-space: pre;
  color: #5b6573;
  background-color: #fff;
  overflow: auto;
  .logview-content {

  }
}
</style>
