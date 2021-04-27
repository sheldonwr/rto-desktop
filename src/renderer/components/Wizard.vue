<template>
  <div class="wizard-wrap" :style="{ height: wrapperHeight }">
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
          <!-- <a-button v-if="$store.state.view.wizardClosable" @click="close">
            关闭
          </a-button> -->
        </template>
      </a-page-header>
      <div
        v-if="appList.length === 0"
        class="app-wrapper"
        :style="{ height: treeWrapperHeight }"
      >
        <p>无项目</p>
      </div>
      <template v-else>
        <div
          class="app-wrapper clearfix"
          :style="{ height: treeWrapperHeight }"
        >
          <div class="app-tree-wrapper">
            <a-tree
              blockNode
              showIcon
              :treeData="appList"
              @select="selectHandler"
              @rightClick="rightClickHandler"
              :defaultExpandedKeys="['dir-2']"
            >
              <template slot="dir" slot-scope="item">
                <a-icon :type="item.expanded ? 'folder-open' : 'folder'" theme="filled" :style="{ fontSize: '20px', color: '#ffca28' }" />
              </template>
              <template slot="app" slot-scope="item">
                <span
                  class="rto_iconfont icon-recycle"
                  :style="{ color: item.status === 'Running' ? '#52c41a' : '#d9d9d9' }"
                ></span>
              </template>
              <template slot="appTitle" slot-scope="item">
                <span
                  class="app-title-wrapper"
                  @dblclick="dblclickHandler(item)"
                >
                  <span>{{ item.title }}</span>
                </span>
              </template>
            </a-tree>
          </div>
          <div class="app-table-wrapper">
            <a-table :columns="columns" :data-source="runningAppList" rowKey="appId">
              <span slot="status" slot-scope="status">
                <a-badge
                  :status="status === 'Running' ? 'success' : 'default'"
                ></a-badge>{{ status === 'Running' ? '运行中' : '已停止' }}</span>
              <span slot="operation" slot-scope="item">
                <a href="#" @click="enterApp({id:item.appId, name:item.appName})">查看</a>
              </span>
            </a-table>
          </div>
        </div>
      </template>
    </a-spin>
    <context-menu ref="ctxMenu" v-show="contextItems.length > 0">
      <li
        class="wizard-menu-item"
        v-for="(item, idx) in contextItems"
        :key="idx"
        @click="item.onclick"
      >
        {{ item.label }}
      </li>
    </context-menu>
    <RenameForm v-model="renameDialogVisible" :isDir="renameIsDir" :model="renameModel" @success="renameSuccessHandler"></RenameForm>
    <DirDeleteForm v-if="deleteDirDialogVisible" v-model="deleteDirDialogVisible" :dir="deleteDirModel" @success="deleteDirSuccessHandler"></DirDeleteForm>
  </div>
</template>

<script>
import { interval, deepCopy } from "utils/";
import bus from "utils/bus";
import contextMenu from "vue-context-menu";
import RenameForm from "components/RenameForm";
import DirDeleteForm from "components/DirDeleteForm";

export default {
  components: {
    contextMenu,
    RenameForm,
    DirDeleteForm
  },
  data() {
    return {
      showLoading: true,
      loading: false,
      appList: [],
      runningAppList: [],
      refreshInterval: 5000,
      updatedAt: new Date(),
      contextItem: null,
      columns: [
        {
          title: "项目名称",
          dataIndex: "appName",
          key: "appName",
        },
        {
          title: "项目ID",
          dataIndex: "appId",
          key: "appId",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: 'status' },
        },
        {
          title: "时长",
          dataIndex: "age",
          key: "age"
        },
        {
          title: "CPU占用(毫核)",
          dataIndex: "resources.cpu",
          key: "resources.cpu",
          align: 'center'
        },
        {
          title: "内存占用(M)",
          dataIndex: "resources.mem",
          key: "resources.mem",
          align: 'center'
        },
        {
          title: '操作',
          key: "operation",
          scopedSlots: { customRender: 'operation' },
        },
      ],
      renameDialogVisible: false,
      renameIsDir: false,
      renameModel: null,
      deleteDirDialogVisible: false,
      deleteDirModel: {label:''},
    };
  },
  created() {
    bus.on("app-create-success", this.fetchAppsLoading);
    bus.on("dir-create-success", this.fetchAppsLoading);
  },
  computed: {
    wrapperHeight() {
      return this.$store.state.view.statusVisible
        ? "calc(100vh - 37px - 23px)"
        : "calc(100vh - 37px)";
    },
    treeWrapperHeight() {
      return this.$store.state.view.statusVisible
        ? "calc(100vh - 37px - 65.5px - 23px)"
        : "calc(100vh - 37px - 65.5px)";
    },
    contextItems() {
      if (!this.contextItem) {
        return [];
      }
      if (this.contextItem.isLeaf) {
        // 项目
        return [
          {
            label: "进入",
            onclick: () => {
              this.enterApp(this.contextItem.dataRef);
            },
          },
          {
            label: "重命名",
            onclick: () => {
              this.renameDialog(this.contextItem.dataRef, true);
            },
          },
          {
            label:
              this.contextItem.dataRef.status === "Running" ? "停止" : "开启",
            onclick: () => {
              this.changeStatus(this.contextItem.dataRef);
            },
          },
          {
            label: "删除",
            onclick: () => {
              this.deleteApp(this.contextItem.dataRef);
            },
          },
        ];
      } else {
        // 文件夹
        return [
          {
            label: "重命名",
            onclick: () => {
              this.renameDialog(this.contextItem.dataRef, false);
            }
          },
          {
            label: "删除",
            onclick: () => {
              this.deleteDir(this.contextItem.dataRef)
            },
          },
        ];
      }
    },
  },
  mounted() {
    this.reload(true);
    this.refreshTimer = interval(() => this.fetchApps(), this.refreshInterval);
  },
  beforeDestroy() {
    this.refreshTimer.clear();
    bus.off("app-create-success");
    bus.off("dir-create-success");
  },
  methods: {
    updateAppHeight() {},
    fetchAppsLoading() {
      this.fetchApps(true);
    },
    fetchApps(showLoading) {
      if(!this.$store.state.view.wizardVisible) {
        return;
      }
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
      this.$store
        .dispatch("file/runningList")
        .then((list) => {
          this.runningAppList = list;
        })
        .catch((err) => {
          console.error(err);
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
    deleteDir(dir) {
      this.deleteDirModel = deepCopy(dir);
      this.deleteDirDialogVisible = true;
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
      let title =
        app.status === "Running"
          ? `确定停止${app.name}项目？`
          : `确定开启${app.name}项目？`;
      this.$confirm({
        title: title,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          if (app.status === "Running") {
            this.$store.dispatch("showMessage", {
              type: "info",
              msg: "停止中...",
            });
            this.$store.dispatch("status/release", app.id);
          } else {
            this.$store.dispatch("showMessage", {
              type: "info",
              msg: "开启中...",
            });
            this.$store.dispatch("status/deploy", app.id);
          }
        },
        onCancel() {},
      });
    },
    selectHandler(selectedKeys, e) {
      if (!e.node.isLeaf) {
        e.node.onExpand(!e.node.expanded);
      }
    },
    dblclickHandler(item) {
      this.enterApp(item.dataRef);
    },
    rightClickHandler({ event, node }) {
      this.contextItem = node;
      if (this.$refs.ctxMenu) {
        this.$refs.ctxMenu.open(event);
      }
    },
    renameDialog(item, isApp) {
      this.renameDialogVisible = true
      this.renameIsDir = !isApp;
      if(isApp) {
        this.renameModel = {id:item.id, name: item.name}
      }else {
        this.renameModel = {id:item.id, name: item.label}
      }
    },
    renameSuccessHandler() {
      this.fetchAppsLoading();
    },
    deleteDirSuccessHandler() {
      this.fetchAppsLoading();
    }
  },
};
</script>

<style lang="scss">
.app-wrapper {
  padding: 0 10px;
  height: calc(100vh - 37px - 65.5px);
  .app-tree-wrapper {
    float: left;
    height: 100%;
    width: 40%;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid rgb(232, 232, 232);
  }
  .app-table-wrapper {
    float: left;
    height: 100%;
    width: 60%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 20px;
  }
}
.ctx-menu {
  font-size: 14px !important;
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
.ant-tree li .ant-tree-node-content-wrapper {
  color: rgb(31,31,31);
}
</style>

<style lang="scss" scoped>
.wizard-wrap {
  width: 100%;
  position: absolute;
  top: 37px;
  z-index: 999;
  background: #fff;
  height: calc(100vh - 37px);
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
