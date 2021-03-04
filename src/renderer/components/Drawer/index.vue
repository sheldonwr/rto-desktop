<template>
  <div>
    <a-drawer
      wrapClassName="drawer-wrap"
      placement="right"
      :closable="true"
      :visible="isDrawerVisible"
      @close="onClose"
      width="50%"
      :body-style="{ padding: 0, height: '100%' }"
    >
      <model-algo-manage />
    </a-drawer>
  </div>
</template>
<script>
import ModelAlgoManage from '../ModelAlgoManage';
export default {
  components: {
    ModelAlgoManage
  },
  computed: {
    isDrawerVisible() {
      return this.$store.state.drawer.drawerVisible;
    }
  },
  methods: {
    onClose() {
      this.$store.dispatch('drawer/closeDrawer');
      this.$store.commit('ci/updatePagination', { current: 1 });
    },
  }, 
};
</script>
<style lang="scss" scoped>
  :global {
    .ant-drawer-right {
      top: 37px;
    }
  }
  #drawer-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>