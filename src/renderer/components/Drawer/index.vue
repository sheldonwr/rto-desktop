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
      <model-algo-manage v-if="isModelAlgoManage" />
      <iframe v-else class="draweIframe" :src="getIfameUrl" />
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
    },
    isModelAlgoManage() {
      return this.$store.state.drawer.isModelAlgoManage;
    },
    getIfameUrl() {
      return this.$store.state.drawer.iframURL;
    }
  },
  methods: {
    onClose() {
      this.$store.commit('drawer/changeDrawerVisible', false);
      this.$store.commit('drawer/changeIsModelAlgoManage', false);
      this.$store.commit('ci/updatePagination', { current: 1 });
    },
  }, 
};
</script>
<style lang="scss" scoped>
  :global {
    .ant-drawer-body {
      border-radius: 8px;
    }
    .ant-drawer-right {
      top: 37px;
    }
  }
  #drawer-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .draweIframe {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
</style>