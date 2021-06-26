<template>
  <!-- <a-table :columns="columns" :data-source="data" rowKey="appId" :pagination="false">
    <span slot="appName" slot-scope="item">
      <span class="app-name">{{ item.appName }}</span>
    </span>
    <span slot="status" slot-scope="status">
      <a-badge :status="status === 'Running' ? 'success' : 'default'"></a-badge
      >{{ status === "Running" ? "运行中" : "已停止" }}
    </span>
    <span slot="operation" slot-scope="item">
      <a href="#" @click="enterApp({ id: item.appId, name: item.appName })"
        >查看</a
      >
    </span>
  </a-table> -->
  <div class="running-table">
    <div class="header-tr clearfix">
      <span class="item app-name">项目名称</span>
      <span class="item app-id">项目ID</span>
      <span class="item app-status">状态</span>
      <span class="item app-age">时长</span>
      <span class="item app-cpu">CPU占用(毫核)</span>
      <span class="item app-mem">内存占用(M)</span>
    </div>
    <div class="body-wrap">
      <div class="body-tr clearfix" v-for="item in data" :key="item.appId" @dblclick="dblclickHandler(item)">
        <span class="item app-name">{{ item.appName }}</span>
        <span class="item app-id">{{ item.appId }}</span>
        <span class="item app-status">
          <a-badge :status="item.status === 'Running' ? 'success' : 'default'">
            </a-badge>{{ item.status === "Running" ? "运行中" : "已停止" }}
        </span>
        <span class="item app-age">{{ item.age }}</span>
        <span class="item app-cpu">{{ item.resources.cpu }}</span>
        <span class="item app-mem">{{ item.resources.mem }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    dblclickHandler(item) {
      this.$emit('select-app', {id:item.appId, name: item.appName})
    }
  }
};
</script>

<style lang="scss" scoped>
.running-table {
  .item {
    float: left;
    padding: 6px 8px;
  }
  .app-name {
    width: 25%;
  }
  .app-id {
    width: 12%;
  }
  .app-status {
    width: 14%;
  }
  .app-age {
    width: 15%;
  }
  .app-cpu {
    width: 17%;
  }
  .app-mem {
    width: 17%;
  }
  .header-tr {
    background: #EBF4FD;
    border-bottom: 1px solid rgba(112,112,112,0.5);
  }
  .body-tr {
    .app-name {
      font-weight: bold;
    }
    &:hover {
      background: #B8DCFD;
    }
  }
}
</style>
