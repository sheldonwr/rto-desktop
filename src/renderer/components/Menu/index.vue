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
        <drop-menu
          v-show="openedMenu === menuItem.value"
          class="menu-bottom"
          :datas="menuItem.items"
        ></drop-menu>
      </li>
    </ul>
  </div>
</template>

<script>
import DropMenu from "./DropMenu";
import bus from "utils/bus";

export default {
  name: "app-menu",
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
              disabled: false,
              keycut: 'Ctrl+N'
            },
            {
              label: "打开",
              value: "file-open",
              disabled: false,
              keycut: 'Ctrl+O'
            },
            {
              label: "保存",
              value: "file-save",
              disabled: false,
              keycut: 'Ctrl+S'
            },
            {
              label: "另存为",
              value: "file-saveAs",
              disabled: false,
              keycut: 'Ctrl+Shift+S'
            },
            {
              label: "最近打开",
              value: "file-recent",
              disabled: false,
              items: this.recentApps,
            },
            {
              label: "关闭",
              value: "file-close",
            },
            {
              label: "终止",
              value: "file-terminate",
            },
            {
              label: "退出",
              value: "file-quit",
              disabled: false,
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
              disabled: false,
              keycut: 'Ctrl+X'
            },
            {
              label: "复制",
              value: "edit-copy",
              disabled: false,
              keycut: 'Ctrl+C'
            },
            {
              label: "粘贴",
              value: "edit-paste",
              disabled: false,
              keycut: 'Ctrl+V'
            },
            {
              label: "删除",
              value: "edit-delete",
              disabled: false,
              keycut: 'Delete'
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
              checked: this.$store.state.view.toolbarVisible,
              keycut: 'F3'
            },
            {
              label: "状态栏",
              value: "view-status",
              disabled: true,
              disabled: false,
              checkable: true,
              checked: this.$store.state.view.statusVisible,
              keycut: 'F4'
            },
            {
              label: "项目列表",
              value: "view-app",
              disabled: false,
              checkable: true,
              checked: false,
              keycut: 'F7'
            },
            {
              label: "报警显示",
              value: "view-alarm",
              disabled: false,
              checkable: true,
              checked: this.$store.state.view.logPanelVisible,
              keycut: 'Ctrl+`'
            },
            {
              label: "刷新",
              value: "view-refresh",
              keycut: 'F5'
            },
            {
              label: "属性配置",
              value: "view-param",
              disabled: false,
              checkable: true,
              checked: this.$store.state.view.paramVisible,
              keycut: 'F1'
            },
            // {
            //   label: "设置",
            //   value: "view-setting",
            //   disabled: false,
            //   checkable: true,
            //   checked: this.$store.state.setting.settingVisible,
            // }
          ],
        },
        action: {
          label: "操作",
          value: "action",
          items: [
            {
              label: "连接",
              value: "action-connection",
              disabled: false,
            },
            {
              label: "通讯",
              value: "action-update",
              disabled: false,
              items: [],
            },
            {
              label: '前端显示',
              value: "frontend-view",
              disabled: false,
            }
          ],
        },
        tools: {
          label: "工具",
          value: "tools",
          items: [
            {
              label: "注销组件",
              value: "edit-delete",
              disabled: false,
            },
            {
              label: "模型管理",
              value: "model-manage",
              disabled: false,
            },
            {
              label: "算法管理",
              value: "algo-manage",
              disabled: false,
            },
          ],
        },
        help: {
          label: "帮助",
          value: "help",
          items: [
            {
              label: "RTO用户帮助",
              value: "help-rto",
              keycut: 'F10'
            },
            {
              label: "关于RTO",
              value: "help-about"
            },
          ],
        },
      },
      openedMenu: "",
      opcNodes: []
    };
  },
  computed: {
    menuItems() {
      return Object.keys(this.menus).map((menuKey) => ({
        ...this.menus[menuKey],
      }));
    },
    recentApps() {
      let apps = [];
      let _apps = this.$store.state.file.recentOpenedApps;
      for (let i = 0; i < _apps.length; i++) {
        apps.push({
          label: _apps[i].name,
          _model: _apps[i],
          value: `file-recent-${i}`,
          level: 2,
        });
      }
      return apps;
    },
  },
  watch: {
    "$store.state.file.recentOpenedApps": {
      handler() {
        this.menus.file.items.find(
          (item) => item.value === "file-recent"
        ).items = this.recentApps;
      },
      immediate: true,
    },
    "$store.state.view.toolbarVisible": {
      handler() {
        this.menus.view.items.find(
          (item) => item.value === "view-tool"
        ).checked = this.$store.state.view.toolbarVisible;
      },
    },
    "$store.state.view.statusVisible": {
      handler() {
        this.menus.view.items.find(
          (item) => item.value === "view-status"
        ).checked = this.$store.state.view.statusVisible;
      },
    },
    "$store.state.view.logPanelVisible": {
      handler() {
        this.menus.view.items.find(
          (item) => item.value === "view-alarm"
        ).checked = this.$store.state.view.logPanelVisible;
      },
    },
    "$store.state.status.appStatus": {
      handler() {
        this.checkGraph();
        let editCut = this.menus.edit.items.find(
          (item) => item.value === "edit-cut"
        );
        let editCopy = this.menus.edit.items.find(
          (item) => item.value === "edit-copy"
        );
        let editPaste = this.menus.edit.items.find(
          (item) => item.value === "edit-paste"
        );
        let editDelete = this.menus.edit.items.find(
          (item) => item.value === "edit-delete"
        );
        let toolEditDelete = this.menus.tools.items.find(
          (item) => item.value === "edit-delete"
        );
        if(this.$store.getters["status/isRunning"]) {
          editCut.disabled = true;
          editCopy.disabled = true;
          editPaste.disabled = true;
          editDelete.disabled = true;
          toolEditDelete.disabled = true;
        }else {
          editCut.disabled = false;
          editCopy.disabled = false;
          editPaste.disabled = false;
          editDelete.disabled = false;
          toolEditDelete.disabled = false;
        }
      }
    },
    "$store.state.view.paramVisible": {
      handler() {
        this.menus.view.items.find(
          (item) => item.value === "view-param"
        ).checked = this.$store.state.view.paramVisible;
      },
    },
    "$store.state.setting.settingVisible": {
      handler() {
        this.menus.view.items.find(
          (item) => item.value === "view-setting"
        ).checked = this.$store.state.setting.settingVisible;
      },
    },
  },
  created() {
    window.addEventListener("load", this.nodeActionListener);
    bus.on("transition-predict", this.predictTransition);
  },
  beforeDestroy() {
    window.removeEventListener("load", this.nodeActionListener);
  },
  methods: {
    menuClickHandler(menuItem) {
      this.openedMenu = menuItem.value;
    },
    menuMouseenterHandler(menuItem) {
      if (this.openedMenu) {
        this.openedMenu = menuItem.value;
      }
    },
    menuBlurHandler() {
      this.openedMenu = "";
    },
    menuItemClicked(menuItem) {
      this.openedMenu = "";
      let menuItemId = menuItem.value;
      if (menuItemId.indexOf("file-recent") === 0) {
        let arr = menuItemId.split("-");
        let idx = parseInt(arr[arr.length - 1]);
        this.$store
          .dispatch("file/enterRecentApp", this.recentApps[idx]._model)
          .catch(err => {
            this.dispatch('showMessage', { type: "error", msg: "打开失败" });
            console.error(err)
          });
      }else if(menuItem.id === 'rto-db') {
        window.open(menuItem.value);
      }
      switch (menuItemId) {
        case "file-new":
          // 新建
          this.$store.commit('view/createAppDialog', true);
          break;
        case "file-open":
          // 打开
          this.$store.dispatch("file/open").catch(err => {
            console.error(err)
          });
          break;
        case "file-save":
          // 保存
          this.$store.dispatch("file/save");
          break;
        case "file-saveAs":
          // 另存为
          this.$store.dispatch("file/saveAs");
          break;
        case "file-close":
          // 关闭
          this.$store.commit('file/currentApp', {id:null, name:''});
          this.$store.commit('view/wizardClosable', false);
          this.$store.commit("view/wizardVisible", true);
          break;
        case "file-terminate":
          bus.emit("file-terminate");
          break;
        case "file-quit":
          // 退出
          this.$confirm({
            title: `确定关闭软件吗？`,
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
              return this.$store.dispatch('window/closeWindow')
            },
            onCancel() {},
          });
          break;
        case "edit-cut":
          this.$store.dispatch("edit/cutNode");
          break;
        case "edit-copy":
          this.$store.dispatch("edit/copyNode");
          break;
        case "edit-paste":
          this.$store.dispatch("edit/pasteNode");
          break;
        case "edit-delete":
          if(this.$store.state.edit.selectedNode && !this.$store.getters["status/isRunning"]) {
            this.$confirm({
              title: `确定删除这个组件吗？`,
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
                this.$store.dispatch("edit/deleteNode");
              },
              onCancel() {},
            });
          }
          break;
        case "frontend-view":
          this.$store.commit("view/frontendVisible", true);
          break;
        case "view-app":
          this.$store.commit("view/logPanelVisible", false);
          this.$store.commit("view/wizardVisible", true);
          break;
        case "view-tool":
          this.$store.commit(
            "view/toolbarVisible",
            !this.$store.state.view.toolbarVisible
          );
          break;
        case "view-status":
          this.$store.commit(
            "view/statusVisible",
            !this.$store.state.view.statusVisible
          );
          break;
        case "view-alarm":
          this.$store.commit(
            "view/logPanelVisible",
            !this.$store.state.view.logPanelVisible
          );
          break;
        case "view-refresh":
          this.$store.dispatch("file/gotoCurrentPredict");
          break;
        case "view-param":
          if(this.$store.state.view.paramVisible) {
            this.$store.dispatch("view/closeSettingPannel")
          }else {
            this.$store.dispatch("view/showSettingPannel")
          }
          break;
        case "view-setting":
          this.$store.commit(
            "setting/settingVisible",
            !this.$store.state.setting.settingVisible
          );
          break;
        case "action-connection":
          this.$store.dispatch("file/gotoCurrentPredict");
          break;
        case "model-manage": // 模型管理
          this.$store.dispatch('window/createModalWindow');
          break;
        case "algo-manage": // 算法管理
          this.$store.dispatch('window/createAlgorithmWindow');
          break;
        case "help-rto":
          // window.open('https://xuelangyun.yuque.com/suanpan_doc/public');
          this.$store.commit('view/helpVisible', true)
          break;
        case "help-about":
          this.$store.commit('view/aboutVisible', true)
          break;
      }
    },
    nodeActionListener() {
      window.SuanpanAPI.eventService.on('appNodeAdded', () => {
        this.checkGraph();
      });
      window.SuanpanAPI.eventService.on('appNodeDeleted', () => { 
        this.checkGraph();
      });
      this.checkGraph();
    },
    checkGraph() {
      let actionItem = this.menus.action.items.find(
        (item) => item.value === "action-update"
      );
      if(!this.$store.getters["status/isRunning"]) {
        actionItem.disabled = true;
        this.opcNodes = [];
        return;
      }
      const graph = window.SuanpanAPI.nodeService.getGraph();
      let nodes = [];
      if(graph) {
        nodes = graph.nodes;
      }
      this.opcNodes = [];
      
      for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let def = node.metadata.def;
        if(def && (def.dockerCmd.indexOf('rto_device') > -1) 
          && (def.actionList && def.actionList[0].url)) {
          let url = def.actionList[0].url;
          url = `${appConfig.redirectRequest}${(url || '').match(/\/proxr[\S]*/)}`
                              .replace('{{userId}}', window.appConfig.userId)
                              .replace('{{appId}}', window.appConfig.appId)
                              .replace('{{nodeId}}',  node.id)
          this.opcNodes.push({
            label: node.metadata.label,
            value: url,
            id: 'rto-db'
          });
        }
      }
      actionItem.items = this.opcNodes;
      if(this.opcNodes.length > 0) {
        actionItem.disabled = false;
      }else {
        actionItem.disabled = true;
      }
    },
    predictTransition(appId) {
      this.checkGraph();
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-list {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--e-menu-bar-bg);
  height: 38px;
  z-index: 999;
  margin: 0;
  .menu-item {
    padding: 0 10px;
    cursor: pointer;
    outline: 0;
    position: relative;
    line-height: 38px;
    color: var(--e-menu-bar-color);
    &:hover {
      color: var(--e-menu-bar-active-color);
      background: var(--e-menu-bar-active-bg);
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
