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
  </div>
</template>
<script>
export default {
  computed: {
    getMenuInfo() {
      return this.$store.state.drawer.menuInfo;
    },
  },
  methods: {
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