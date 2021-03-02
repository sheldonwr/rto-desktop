<template>
  <div>
    <ul class="menu-list">
      <li
        class="menu-item"
        tabindex="-1"
        v-for="menuItem in menuItems"
        :key="menuItem.value"
        @click="menuClickHandler(menuItem)"
        @mouseenter="menuMouseenterHandler(menuItem)"
        @blur="menuBlurHandler"
      >
        <span>{{ menuItem.label }}</span>
        <drop-menu v-if="openedMenu === menuItem.value" class="menu-bottom" :datas="menuItem.items"></drop-menu>
      </li>
    </ul>
  </div>
</template>

<script>
import DropMenu from "./DropMenu";

export default {
  name: 'app-menu',
  components: {
    DropMenu,
  },
  data() {
    return {
      menus: {
        file: {
          label: "文件",
          value: "file",
          items: [
            {
              label: "新建",
              value: "file-new",
              status: 'normal'
            },
            {
              label: "打开",
              value: "file-open",
              status: 'normal'
            },
            {
              label: "保存",
              value: "file-save",
              status: 'normal'
            },
            {
              label: "另存为",
              value: "file-saveAs",
              status: 'normal'
            },
            {
              label: "关闭",
              value: "file-close",
              status: 'normal'
            },
            {
              label: "终止",
              value: "file-terminate",
              status: 'disabled'
            },
            {
              label: "最近打开",
              value: "file-recent",
              status: 'normal',
              items: []
            },
            {
              label: "退出",
              value: "file-quit",
              status: 'normal'
            },
          ],
        },
        edit: {
          label: "编辑",
          value: "edit",
          items: [
            {
              label: "剪切",
              value: "edit-cut",
              status: 'normal'
            },
            {
              label: "复制",
              value: "edit-copy",
              status: 'normal'
            },
            {
              label: "粘贴",
              value: "edit-paste",
              status: 'normal'
            },
            {
              label: "删除",
              value: "edit-delete",
              status: 'normal'
            },
            {
              label: "切换功能块状态",
              value: "edit-switchStatus",
              status: 'normal'
            },
          ],
        },
        view: {
          label: "视图",
          value: "view",
          items: [
            {
              label: "工具栏",
              value: "view-tool",
              status: 'normal'
            },
            {
              label: "状态栏",
              value: "view-status",
              status: 'normal'
            },
            {
              label: "平台窗口",
              value: "view-platform",
              status: 'normal'
            },
            {
              label: "报警显示",
              value: "view-alarm",
              status: 'normal'
            },
            {
              label: "刷新",
              value: "view-refresh",
              status: 'normal'
            },
            {
              label: "设置",
              value: "view-setting",
              status: 'normal'
            },
            {
              label: "事件日志",
              value: "view-log",
              status: 'normal'
            },
            {
              label: "显示说明",
              value: "view-description",
              status: 'normal'
            },
            {
              label: "溯源",
              value: "view-origin",
              status: 'normal'
            },
          ],
        },
        action: {
          label: "更新",
          value: "action",
          items: [
            {
              label: "连接",
              value: "action-connection",
              status: 'normal'
            },
            {
              label: "路径",
              value: "edit-path",
              status: 'normal'
            },
            {
              label: "更新",
              value: "edit-update",
              status: 'normal'
            },
          ],
        },
        tools: {
          label: "工具",
          value: "tools",
          items: [
            {
              label: "未注册",
              value: "tools-notRegister",
              status: 'normal'
            },
            {
              label: "更新URT服务账户",
              value: "tools-urt",
              status: 'normal'
            },
            {
              label: "管理组",
              value: "tools-manage",
              status: 'normal'
            },
            {
              label: "模型管理",
              value: "model-manage",
              status: 'normal'
            },
            {
              label: "算法管理",
              value: "algo-manage",
              status: 'normal'
            },
          ],
        },
        help: {
          label: "帮助",
          value: "help",
          items: [
            {
              label: "URT用户帮助",
              value: "help-urt",
              status: 'normal'
            },
            {
              label: "关于UrtExplorer",
              value: "help-about",
              status: 'normal'
            },
          ],
        },
      },
      openedMenu: ''
    };
  },
  computed: {
    menuItems() {
      return Object.keys(this.menus).map((menuKey) => ({
        ...this.menus[menuKey],
      }));
    },
  },
  methods: {
    menuClickHandler(menuItem) {
      this.openedMenu = menuItem.value;
    },
    menuMouseenterHandler(menuItem) {
      if(this.openedMenu) {
        this.openedMenu = menuItem.value;
      }
    },
    menuBlurHandler() {
      this.openedMenu = '';
    },
    menuItemClicked(menuItem) {
      this.openedMenu = '';
      let menuItemId = menuItem.value;
      if(menuItemId === 'file-new') {

      }
      switch(menuItemId) {
        case "file-new":
          break;
        case "model-manage": // 模型管理
          this.$store.dispatch('drawer/showDrawer');
          this.$store.dispatch('drawer/selectActiveTab', 'model');
          break;
        case "algo-manage": // 算法管理
          this.$store.dispatch('drawer/showDrawer');
          this.$store.dispatch('drawer/selectActiveTab', 'algo');
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-list {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 4px 0 4px 6px;
  height: 38px;
  .menu-item {
    padding: 5px 10px;
    cursor: pointer;
    outline: 0;
    position: relative;
    &:hover {
      background-color: rgba(238, 238, 238, 0.6);
      border-radius: 2px;
    }
    .menu-bottom {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 99999;
    }
  }
}
</style>
