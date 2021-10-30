<template>
  <div class="rto_custom rto_header" :class="[$store.state.theme]">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar v-show="$store.state.view.toolbarVisible"></tool-bar>
    <drawer></drawer>
    <AppCreateForm
      v-if="createAppDialog"
      v-model="createAppDialog"
    ></AppCreateForm>
    <AboutDialog v-if="aboutVisible" v-model="aboutVisible"></AboutDialog>
    <HelpDialog v-if="helpVisible" v-model="helpVisible"></HelpDialog>
    <SettingDialog v-show="settingVisible" v-model="settingVisible"></SettingDialog>
    <LogView v-show="$store.state.view.logPanelVisible"></LogView>
    <FrontendDialog v-model="frontendVisible"></FrontendDialog>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";
import ToolBar from "components/Toolbar";
import Drawer from "components/Drawer";
import AppCreateForm from "components/AppCreateForm";
import AboutDialog from "components/AboutDialog";
import HelpDialog from "components/HelpDialog";
import SettingDialog from "components/SettingDialog";
import LogView from "components/LogView";
import FrontendDialog from "components/FrontendDialog";

export default {
  name: "App",
  components: {
    TopHeader,
    MenuView,
    ToolBar,
    Drawer,
    AppCreateForm,
    AboutDialog,
    HelpDialog,
    LogView,
    SettingDialog,
    FrontendDialog
  },
  mounted() {
    this.updateAppHeight();
    this.$store.dispatch("window/getMaximizedState");
    window.addEventListener("resize", () => {
      this.$store.dispatch("window/getMaximizedState");
    });
    // global keycuts
    window.addEventListener("keydown", this.keycutsHandler);
  },
  computed: {
    createAppDialog: {
      get() {
        return this.$store.state.view.createAppDialog;
      },
      set(val) {
        this.$store.commit("view/createAppDialog", val);
      },
    },
    aboutVisible: {
      get() {
        return this.$store.state.view.aboutVisible;
      },
      set(val) {
        this.$store.commit("view/aboutVisible", val);
      },
    },
    helpVisible:{
       get() {
        return this.$store.state.view.helpVisible;
      },
      set(val) {
        this.$store.commit("view/helpVisible", val);
      },
    },
    settingVisible: {
      get() {
        return this.$store.state.setting.settingVisible;
      },
      set(val) {
        this.$store.commit("setting/settingVisible", val);
      },
    },
    frontendVisible: {
      get() {
        return this.$store.state.view.frontendVisible;
      },
      set(val) {
        this.$store.commit("view/frontendVisible", val);
      },
    },
  },
  watch: {
    "$store.state.view.toolbarVisible": {
      handler() {
        this.updateAppHeight();
      },
      immediate: true,
    },
    "$store.state.view.statusVisible": {
      handler() {
        this.updateAppHeight();
      },
      immediate: true,
    },
    "$store.state.edit.selectedNode": {
      handler(val) {
        if (val && this.$store.state.view.logPanelVisible) {
          setTimeout(() => {
            this.updateAppHeight();
          }, 0);
        }
      },
    },
  },
  methods: {
    updateAppHeight(diff = 0) {
      let appDiffH = 75 + diff;
      let rightPanelDiffH = 108 + diff;
      if (this.$store.state.view.toolbarVisible) {
        appDiffH += 40;
        rightPanelDiffH += 40;
      }
      if (this.$store.state.view.statusVisible) {
        appDiffH += 24;
        rightPanelDiffH += 24;
      }
      document.getElementById(
        "app"
      ).style.height = `calc(100% - ${appDiffH}px)`;
      let rightPabelEl = document.querySelector(".tab-pane.ng-scope");
      if (rightPabelEl) {
        rightPabelEl.style.height = `calc(100vh - 6px - ${rightPanelDiffH}px)`;
      }
    },
    keycutsHandler(event) {
      let targetTag = '';
      if(event.target) {
        targetTag = event.target.tagName.toLowerCase();
      }
      if(targetTag == 'input' || targetTag == 'textarea') {
        return;
      }
      if (event.keyCode === 118) {
        // 'F7'
        this.$store.dispatch('window/createWizardWindow');
      }else if(event.keyCode === 121) {
        // f10
        // window.open('https://xuelangyun.yuque.com/suanpan_doc/public');
        this.$store.commit('view/helpVisible', true)
      }else if(event.keyCode === 115) {
        // f4
        this.$store.commit(
          "view/statusVisible",
          !this.$store.state.view.statusVisible
        );
      }else if(event.keyCode === 114) {
        // f3
        this.$store.commit(
          "view/toolbarVisible",
          !this.$store.state.view.toolbarVisible
        );
      }else if(event.keyCode === 112) {
        // f1
        if(this.$store.state.view.paramVisible) {
          this.$store.dispatch("view/closeSettingPannel")
        }else {
          let nodeId = null;
          if(this.$store.state.edit.selectedNode) {
            nodeId = this.$store.state.edit.selectedNode.id;
          }
          this.$store.dispatch("view/showSettingPannel", nodeId);
        }
      }else if(event.keyCode === 116) {
        this.$store.dispatch("file/gotoCurrentPredict");
      }else if (event.keyCode === 192 && event.ctrlKey) {
        // 'ctrl+`'
        this.$store.commit(
          "view/logPanelVisible",
          !this.$store.state.view.logPanelVisible
        );
      }else if(event.ctrlKey && (event.keyCode === 88)) {
        // 'ctrl+x'
        this.$store.dispatch("edit/cutNode");
      }else if(event.ctrlKey && (event.keyCode === 67)) {
        // 'ctrl+c'
        this.$store.dispatch("edit/copyNode");
      }else if(event.ctrlKey && (event.keyCode === 86)) {
        // 'ctrl+v'
        this.$store.dispatch("edit/pasteNode");
      }else if(event.ctrlKey && (event.keyCode === 78)) {
        // 'ctrl+n'
        this.$store.commit('view/createAppDialog', true);
      }else if(event.ctrlKey && (event.keyCode === 79)) {
        // 'ctrl+o'
        this.$store.dispatch("file/open");
      }else if(event.ctrlKey && !event.shiftKey && (event.keyCode === 83)) {
        // 'ctrl+s'
        this.$store.dispatch("file/save");
      }else if(event.ctrlKey && event.shiftKey && (event.keyCode === 83)) {
        // 'ctrl+shift+s'
        this.$store.dispatch("file/saveAs");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
