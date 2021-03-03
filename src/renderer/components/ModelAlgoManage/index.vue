<template>
  <div class="card-content">
    <a-tabs :active-key="getActiveTab" type="card" @change="this.changeActiveTab">
      <a-tab-pane key="model" tab="模型管理">
        <Manage type="model" />
      </a-tab-pane>
      <a-tab-pane key="algo" tab="算法管理">
        <Manage type="algo" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Manage from './Manage';
export default {
  components: {
    Manage
  },
  data() {
    return {
      currentTab: 'model'
    };
  },
  computed: {
    getActiveTab: function () {
      return this.$store.state.drawer.activeTab;
    }
  },
  methods: {
    changeActiveTab(activeKey) {
      this.$store.dispatch('drawer/selectActiveTab', activeKey);
      this.$store.commit('ci/updatePagination', { current: 1 });
    },
  },
};
</script>
<style >
.card-content {
  background: #f0f3f8;
  overflow: hidden;
  padding: 20px;
  height: 100%;
}

.card-content .ant-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: initial;
}

.ant-drawer-content {
  border-radius: 8px;
}

.card-content > .ant-tabs-card > .ant-tabs-content {
  flex: 1;
  margin-top: -16px;
  overflow: hidden;
}

.card-content > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 0 4px #bdbcbc;
  overflow: auto;
}

.card-content > .ant-tabs-card > .ant-tabs-bar {
  border-color: transparent;
  padding: 0 15px;
}

.card-content .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border-color: transparent;
  background: #fafafa;
  height: 35px;
  color: #c8c9cb;
}

.card-content .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
  border-radius: 5px 5px 0 0;
  border-top: 3px solid #1058f4;
  color: #1058f4;
  height: 40px;
  box-shadow: 0 0 4px #bdbcbc
}
</style>