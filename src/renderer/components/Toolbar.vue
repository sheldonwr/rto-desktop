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
        <span class="rto_iconfont icon-project-list"></span>
      </div>
      <div class="separator"></div>
      <div
        class="toolbar-icon"
        title="新建"
        @click="clickHandler('file-new')"
        @mouseover="mouseoverHandler('file-new')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-xinjian"></span>
      </div>
      <div
        class="toolbar-icon"
        title="打开"
        @click="clickHandler('file-open')"
        @mouseover="mouseoverHandler('file-open')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-dakai"></span>
      </div>
      <div
        class="toolbar-icon"
        title="保存"
        @click="clickHandler('file-save')"
        @mouseover="mouseoverHandler('file-save')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-baocun"></span>
      </div>
      <div
        class="toolbar-icon"
        title="另存为"
        @click="clickHandler('file-saveAs')"
        @mouseover="mouseoverHandler('file-saveAs')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-lingcunwei"></span>
      </div>
      <div class="separator"></div>
      <div
        class="toolbar-icon"
        title="剪切"
        @click="clickHandler('edit-cut')"
        @mouseover="mouseoverHandler('edit-cut')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-jianqie"></span>
      </div>
      <div
        class="toolbar-icon"
        title="复制"
        @click="clickHandler('edit-copy')"
        @mouseover="mouseoverHandler('edit-copy')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-fuzhi"></span>
      </div>
      <div class="separator"></div>
      <div
        class="toolbar-icon"
        title="设置"
        @mouseover="mouseoverHandler('view-setting')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-shezhi"></span>
      </div>
      <div
        class="toolbar-icon"
        title="日志"
        @click="clickHandler('view-alarm')"
        @mouseover="mouseoverHandler('view-alarm')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-rizhi"></span>
      </div>
      <div class="separator"></div>
      <div
        class="toolbar-icon"
        title="帮助"
        @click="clickHandler('view-help')"
        @mouseover="mouseoverHandler('view-help')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-bangzhu"></span>
      </div>
      <div
        class="toolbar-icon"
        title="关于"
        @click="clickHandler('view-about')"
        @mouseover="mouseoverHandler('view-about')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-about"></span>
      </div>
      <div class="separator"></div>
      <div
        class="toolbar-icon"
        title="刷新"
        @click="clickHandler('view-refresh')"
        @mouseover="mouseoverHandler('view-refresh')"
        @mouseout="mouseoutHandler"
      >
        <span class="rto_iconfont icon-refresh"></span>
      </div>
    </div>
    <div class="deploy-container">
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
          style="font-size: 22px"
        ></span>
      </div>
      <div
        v-else
        class="toolbar-icon"
        :class="[isRunning ? 'deploy-stop' : 'deploy-running']"
        :title="isRunning ? '停止' : '开启'"
        @click="clickHandler('deploy')"
        @mouseover="mouseoverHandler('deploy')"
        @mouseout="mouseoutHandler"
      >
        <span
          :class="['rto_iconfont', isRunning ? 'icon-stop' : 'icon-start']"
          style="font-size: 22px"
        ></span>
      </div>
    </div>
    <div class="placeholder"></div>
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
  watch: {
    "$store.state.file.currentApp": {
      handler(app) {
        if(app.id) {
          this.$store.dispatch('status/getStatus').then( () => {
            this.isRunning = this.$store.getters["status/isRunning"];
            this.$store.dispatch('status/getStatus').then( () => {
              this.isRunning = this.$store.getters["status/isRunning"];
            })
          })
        }
      },
    },
  },
  created() {
    bus.on("transition-component", this.componentTransition);
    bus.on("transition-predict", this.predictTransition);
  },
  beforeDestroy() {
    bus.off("transition-component");
    bus.off("transition-predict");
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
      } else if (id === "edit-cut") {
        this.$store.dispatch("edit/cutNode");
      } else if (id === "edit-copy") {
        this.$store.dispatch("edit/copyNode");
      } else if (id === "view-alarm") {
        this.$store.commit(
          "view/logPanelVisible",
          !this.$store.state.view.logPanelVisible
        );
      }else if(id === 'view-help') {
        window.open('https://xuelangyun.yuque.com/suanpan_doc/public');
      }else if(id === 'view-about') {
        this.$store.commit('view/aboutVisible', true)
      }else if(id === 'view-app') {
        this.$store.commit("view/logPanelVisible", false);
        this.$store.commit("view/wizardVisible", true);
      }else if(id === 'component-success') {
        this.$store.dispatch("file/gotoCurrentPredict");
      }else if(id === 'view-refresh') {
        this.$store.dispatch("file/gotoCurrentPredict");
        this.isRunning = this.$store.getters["status/isRunning"];
      }
    },
    mouseoverHandler(id) {
      let title = ''
      if(id === 'file-new') {
        title = '新建'
      }else if(id === 'file-open') {
        title = '打开'
      }else if(id === 'file-save') {
        title = '保存'
      }else if(id === 'file-saveAs') {
        title = '另存为'
      }else if(id === 'edit-cut') {
        title = '剪切'
      }else if(id === 'edit-copy') {
        title = '复制'
      }else if(id === 'view-setting') {
        title = '设置'
      }else if(id === 'view-alarm') {
        title = '日志'
      }else if(id === 'view-help') {
        title = '帮助'
      }else if(id === 'view-about') {
        title = '关于'
      }else if(id === 'deploy') {
        title = this.isRunning ? '停止' : '开启'
      }else if(id === 'view-app') {
        title = '项目列表'
      }else if(id === 'component-success') {
        title = '组件完成'
      }else if(id === 'view-refresh') {
        title = '刷新'
      }
      this.$store.commit('statustooltip/status', title)
    },
    mouseoutHandler() {
      this.$store.commit('statustooltip/status', '')
    },
    componentTransition() {
      this.isComponentEdit = true;
    },
    predictTransition() {
      this.isComponentEdit = false;
    }
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
</style>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f7fb;
  border: solid 1px #dcdcdc;
  padding-left: 6px;
  .toolbar-list {
    display: flex;
    align-items: center;
    height: 100%;
    width: 480px;
  }
  .toolbar-icon {
    padding: 4px 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(210, 210, 210, 0.6);
      border-radius: 2px;
    }
    .rto_iconfont {
      font-size: 18px;
    }
  }
  .separator {
    width: 1px;
    background: rgba(220, 220, 220, 0.6);
    height: 100%;
    margin: 0 1px;
  }
  .placeholder {
    width: 480px;
  }
}
</style>
