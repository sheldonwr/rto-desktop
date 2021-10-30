<template>
  <div class="rto_log">
    <div class="resize-bar" @mousedown.stop="resizeMousedown"></div>
    <a-tabs type="card" class="tab-wrapper">
      <a-tab-pane key="1" tab="告警">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="log-head">
            <ul class="log-head-inner clearfix">
              <li class="pull-left source">节点</li>
              <li class="pull-left time">时间</li>
              <li class="pull-left message">内容</li>
              <li class="pull-left severity">
                <span>级别:</span>
                <select class="log-threshold" v-model="logThreshold">
                  <option value ="ERROR">ERROR</option>
                  <option value ="WARNING">WARNING</option>
                  <option value="INFO">INFO</option>
                  <option value="ALL">全部</option>
                </select>
              </li>
            </ul>
          </div>
          <ul class="log-content-wrap">
            <li
              class="clearfix"
              v-for="log in displayLogs"
              :key="log.id"
            >
              <span class="pull-left single-line source" :title="log.fnode">{{ log.fnode }}</span>
              <span class="pull-left single-line time" :title="log.ftime">{{ log.ftime }}</span>
              <span class="pull-left single-line message" :title="log.title">{{ log.title }}</span>
              <span class="pull-left single-line severity" :title="log.level">{{ log.level }}</span>
            </li>
          </ul>
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="2" tab="项目日志">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="rto-logview">
            <div class="logview-content">
              <div>{{ appLog }}</div>
            </div>
          </div>
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="3" tab="组件日志">
        <ResizeTabContent :resize-height="resizeHeight">
          <div class="rto-logview">
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

const LOG_LEVELS = {
  ERROR: 3,
  WARNING: 2,
  INFO: 1,
  DEBUG: 0,
  ALL: -1
}

export default {
  name: "log",
  components: {
    ResizeTabContent,
  },
  data() {
    return {
      // 项目日志
      appLog: "",
      // 组件日志
      compLog: "",
      // 日志过滤级别
      logThreshold: "ALL",
      resizeHeight: 240,
      maxHeight: 240,
      minHeight: 100
    };
  },
  computed: {
    displayLogs() {
      if(LOG_LEVELS[this.logThreshold] == -1) {
        return this.$store.state.log.allLogs
      }else {
        return this.$store.state.log.allLogs.filter(log => {
          return LOG_LEVELS[log.level.toUpperCase()] == LOG_LEVELS[this.logThreshold]
        })
      }
    }
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
    "$store.state.status.appRuning": {
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
        if(this.$store.getters["status/isRunning"] && this.$store.state.file.currentApp.id) {
          // this.checkVscode();
        }
      },
    },
    "$store.state.file.currentApp": {
      handler(currentApp) {
        if(currentApp.id && this.$store.getters["status/isRunning"]) {
          // this.checkVscode();
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
    checkVscode() {
      const graph = window.SuanpanAPI.nodeService.getGraph();
      let nodes = [];
      if(graph) {
        nodes = graph.nodes;
      }
      for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let def = node.metadata.def;
        if(def && def.dockerRepo && (def.dockerRepo.indexOf('vscode') > -1)
          && def.params.__mode  && (def.params.__mode.value == 'online-edit')) {
          this.$store.commit('log/addLog', node);
        }
      }
    }
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
  .ant-tabs-tab {
    background: var(--e-log-tab-bg) !important;
    margin: 0 !important;
    &-active {
      background: var(--e-log-tab-active-bg) !important;
      color: var(--e-log-tab-color) !important;
    }
  }
}
.rto-logview {
  border: 0;
}
.tab-wrapper {
  .ant-tabs-top-bar {
    background: var(--e-log-title-bg);
  }
}
</style>

<style lang="scss" scoped>
.rto_log {
  position: fixed;
  z-index: 99999;
  background: #fff;
  bottom: 0;
  width: 100vw;
  border-top: 1px solid rgba(91,91,91,0.3);
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
    width: calc(100% / 24 * 4);
    min-height: 1px;
  }
  .time {
    width: calc(100% / 24 * 3);
    min-height: 1px;
  }
  .message {
    width: calc(100% / 24 * 14);
    min-height: 1px;
    padding-right: 10px;
  }
  .severity {
    width: calc(100% / 24 * 3);
    min-height: 1px;
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
      font-size: 12px;
      color: var(--e-log-tab-color);
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
  color: #1f1f1f;
  background: #EBF4FD;
  padding: 0 30px 0 12px;
  font-weight: bold;
}
.log-content-wrap {
  box-sizing: border-box;
  height: calc(100% - 38px);
  background: #F5FAFF;
  padding: 0 30px 0 12px;
  font-size: 12px;
  color: #1f1f1f;
  line-height: 28px;
  overflow: auto;
}
.rto-logview {
  padding: 12px;
  height: 100%;
  user-select: text;
  white-space: pre;
  color: #1f1f1f;
  background: #F5FAFF;
  overflow: auto;
}
.log-threshold {
  border: 0;
  margin-left: 5px;
}
</style>
