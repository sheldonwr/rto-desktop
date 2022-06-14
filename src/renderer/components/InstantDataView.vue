<template>
  <div class="instant-wrap">
    <div class="instant-head clearfix">
      <div class="pull-left head-item instant-node">节点名称</div>
      <div class="pull-left head-item instant-time">时间</div>
      <div class="pull-left head-item instant-portId">端口ID</div>
      <div class="pull-left head-item instant-portName">端口名称</div>
      <div class="pull-left head-item instant-content">内容</div>
    </div>
    <div class="instant-data clearfix">
      <div v-for="log in logs" :key="log.key">
        <div class="pull-left single-line instant-node">{{ log.node_label }}</div>
        <div class="pull-left single-line instant-time">{{ log.ftime }}</div>
        <div class="pull-left single-line instant-portId">{{ log.port }}</div>
        <div class="pull-left single-line instant-portName">{{ log.port_name }}</div>
        <div class="pull-left single-line instant-content">{{ log.data }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstantDataView',
  data() {
    return {}
  },
  computed: {
    logs() {
      let instantData = this.$store.state.log.allInstantDatas
      let res = []
      if(this.$store.state.edit.selectedNode && this.$store.state.edit.selectedNode.id) {
        res = instantData[this.$store.state.edit.selectedNode.id] || []
      }else {
        Object.keys(instantData).forEach(nodeId => {
          res = res.concat(instantData[nodeId])
        })
      }
      res.sort((a, b) => (b.htime - a.htime))
      return res
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.instant-wrap {
  height: 100%;
}
.instant-head {
  box-sizing: border-box;
  line-height: 38px;
  font-size: 12px;
  color: #1f1f1f;
  background: #EBF4FD;
  padding: 0 30px 0 12px;
  font-weight: bold;
  .head-item {
    min-height: 1px;
  }
}
.instant-node {
  width: calc(100% / 24 * 4);
}
.instant-time {
  width: calc(100% / 24 * 3);
}
.instant-portId {
  width: calc(100% / 24 * 2);
}
.instant-portName {
  width: calc(100% / 24 * 3);
}
.instant-content {
  width: calc(100% / 24 * 12);
}
.instant-data {
  box-sizing: border-box;
  height: calc(100% - 38px);
  background: #F5FAFF;
  padding: 0 30px 0 12px;
  font-size: 12px;
  color: #1f1f1f;
  line-height: 28px;
  overflow: auto;
}
</style>