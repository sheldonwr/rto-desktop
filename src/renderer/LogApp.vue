<template>
  <div v-if="$store.state.view.logPanelVisible" class="rto_custom rto_log">
    <div class="log-head">
      <ul class="log-head-inner clearfix">
        <li class="pull-left source">来源（组件名称）</li>
        <li class="pull-left time">时间</li>
        <li class="pull-left message">详细描述</li>
        <li class="pull-left severity">错误信息</li>
        <li class="pull-left condition">错误信息</li>
      </ul>
      <div class="close-wrap" @click="close">
         <span class="rto_iconfont icon-close"></span>
      </div>
    </div>
    <ul class="log-content-wrap">
      <li class="pull-left source">来源（组件名称）</li>
      <li class="pull-left time">时间</li>
      <li class="pull-left message">详细描述</li>
      <li class="pull-left severity">错误信息</li>
      <li class="pull-left condition">错误信息</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "log",
  methods: {
    close() {
      this.$store.commit('view/logPanelVisible', false)
    }
  }
};
</script>

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
    width: calc( 50% - 180px );
  }
  .time {
    width: 120px;
  }
  .message {
    width: calc( 50% - 100px );
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
}
.log-content-wrap {
  height: 242px;
  background: #fff;
  padding: 0 30px 0 12px;
  font-size: 12px;
  color: #888;
  line-height: 28px;
}
</style>
