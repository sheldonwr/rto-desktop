<template>
  <div class="rto_custom rto_header">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar v-show="$store.state.view.toolbarVisible"></tool-bar>
    <drawer></drawer>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";
import ToolBar from "components/Toolbar";
import Drawer from "components/Drawer";

export default {
  name: 'App',
  components: {
    TopHeader,
    MenuView,
    ToolBar,
    Drawer
  },
  mounted() {
    this.updateAppHeight();
    window.addEventListener('resize', () => {
      this.$store.dispatch('window/getMaximizedState');
    });
  },
  created() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
