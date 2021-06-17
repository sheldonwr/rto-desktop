<template>
  <div class="toolbar">
    <div class="toolbar-list">
      <div
        class="toolbar-icon"
        title="项目列表"
        @click="clickHandler('view-app')"
        @mouseover="mouseoverHandler('view-app')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/list.png')" />
        <span>项目列表</span>
      </div>
      <div
        class="toolbar-icon"
        title="新建"
        @click="clickHandler('file-new')"
        @mouseover="mouseoverHandler('file-new')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/new.png')" />
        <span>新建</span>
      </div>
      <div
        class="toolbar-icon"
        title="打开"
        @click="clickHandler('file-open')"
        @mouseover="mouseoverHandler('file-open')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/open.png')" />
        <span>打开</span>
      </div>
      <div
        class="toolbar-icon"
        title="保存"
        @click="clickHandler('file-save')"
        @mouseover="mouseoverHandler('file-save')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/save.png')" />
        <span>保存</span>
      </div>
      <div
        class="toolbar-icon"
        title="另存为"
        @click="clickHandler('file-saveAs')"
        @mouseover="mouseoverHandler('file-saveAs')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/saveas.png')" />
        <span>另存为</span>
      </div>
      <div
        class="toolbar-icon"
        title="剪切"
        @click="clickHandler('edit-cut')"
        @mouseover="mouseoverHandler('edit-cut')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/cut.png')" />
        <span>剪切</span>
      </div>
      <div
        class="toolbar-icon"
        title="复制"
        @click="clickHandler('edit-copy')"
        @mouseover="mouseoverHandler('edit-copy')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/copy.png')" />
        <span>复制</span>
      </div>
      <!-- <div
        class="toolbar-icon"
        title="设置"
        @mouseover="mouseoverHandler('view-setting')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-shezhi"></span>
      </div> -->
      <div
        class="toolbar-icon"
        title="日志"
        @click="clickHandler('view-alarm')"
        @mouseover="mouseoverHandler('view-alarm')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/log.png')" />
        <span>日志</span>
      </div>
      <div
        class="toolbar-icon"
        title="帮助"
        @click="clickHandler('view-help')"
        @mouseover="mouseoverHandler('view-help')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/help.png')" />
        <span>帮助</span>
      </div>
      <div
        class="toolbar-icon"
        title="关于"
        @click="clickHandler('view-about')"
        @mouseover="mouseoverHandler('view-about')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/about.png')" />
        <span>关于</span>
      </div>
      <div
        class="toolbar-icon"
        title="刷新"
        @click="clickHandler('view-refresh')"
        @mouseover="mouseoverHandler('view-refresh')"
        @mouseout="mouseoutHandler"
      >
        <img :src="require('assets/img/toolbar/refresh.png')" />
        <span>刷新</span>
      </div>
      <div class="separator"></div>
      <div
        v-if="isComponentEdit"
        class="toolbar-icon deploy-running"
        title="完成"
        @click="clickHandler('component-success')"
        @mouseover="mouseoverHandler('component-success')"
        @mouseout="mouseoutHandler"
      >
        <span
          :class="['rto_iconfont', 'icon-check']"
          style="font-size: 20px"
        ></span>
        <span>完成</span>
      </div>
      <div
        v-else
        class="toolbar-icon"
        :class="[
          isReadonly
            ? 'deploy-readonly'
            : isRunning
            ? 'deploy-stop'
            : 'deploy-running',
        ]"
        :title="isReadonly ? '编辑' : isRunning ? '停止' : '开启'"
        @click="clickHandler('deploy')"
        @mouseover="mouseoverHandler('deploy')"
        @mouseout="mouseoutHandler"
      >
        <span
          :class="[
            'rto_iconfont',
            isReadonly ? 'icon-edit' : isRunning ? 'icon-stop' : 'icon-start',
          ]"
          style="font-size: 20px"
        ></span>
        <span v-if="isReadonly">编辑</span>
        <span v-else-if="isRunning">停止</span>
        <span v-else>开启</span>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "utils/bus";

export default {
  data() {
    return {
      isRunning: false,
      isComponentEdit: false,
    };
  },
  created() {
    bus.on("transition-component", this.componentTransition);
    bus.on("transition-predict", this.predictTransition);
    bus.on("file-terminate", this.fileTerminate);
  },
  beforeDestroy() {},
  computed: {
    isReadonly: {
      get() {
        return this.$store.state.appReadonly;
      },
      set(val) {
        this.$store.commit("appReadonly", val);
      },
    },
  },
  methods: {
    clickHandler(id) {
      if (id === "file-new") {
        this.$store.commit("view/createAppDialog", true);
      } else if (id === "file-open") {
        this.$store.dispatch("file/open").catch((err) => {
          console.error(err);
        });
      } else if (id === "file-save") {
        this.$store.dispatch("file/save");
      } else if (id === "file-saveAs") {
        this.$store.dispatch("file/saveAs");
      } else if (id === "deploy") {
        this.fileTerminate();
      } else if (id === "edit-cut") {
        this.$store.dispatch("edit/cutNode");
      } else if (id === "edit-copy") {
        this.$store.dispatch("edit/copyNode");
      } else if (id === "view-alarm") {
        this.$store.commit(
          "view/logPanelVisible",
          !this.$store.state.view.logPanelVisible
        );
      } else if (id === "view-help") {
        // window.open("https://xuelangyun.yuque.com/suanpan_doc/public");
        this.$store.commit('view/helpVisible', true)
      } else if (id === "view-about") {
        this.$store.commit("view/aboutVisible", true);
      } else if (id === "view-app") {
        this.$store.commit("view/logPanelVisible", false);
        this.$store.commit("view/wizardVisible", true);
      } else if (id === "component-success") {
        this.$store.dispatch("file/gotoCurrentPredict");
        this.isComponentEdit = false;
      } else if (id === "view-refresh") {
        this.refresh();
      }
    },
    refresh() {
      this.$store.dispatch("file/gotoCurrentPredict");
      this.isRunning = this.$store.getters["status/isRunning"];
      this.isReadonly = false;
      this.isComponentEdit = false;
      this.lastAppId = null;
    },
    mouseoverHandler(id) {
      let title = "";
      if (id === "file-new") {
        title = "新建";
      } else if (id === "file-open") {
        title = "打开";
      } else if (id === "file-save") {
        title = "保存";
      } else if (id === "file-saveAs") {
        title = "另存为";
      } else if (id === "edit-cut") {
        title = "剪切";
      } else if (id === "edit-copy") {
        title = "复制";
      } else if (id === "view-setting") {
        title = "设置";
      } else if (id === "view-alarm") {
        title = "日志";
      } else if (id === "view-help") {
        title = "帮助";
      } else if (id === "view-about") {
        title = "关于";
      } else if (id === "deploy") {
        title = this.isReadonly ? "编辑" : this.isRunning ? "停止" : "开启";
      } else if (id === "view-app") {
        title = "项目列表";
      } else if (id === "component-success") {
        title = "组件完成";
      } else if (id === "view-refresh") {
        title = "刷新";
      }
      this.$store.commit("statustooltip/status", title);
    },
    mouseoutHandler() {
      this.$store.commit("statustooltip/status", "");
    },
    componentTransition() {
      this.isComponentEdit = true;
    },
    predictTransition(appId) {
      this.isComponentEdit = false;
      if (this.lastAppId == appId) {
        return;
      }
      this.$store
        .dispatch("status/getStatus", appId)
        .then((appStatus) => {
          this.isRunning = this.$store.getters["status/isRunning"];
        })
        .catch((err) => {
          console.error(err);
        });
      this.lastAppId = appId;
    },
    fileTerminate() {
      if (this.isReadonly) {
        this.refresh();
      } else {
        let title = this.isRunning ? "确定停止该项目？" : "确定开启该项目？";
        this.$confirm({
          title: title,
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            let deployBtn = document.querySelector(
              ".sp-app-actions .footer-item"
            );
            deployBtn.click();
            this.isRunning = !this.isRunning;
          },
          onCancel() {},
        });
      }
    },
  },
};
</script>

<style lang="scss">
.deploy-stop {
  color: #f5222d !important;
}
.deploy-running {
  color: #52c41a !important;
}
.deploy-readonly {
  color: rgb(0, 132, 255) !important;
}
</style>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  background: var(--e-tool-bar-bg);
  border-top: solid 1px var(--e-tool-bar-border-color);
  border-bottom: solid 1px var(--e-tool-bar-border-color);
  // padding-left: 6px;
  .toolbar-list {
    height: 100%;
    display: flex;
  }
  .toolbar-icon {
    padding: 0 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: var(--e-tool-bar-color);
    &:hover {
      background-color: var(--e-tool-bar-item-hover-color);
      border-radius: 2px;
    }
    > img {
      height: 18px;
      margin-right: 5px;
    }
    .rto_iconfont {
      margin-right: 5px;
    }
  }
  .separator {
    width: 1px;
    background: rgba(220, 220, 220, 0.6);
    height: 100%;
    margin: 0 1px;
  }
}
</style>
