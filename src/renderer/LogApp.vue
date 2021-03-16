<template>
  <div v-if="$store.state.view.logPanelVisible" class="rto_custom rto_log">
    <div class="log-head">
      <ul class="log-head-inner clearfix">
        <li class="pull-left source">节点</li>
        <li class="pull-left time">时间</li>
        <li class="pull-left message">内容</li>
        <li class="pull-left severity">分级</li>
        <li class="pull-left condition">状态</li>
      </ul>
      <div class="close-wrap" @click="close">
        <span class="rto_iconfont icon-close"></span>
      </div>
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
  </div>
</template>

<script>
export default {
  name: "log",
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
</style>

<style lang="scss" scoped>
.rto_log {
  position: relative;
  z-index: 9;
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
}
.log-head {
  position: relative;
  .close-wrap {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
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
.log-head-inner {
  line-height: 38px;
  font-size: 12px;
  color: #333;
  background: #f2f2f2;
  padding: 0 30px 0 12px;
  border-top: solid 1px #dcdcdc;
}
.log-content-wrap {
  height: 242px;
  background: #fff;
  padding: 0 30px 0 12px;
  font-size: 12px;
  color: #888;
  line-height: 28px;
  overflow: auto;
}
</style>
