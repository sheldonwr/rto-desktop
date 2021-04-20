<template>
  <div class="rto_custom rto_header">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar v-show="$store.state.view.toolbarVisible"></tool-bar>
    <drawer></drawer>
    <wizard v-if="$store.state.view.wizardVisible"></wizard>
    <AppCreateForm
      v-if="createAppDialog"
      v-model="createAppDialog"
    ></AppCreateForm>
    <DirCreateForm
      v-if="createDirDialog"
      v-model="createDirDialog"
    ></DirCreateForm>
    <AboutDialog v-if="aboutVisible" v-model="aboutVisible"></AboutDialog>
    <LogView v-show="$store.state.view.logPanelVisible"></LogView>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";
import ToolBar from "components/Toolbar";
import Drawer from "components/Drawer";
import Wizard from "components/Wizard";
import AppCreateForm from "components/AppCreateForm";
import DirCreateForm from "components/DirCreateForm";
import AboutDialog from "components/AboutDialog";
import LogView from "components/LogView";

export default {
  name: "App",
  components: {
    TopHeader,
    MenuView,
    ToolBar,
    Drawer,
    Wizard,
    AppCreateForm,
    DirCreateForm,
    AboutDialog,
    LogView,
  },
  mounted() {
    this.updateAppHeight();
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
    createDirDialog: {
      get() {
        return this.$store.state.view.createDirDialog;
      },
      set(val) {
        this.$store.commit("view/createDirDialog", val);
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
      // console.log("++++", event)
      if (event.keyCode === 118) {
        // 'F7'
        if (
          this.$store.state.view.wizardVisible &&
          this.$store.state.view.wizardClosable
        ) {
          this.$store.commit("view/wizardVisible", false);
        } else if (!this.$store.state.view.wizardVisible) {
          this.$store.commit("view/logPanelVisible", false);
          this.$store.commit("view/wizardVisible", true);
        }
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
