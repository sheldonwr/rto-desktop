<template>
  <div class="app-wrap">
    <div class="container clearfix">
      <div class="tree-wrap">
        <div class="tree-actions">
          <img
            class="action"
            title="刷新"
            :src="require('@/wizard/assets/img/refresh.png')"
            @click="fetchApps"
          />
          <div class="spacing"></div>
          <img
            class="action"
            title="新建文件夹"
            :src="require('@/wizard/assets/img/folder_add.png')"
            @click="createDir(selectItem)"
          />
          <img
            class="action"
            title="新建项目"
            :src="require('@/wizard/assets/img/app_add.png')"
            @click="createApp(selectItem)"
          />
        </div>
        <div class="tree-list">
          <a-spin :spinning="showLoading">
            <p v-if="appList.length === 0">无项目</p>
            <template v-else>
              <a-tree
                ref="tree"
                blockNode
                showIcon
                :treeData="appList"
                @rightClick="rightClickHandler"
                @select="selectHandler"
                :defaultExpandedKeys="['dir-2']"
              >
                <template slot="dir" slot-scope="item">
                  <img
                    class="tree-icon"
                    :src="
                      item.expanded
                        ? require('@/wizard/assets/img/folder_open.png')
                        : require('@/wizard/assets/img/folder.png')
                    "
                  />
                </template>
                <template slot="app" slot-scope="item">
                  <img
                    class="tree-icon tree-icon-app"
                    :src="
                      item.status === 'Running'
                        ? require('@/wizard/assets/img/app_active.png')
                        : require('@/wizard/assets/img/app.png')
                    "
                  />
                </template>
                <template slot="appTitle" slot-scope="item">
                  <span class="app-title-wrapper" @dblclick="enterApp(item)">
                    <span>{{ item.title }}</span>
                  </span>
                </template>
                <template slot="dirTitle" slot-scope="item">
                  <span class="app-title-wrapper">
                    <span>{{ item.title }}</span>
                  </span>
                </template>
                <template slot="appEdit">
                  <input
                    v-focus
                    class="new-app-edit"
                    type="text"
                    v-model="newAppName"
                    @blur="createAppHandler"
                    @focus="clearTimer"
                  />
                </template>
                <template slot="dirEdit">
                  <input
                    v-focus
                    class="new-app-edit"
                    type="text"
                    v-model="newDirName"
                    @blur="createDirHandler()"
                    @focus="clearTimer"
                  />
                </template>
                <template slot="appEditRename">
                  <input
                    v-focus
                    class="new-app-edit"
                    type="text"
                    v-model="renameAppName"
                    @blur="renameApp"
                    @focus="clearTimer"
                  />
                </template>
                <template slot="dirEditRename">
                  <input
                    v-focus
                    class="new-app-edit"
                    type="text"
                    v-model="renameDirName"
                    @blur="renameDirHandler"
                    @focus="clearTimer"
                  />
                </template>
              </a-tree>
            </template>
          </a-spin>
        </div>
      </div>
      <div class="table-wrap">
        <RunningList :data="runningAppList" @select-app="selectApp"></RunningList>
      </div>
    </div>
    <div class="footer-wrap clearfix">
      <div class="actions">
        <button class="action open" @click="openApp">打开</button>
        <button class="action cancel" @click="cancel">取消</button>
      </div>
    </div>
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
  </div>
</template>

<script>
import RunningList from "./RunningList.vue";

import { interval } from "./utils";
import {
  getApplist,
  getRunningList,
  enterApp,
  createApp,
  renameApp,
  releaseApp,
  deployApp,
  deleteApp,
  renameDir,
  createDir,
  deleteDir,
  close,
} from "./service";
import contextMenu from "vue-context-menu";

export default {
  components: {
    contextMenu,
    RunningList,
  },
  data() {
    return {
      showLoading: false,
      appList: [],
      runningAppList: [],
      refreshInterval: 5000,
      contextItem: null,
      selectItem: null,
      currentItem: null,
      newAppName: "",
      renameAppName: "",
      newDirName: "",
      renameDirName: "",
    };
  },
  mounted() {
    this.fetchApps();
    this.startTimer();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  computed: {
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
              this.enterApp(this.contextItem);
            },
          },
          {
            label: "重命名",
            onclick: () => {
              this.contextItem.dataRef.scopedSlots.title = "appEditRename";
              this.renameAppName = this.contextItem.dataRef.name;
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
        if (this.contextItem.dataRef.id === 2) {
          return [
            {
              label: "重命名",
              onclick: () => {
                this.renameDir();
              },
            },
            {
              label: "新建项目",
              onclick: () => {
                this.createApp(this.contextItem);
              },
            },
            {
              label: "新建文件夹",
              onclick: () => {
                this.createDir(this.contextItem);
              },
            },
          ];
        } else {
          return [
            {
              label: "重命名",
              onclick: () => {
                this.renameDir();
              },
            },
            {
              label: "新建项目",
              onclick: () => {
                this.createApp(this.contextItem);
              },
            },
            {
              label: "新建文件夹",
              onclick: () => {
                this.createDir(this.contextItem);
              },
            },
            {
              label: "删除",
              onclick: () => {
                this.deleteDir();
              },
            },
          ];
        }
      }
    },
  },
  methods: {
    fetchApps(showLoading = true) {
      if (showLoading) {
        this.showLoading = true;
      }
      getApplist().then((res) => {
        if (res.error) {
          console.error(res.error);
        } else {
          if (this.refreshTimer && this.refreshTimer.isPaused()) {
            return;
          }
          this.appList = res.data;
        }
        this.showLoading = false;
      });

      getRunningList().then((res) => {
        if (res.error) {
          console.error(res.error);
        } else {
          this.runningAppList = res.data;
        }
      });
    },
    rightClickHandler({ event, node }) {
      this.contextItem = node;
      if (this.$refs.ctxMenu) {
        this.$refs.ctxMenu.open(event);
      }
    },
    selectHandler(selectedKeys, { selected, node }) {
      if (selected) {
        this.selectItem = node;
      } else {
        this.selectItem = null;
      }
    },
    createApp(item) {
      if (!item || !item.dataRef.folder) {
        return;
      }
      if (!item.expanded) {
        item.onExpand(true);
      }
      this.currentItem = item;
      this.newAppName = "";
      let newItemId = Date.now();
      item.dataRef.children.unshift({
        id: newItemId,
        key: `app-${newItemId}`,
        isLeaf: true,
        scopedSlots: {
          icon: "app",
          title: "appEdit",
        },
      });
    },
    createAppHandler() {
      this.startTimer();
      if (this.newAppName) {
        this.showLoading = true;
        createApp({
          name: this.newAppName,
          dir: this.currentItem.dataRef.id,
        }).then((res) => {
          this.showLoading = false;
          if (res.error) {
            this.showMessage({
              type: "error",
              msg: "创建失败",
            });
          } else {
            this.showMessage({
              type: "success",
              msg: "创建成功",
            });
            this.fetchApps();
          }
        });
      } else {
        this.fetchApps();
      }
    },
    createDir(item) {
      if (!item || !item.dataRef.folder) {
        return;
      }
      this.currentItem = item;
      if (!item.expanded) {
        item.onExpand(true);
      }
      this.newDirName = "";
      let newItemId = Date.now();
      item.dataRef.children.unshift({
        id: newItemId,
        key: `dir-${newItemId}`,
        scopedSlots: {
          icon: "dir",
          title: "dirEdit",
        },
      });
    },
    createDirHandler() {
      this.startTimer();
      if (this.newDirName) {
        this.showLoading = true;
        createDir({
          name: this.newDirName,
          dir: this.currentItem.dataRef.id,
        }).then((res) => {
          if (res.error) {
            this.showLoading = false;
            this.showMessage({
              type: "error",
              msg: "创建失败",
            });
          } else {
            this.showMessage({
              type: "success",
              msg: "创建成功",
            });
            setTimeout(() => {
              this.fetchApps();
            }, 1000);
          }
        });
      } else {
        this.fetchApps();
      }
    },
    renameApp() {
      this.startTimer();
      if (
        this.renameAppName &&
        this.renameAppName != this.contextItem.dataRef.name
      ) {
        this.showLoading = true;
        renameApp({
          name: this.renameAppName,
          id: this.contextItem.dataRef.id,
        }).then((res) => {
          this.showLoading = false;
          if (res.error) {
            this.showMessage({
              type: "error",
              msg: "重命名失败",
            });
          } else {
            this.showMessage({
              type: "success",
              msg: "重命名成功",
            });
            this.fetchApps();
          }
        });
      } else {
        this.fetchApps();
      }
    },
    enterApp(item) {
      enterApp(item.dataRef);
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
            releaseApp(app.id);
          } else {
            deployApp(app.id).then(res => {
              if(res.error) {
                this.$store.dispatch("showMessage", {
                  type: "error",
                  msg: `${res.error.message}`,
                });
              }else {
                this.$store.dispatch("showMessage", {
                  type: "info",
                  msg: "开启中...",
                });
              }
            })
          }
        },
        onCancel() {},
      });
    },
    deleteApp(app) {
      this.$confirm({
        title: `确定删除“${app.name}”这个项目吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.showLoading = true;
          deleteApp(app).then((res) => {
            this.showLoading = false;
            if (res.error) {
              this.showMessage({
                type: "error",
                msg: "删除失败",
              });
            } else {
              this.showMessage({
                type: "success",
                msg: "删除成功",
              });
              this.fetchApps();
            }
          });
        },
        onCancel() {},
      });
    },
    renameDir() {
      this.contextItem.dataRef.scopedSlots.title = "dirEditRename";
      this.renameDirName = this.contextItem.dataRef.title;
    },
    renameDirHandler() {
      this.startTimer();
      if (
        this.renameDirName &&
        this.renameDirName != this.contextItem.dataRef.title
      ) {
        this.showLoading = true;
        renameDir({
          name: this.renameDirName,
          id: this.contextItem.dataRef.id,
        }).then((res) => {
          // this.showLoading = false;
          if (res.error) {
            this.showMessage({
              type: "error",
              msg: "重命名失败",
            });
          } else {
            this.showMessage({
              type: "success",
              msg: "重命名成功",
            });
            setTimeout(() => {
              this.fetchApps();
            }, 1000);
          }
        });
      } else {
        this.fetchApps();
      }
    },
    showMessage(opts) {
      if (typeof opts === "string") {
        opts = {
          message: opts,
        };
      }
      let option = Object.assign(
        {
          type: "error",
          duration: 3,
          msg: "",
        },
        opts
      );
      this.$message[option.type](option.msg, option.duration);
    },
    deleteDir() {
      let dirData = this.contextItem.dataRef;
      this.$confirm({
        title: `确定删除“${dirData.title}”文件夹及其下面的项目和子文件夹吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.showLoading = true;

          // collect dirIds, appIds
          let itemQueue = [];
          itemQueue.push(dirData);
          let dirIds = [],
            appIds = [];
          while (true) {
            let item = itemQueue.shift();
            let key = item.key;
            let keys = key.split("-");
            if (keys[0] === "app") {
              appIds.push(keys[1]);
            } else if (keys[0] === "dir") {
              dirIds.push(keys[1]);
            }
            if (item.children && item.children.length > 0) {
              for (let j = 0; j < item.children.length; j++) {
                itemQueue.push(item.children[j]);
              }
            }
            if (itemQueue.length === 0) {
              break;
            }
          }
          // delete
          deleteDir(dirIds, appIds).then((res) => {
            if (res.error) {
              this.showLoading = false;
              this.showMessage({
                type: "error",
                msg: "删除失败",
              });
            } else {
              this.showMessage({
                type: "success",
                msg: "删除成功",
              });
              setTimeout(() => {
                this.fetchApps();
              }, 1000);
            }
          });
        },
        onCancel() {},
      });
    },
    clearTimer() {
      if (this.refreshTimer) {
        this.refreshTimer.clear();
        this.refreshTimer = null;
      }
    },
    startTimer() {
      if (this.refreshTimer) {
        this.refreshTimer.clear();
      }
      this.refreshTimer = interval(
        () => this.fetchApps(false),
        this.refreshInterval
      );
    },
    openApp() {
      if (this.selectItem && !this.selectItem.dataRef.folder) {
        this.enterApp(this.selectItem);
      }
    },
    cancel() {
      close();
    },
    selectApp(app) {
      enterApp(app);
    }
  },
};
</script>

<style lang="scss">
.ant-tree li {
  padding: 0;
}
.ant-tree-child-tree > li:first-child {
  padding: 0;
}
.ant-tree li .ant-tree-node-content-wrapper {
  padding: 0;
}
.ctx-menu {
  padding: 0;
  background: #fff;
  border: 1px solid rgba(112, 112, 112, 0.3);
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  .wizard-menu-item {
    line-height: 32px;
    padding: 0 16px;
    cursor: pointer;
    min-width: 120px;
    &:hover {
      background: #b8dcfd;
    }
  }
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 8px 16px;
}
.ant-table-thead > tr > th {
  background: #ebf4fd;
}
.ant-tree li .ant-tree-node-content-wrapper:hover,
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  background: #b8dcfd;
}
</style>

<style lang="scss">
*,
*::after,
*::before {
  box-sizing: border-box;
  user-select: none;
  -webkit-user-drag: none;
  cursor: auto !important;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.app-wrap {
  width: 100%;
  height: 100vh;
  background: #f5faff;
  .container {
    height: calc(100vh - 65px);
    padding: 16px 10px 0 10px;
    .tree-wrap {
      float: left;
      height: 100%;
      width: calc(25% - 10px);
      margin-right: 10px;
      border: 1px solid rgba(91, 91, 91, 0.5);
      .tree-actions {
        height: 30px;
        border-bottom: 1px solid rgba(91, 91, 91, 0.5);
        background: #ebf4fd;
        display: flex;
        align-items: center;
        padding-right: 8px;
        img {
          height: 15px;
          margin-left: 8px;
        }
        .spacing {
          flex: 10;
        }
      }
      .tree-list {
        height: calc(100% - 30px);
        background: #fff;
        overflow: auto;
      }
    }
    .table-wrap {
      float: left;
      height: 100%;
      width: 75%;
      border: 1px solid rgba(91, 91, 91, 0.5);
      background: #fff;
      overflow: auto;
    }
  }
}
.wizard-menu-item {
  line-height: 28px;
  padding: 0 12px;
  &:hover {
    background: #ddd;
  }
  &.disabled {
    cursor: not-allowed;
  }
}
.new-app-edit {
  height: 22px;
  padding: 0;
  border: 0;
  padding-left: 4px;
  outline: 0;
  width: calc(100% - 20px);
  &:focus {
    border: 1px solid #1890ff;
  }
}
.footer-wrap {
  margin: 20px 10px;
  .actions {
    float: right;
    .action {
      border: 1px solid rgba(69, 112, 253, 0.3);
      background: #d2e2f1;
      border-radius: 3px;
      padding: 0 16px;
      margin-left: 16px;
      color: #1f1f1f;
      outline: 0;
      &:hover {
        background: #cbdbef;
      }
    }
  }
}
.tree-list {
  .tree-icon {
    height: 16px;
    margin-bottom: 5px;
  }
  .tree-icon-app {
    height: 14px;
    margin-bottom: 4px;
  }
}
</style>
