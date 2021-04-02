<template>
  <div class="rto_custom rto_header">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar v-show="$store.state.view.toolbarVisible"></tool-bar>
    <drawer></drawer>
    <wizard v-if="$store.state.view.wizardVisible"></wizard>
    <AppCreateForm v-if="createAppDialog" v-model="createAppDialog"></AppCreateForm>
    <DirCreateForm v-if="createDirDialog" v-model="createDirDialog"></DirCreateForm>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";
import ToolBar from "components/Toolbar";
import Drawer from "components/Drawer";
import Wizard from "components/Wizard";
import AppCreateForm from "components/AppCreateForm"
import DirCreateForm from "components/DirCreateForm"

export default {
  name: 'App',
  components: {
    TopHeader,
    MenuView,
    ToolBar,
    Drawer,
    Wizard,
    AppCreateForm,
    DirCreateForm
  },
  mounted() {
    this.updateAppHeight();
    window.addEventListener('resize', () => {
      this.$store.dispatch('window/getMaximizedState');
    });
    // global keycuts
    window.addEventListener('keydown', this.keycutsHandler);
  },
  created() {
  },
  computed: {
    createAppDialog: {
      get() {
        return this.$store.state.view.createAppDialog;
      },
      set(val) {
        this.$store.commit('view/createAppDialog', val);
      }
    },
    createDirDialog: {
      get() {
        return this.$store.state.view.createDirDialog;
      },
      set(val) {
        this.$store.commit('view/createDirDialog', val);
      }
    }
  },
  watch: {
    "$store.state.view.toolbarVisible" : {
      handler() {
        this.updateAppHeight();
      },
      immediate: true
    },
    "$store.state.view.logPanelVisible" : {
      handler() {
        this.updateAppHeight();
      },
      immediate: true
    },
  },
  methods: {
    updateAppHeight() {
      let appH = '';
      let rightPanelH = 'calc(100vh - (50px + 38px + 60px))';
      if(this.$store.state.view.toolbarVisible && this.$store.state.view.logPanelVisible) {
        appH = 'calc(100% - 115px - 280px)';
        rightPanelH = 'calc(100vh - (50px + 38px + 60px + 280px))';
      }else if(this.$store.state.view.toolbarVisible) {
        appH = 'calc(100% - 115px)';
        rightPanelH = 'calc(100vh - (50px + 38px + 60px))';
      }else if(this.$store.state.view.logPanelVisible) {
        appH = 'calc(100% - 115px + 40px - 280px)';
        rightPanelH = 'calc(100vh - (50px + 38px + 60px - 40px + 280px))';
      }else {
        appH = 'calc(100% - 115px + 40px)';
        rightPanelH = 'calc(100vh - (50px + 38px + 60px - 40px))';
      }
      document.getElementById('app').style.height = appH;
      let rightPabelEl = document.querySelector('.tab-pane.ng-scope');
      if(rightPabelEl) {
        rightPabelEl.style.height = rightPanelH;
      }
    },
    keycutsHandler(event) {
      if(event.keyCode === 118) {
        // 'F7'
        if(this.$store.state.view.wizardVisible && this.$store.state.view.wizardClosable) {
          this.$store.commit("view/wizardVisible", false);
        }else if(!this.$store.state.view.wizardVisible) {
          this.$store.commit("view/logPanelVisible", false);
          this.$store.commit("view/wizardVisible", true);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
