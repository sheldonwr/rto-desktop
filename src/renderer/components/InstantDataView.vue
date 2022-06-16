<template>
  <div class="instant-wrap">
    <el-table
        :data="logs"
        border
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="headerCellStyle"
    >
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="180"></el-table-column>
      <el-table-column prop="value" label="值"></el-table-column>
      <el-table-column prop="desc" label="描述" width="180"></el-table-column>
      <el-table-column prop="port" label="端口" :filters="filters.port" :filter-method="portFilterHandler"
                       width="180"></el-table-column>
      <el-table-column prop="connection" label="连接"></el-table-column>
      <el-table-column prop="timestamp" label="时间" width="180"></el-table-column>
      <el-table-column prop="unit" label="单位" width="180"></el-table-column>
      <el-table-column label="属性">
        <template slot-scope="scope">
          <json-viewer :value="scope.row.properties" :expanded="false" copyable boxed sort></json-viewer>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue';
import JsonViewer from 'vue-json-viewer';
import 'vue-json-viewer/style.css';

Vue.component('json-viewer', JsonViewer);

export default {
  name: 'InstantDataView',
  data() {
    return {
      filters: {
        port: []
      },
      cellStyle: {height: '28px', padding: 0, backgroundColor: '#f5faff'},
      headerCellStyle: {
        backgroundColor: '#ebf4fd',
        height: '28px',
        padding: 0,
        fontSize: '12px',
        color: '#000'
      }
    }
  },
  computed: {
    logs() {
      let instantData = this.$store.state.log.allInstantDatas
      let res = []
      if (this.$store.state.edit.selectedNode && this.$store.state.edit.selectedNode.id) {
        res = instantData[this.$store.state.edit.selectedNode.id] || []
      } else {
        Object.keys(instantData).forEach(nodeId => {
          res = res.concat(instantData[nodeId])
        })
      }
      res.sort((a, b) => (b.htime - a.htime));

      const portFilter = new Set();
      res.forEach(row => portFilter.add(row.port));

      this.filters.port = Array.from(portFilter).map(key => ({text: key, value: key}));
      return res
    }
  },
  methods: {
    portFilterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
}
</script>

<style lang="scss" scoped>
.instant-wrap {
  height: 100%;
  overflow-y: auto;

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
}
</style>

<style lang="scss">
.jv-container {
  &.jv-light {
    background-color: transparent !important;

    .jv-code {
      padding: 0;

      &.open {
        padding-bottom: 0 !important;
      }
    }
  }
}
</style>