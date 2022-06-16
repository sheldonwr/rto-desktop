<template>
  <div class="instant-wrap">
    <el-table
        :data="logs"
        border
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"
          width="180">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="type"-->
<!--          label="类型"-->
<!--          :filters="filters.type"-->
<!--          :filter-method="typeFilterHandler"-->
<!--          width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="value"-->
<!--          label="值">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="desc"-->
<!--          label="描述"-->
<!--          width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="port"-->
<!--          label="端口"-->
<!--          width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="connection"-->
<!--          label="连接">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="timestamp"-->
<!--          label="时间"-->
<!--          width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="unit"-->
<!--          label="单位"-->
<!--          width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column label="属性">-->
<!--        <template slot-scope="scope">-->
<!--          <json-viewer :value="scope.row.properties" copyable boxed sort></json-viewer>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue';
import JsonViewer from 'vue-json-viewer';

Vue.component('json-viewer', JsonViewer);

export default {
  name: 'InstantDataView',
  data() {
    return {
      filters: {
        type: []
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

      const typeFilter = new Set();
      res.forEach(row => typeFilter.add(row.type));

      this.filters.type = Array.from(typeFilter).map(key => ({text: key, value: key}));
      return res
    }
  },
  methods: {
    typeFilterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
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