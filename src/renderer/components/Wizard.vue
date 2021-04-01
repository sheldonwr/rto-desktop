<template>
  <div class="wizard-wrap">
    <a-spin :spinning="showLoading && loading">
      <a-page-header title="项目列表">
        <template slot="extra">
          <a-tooltip placement="left">
            <template slot="title">
              <span>上次更新时间：</span>
              <span>{{ updatedAt.toLocaleTimeString() }}</span>
            </template>
            <a-button type="link" @click="reload">
              <a-icon type="sync" :spin="loading" />
              <span>刷新</span>
            </a-button>
          </a-tooltip>
          <a-button type="primary" @click="createDirModal">
            <a-icon type="plus" />文件夹
          </a-button>
          <a-button type="primary" @click="createAppModal">
            <a-icon type="plus" />项目
          </a-button>
          <a-button v-if="$store.state.view.wizardClosable" @click="close">
            关闭
          </a-button>
        </template>
      </a-page-header>
      <div v-if="appList.length === 0" class="app-card-wrapper">
        <p>无项目</p>
      </div>
      <template v-else>
        <div class="app-card-wrapper">
          <a-tree
            blockNode
            showIcon
            :treeData="appList"
            @select="selectHandler"
            @rightClick="rightClickHandler"
            :defaultExpandedKeys="['dir-2']"
          >
          <template slot="dir" slot-scope="item">
            <a-icon :type="item.expanded ? 'folder-open' : 'folder'" />
          </template>
          <template slot="app" slot-scope="item">
            <a-badge :status="item.status === 'Running' ? 'success' : 'default'"></a-badge>
          </template>
          <template slot="appTitle" slot-scope="item">
            <span class="app-title-wrapper" @dblclick="dblclickHandler(item)">
              <span>{{ item.title }}</span>
              </span>
          </template>
          </a-tree>
        </div>
      </template>
    </a-spin>
    <context-menu ref="ctxMenu">
      <li class="wizard-menu-item" v-for="(item, idx) in contextItems" :key="idx">{{ item.label }}</li>
    </context-menu>
  </div>
</template>

<script>
import { interval } from "utils/";
import bus from "utils/bus"
import contextMenu from 'vue-context-menu'

export default {
  components: {
    contextMenu
  },
  data() {
    return {
      showLoading: true,
      loading: false,
      appList: [],
      refreshInterval: 5000,
      updatedAt: new Date(),
      contextItem: null
    };
  },
  created() {
    bus.on('app-create-success', this.fetchAppsLoading)
    bus.on('dir-create-success', this.fetchAppsLoading)
  },
  computed: {
    contextItems() {
      if(!this.contextItem) {
        return []
      }
      if(this.contextItem.isLeaf) {
        return [{
          label: this.contextItem.dataRef.status === 'Running' ? '停止' : '开启',
        }, {
          label: '删除'
        }]
      }else {
        if(this.contextItem.dataRef.id == 1 || this.contextItem.dataRef.id == 2) {
          return []
        }else {
          return [{
            label: '删除'
          }]
        }
      }
    }
  },
  mounted() {
    this.reload(true);
    this.refreshTimer = interval(() => this.fetchApps(), this.refreshInterval);
  },
  beforeDestroy() {
    this.refreshTimer.clear();
    bus.off('app-create-success', this.fetchAppsLoading)
    bus.off('dir-create-success', this.fetchAppsLoading)
  },
  methods: {
    fetchAppsLoading() {
      this.fetchApps(true)
    },
    fetchApps(showLoading) {
      if (showLoading) {
        this.showLoading = true;
      } else {
        this.showLoading = false;
      }
      this.loading = true;
      this.$store
        .dispatch("file/list")
        .then((list) => {
          this.updatedAt = new Date();
          this.appList = list;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    createAppModal() {
      this.$store.commit("view/createAppDialog", true);
    },
    createDirModal() {
      this.$store.commit("view/createDirDialog", true);
    },
    enterApp(app) {
      this.$store.dispatch("file/enterApp", app).then(() => {
        this.$store.commit("view/wizardVisible", false);
        this.$store.commit("view/wizardClosable", true);
      });
    },
    deleteApp(app) {
      this.$confirm({
        title: `确定删除“${app.name}”这个项目吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          return this.$store
            .dispatch("file/delete", app)
            .then(() => {
              this.$store.dispatch("showMessage", {
                type: "success",
                msg: "删除成功",
              });
              this.$store.commit("view/wizardClosable", false);
              this.fetchApps();
            })
            .catch((err) => {
              this.$store.dispatch("showMessage", {
                type: "error",
                msg: "删除成功",
              });
              console.error(err);
            });
        },
        onCancel() {},
      });
    },
    close() {
      this.$store.commit("view/wizardVisible", false);
    },
    reload(showLoading) {
      if (window.SuanpanAPI) {
        this.fetchApps(showLoading);
      } else {
        window.addEventListener("load", () => {
          this.fetchApps(showLoading);
        });
      }
    },
    changeStatus(app) {
      if (app.status === "Running") {
        this.$store.dispatch("showMessage", { type: "info", msg: "停止中..." });
        this.$store.dispatch("status/release", app.id);
      } else {
        this.$store.dispatch("showMessage", { type: "info", msg: "开启中..." });
        this.$store.dispatch("status/deploy", app.id);
      }
    },
    selectHandler(selectedKeys, e) {
      if(!e.node.isLeaf) {
        e.node.onExpand(!e.node.expanded)
      }
    },
    dblclickHandler(item) {
      this.enterApp(item.dataRef)
    },
    rightClickHandler({event, node}) {
      this.contextItem = node
      this.$refs.ctxMenu.open(event)
    }
  },
};
</script>

<style lang="scss">
.app-card-wrapper {
  padding: 0 10px;
  height: calc(100vh - 37px - 65.5px);
  overflow-y: auto;
  overflow-x: hidden;
}
.app-card {
  margin-bottom: 8px;
}
.wizard-wrap {
  .ant-tree-title {
    display: inline-block;
    width: calc(100% - 24px);
  }
}
.ctx-menu {
  font-size: 14px;
}
.wizard-menu-item {
  cursor: pointer;
  line-height: 28px;
  padding: 0 12px;
  &:hover {
    background: #ddd;
  }
  &.disabled {
    cursor: not-allowed;
  }
}
</style>

<style lang="scss" scoped>
.wizard-wrap {
  width: 100%;
  position: absolute;
  top: 37px;
  z-index: 999;
  height: calc(100vh - 37px);
  background: #fff;
  .reload {
    position: relative;
    top: 2px;
  }
  .app-title-wrapper {
    display: inline-block;
    width: 100%;
  }
}
</style>
