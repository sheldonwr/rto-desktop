<template>
  <div v-if="$store.state.view.logPanelVisible" class="rto_custom rto_log">
    <a-tabs type="card">
      <a-tab-pane key="1" tab="日志">
        <ResizeTabContent :default-height="240">
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
              <span class="pull-left single-line severity">{{ log.level }}</span>
              <span class="pull-left single-line condition"></span>
            </li>
          </ul>
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="2" tab="项目日志">
        <ResizeTabContent :default-height="240">
          项目日志
        </ResizeTabContent>
      </a-tab-pane>
      <a-tab-pane key="3" tab="组件日志">
        <ResizeTabContent :default-height="240">
          组件日志
        </ResizeTabContent>
      </a-tab-pane>
    </a-tabs>
    <div class="close-wrap" @click="close">
      <span class="rto_iconfont icon-close"></span>
    </div>
  </div>
</template>

<script>
import ResizeTabContent from 'components/ResizeTabContent'

export default {
  name: "log",
  components: {
    ResizeTabContent
  },
  data() {
    return {
      allLogs: [],
    };
  },
  methods: {
    close() {
      this.$store.commit("view/logPanelVisible", false);
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
</style>

<style lang="scss" scoped>
.rto_log {
  position: relative;
  z-index: 99;
  background: #fff;
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
</style>
