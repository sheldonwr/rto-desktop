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
              disabled: false
            },
            {
              label: "打开",
              value: "file-open",
              disabled: false
            },
            {
              label: "保存",
              value: "file-save",
              disabled: false
            },
            {
              label: "另存为",
              value: "file-saveAs",
              disabled: false
            },
            {
              label: "关闭",
              value: "file-close",
              disabled: false
            },
            {
              label: "终止",
              value: "file-terminate",
              disabled: true
            },
            {
              label: "最近打开",
              value: "file-recent",
              disabled: false,
              items: []
            },
            {
              label: "退出",
              value: "file-quit",
              disabled: false
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
              disabled: false
            },
            {
              label: "复制",
              value: "edit-copy",
              disabled: false
            },
            {
              label: "粘贴",
              value: "edit-paste",
              disabled: false
            },
            {
              label: "删除",
              value: "edit-delete",
              disabled: false
            },
            {
              label: "切换功能块状态",
              value: "edit-switchStatus",
              disabled: false
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
              disabled: false,
              checkable: true,
              checked: this.$store.state.view.toolbarVisible
            },
            {
              label: "状态栏",
              value: "view-status",
              disabled: false,
              checkable: true,
              checked: this.$store.state.view.logPanelVisible
            },
            {
              label: "平台窗口",
              value: "view-platform",
              disabled: false
            },
            {
              label: "报警显示",
              value: "view-alarm",
              disabled: false
            },
            {
              label: "刷新",
              value: "view-refresh",
              disabled: false
            },
            {
              label: "设置",
              value: "view-setting",
              disabled: false
            },
            {
              label: "事件日志",
              value: "view-log",
              disabled: false
            },
            {
              label: "显示说明",
              value: "view-description",
              disabled: false
            },
            {
              label: "溯源",
              value: "view-origin",
              disabled: false
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
              disabled: false
            },
            {
              label: "路径",
              value: "edit-path",
              disabled: false
            },
            {
              label: "更新",
              value: "edit-update",
              disabled: false
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
              disabled: false
            },
            {
              label: "更新URT服务账户",
              value: "tools-urt",
              disabled: false
            },
            {
              label: "管理组",
              value: "tools-manage",
              disabled: false
            },
            {
              label: "模型管理",
              value: "model-manage",
              disabled: false
            },
            {
              label: "算法管理",
              value: "algo-manage",
              disabled: false
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
              disabled: false
            },
            {
              label: "关于UrtExplorer",
              value: "help-about",
              disabled: false
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
      switch(menuItemId) {
        case "file-new":
          // 新建
          break;
        case "file-open":
          // 打开
          this.$store.dispatch('file/openFile')
          break;
        case "file-save":
          this.$store.dispatch('file/saveFile')
          break;
        case "view-tool":
          menuItem.checked = !this.$store.state.view.toolbarVisible;
          this.$store.commit('view/toolbarVisible', !this.$store.state.view.toolbarVisible)
          break;
        case "view-status":
          menuItem.checked = !this.$store.state.view.logPanelVisible;
          this.$store.commit('view/logPanelVisible', !this.$store.state.view.logPanelVisible)
          break;
        case "model-manage": // 模型管理
          this.$store.dispatch('drawer/showDrawer');
          this.$store.dispatch('drawer/selectActiveTab', 'model');
          this.$store.dispatch('ci/getList', {
            type: 'model',
            pagination: this.$store.getters['ci/getPagination']
          });
          break;
        case "algo-manage": // 算法管理
          this.$store.dispatch('drawer/showDrawer');
          this.$store.dispatch('drawer/selectActiveTab', 'algo');
          this.$store.dispatch('ci/getList', {
            type: 'algo',
            pagination: this.$store.getters['ci/getPagination']
          });
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
