<template>
  <div>
    <div
      class="menu" 
      :style="{ display: getMenuInfo.visible ? 'block' : 'none', left: `${getMenuInfo.location.x}px`, top: `${getMenuInfo.location.y}px`  }"
    >
      <div
        class="menuItem"
        v-for="item in getMenuInfo.detail"
        :key="item.key"
        @click="() => item.function()"
        :style="!item.active && {color: '#b9b5b5', 'pointer-events': 'none'}"
      >
        {{ item.name }}
      </div>
    </div>
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
    getMenuInfo() {
      return this.$store.state.drawer.menuInfo;
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
      this.$store.commit('drawer/changeIframURL', '');
    },
  }, 
};
</script>
<style lang="scss" scoped>
  .menu {
    position: absolute;
    background: #fff;
    // box-shadow: 0 0 5px 1px #e8e8e8;
    border: 1px solid rgba(112,112,112,0.3);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
    .menuItem {
      line-height: 32px;
      padding: 0 16px;
      cursor: pointer;
      min-width: 120px;
      &:hover {
        // color: royalblue;
        background: #B8DCFD;
      }
    }
  }
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