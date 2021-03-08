<template>
  <div class="rto_custom rto_header">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar v-if="$store.state.view.toolbarVisible"></tool-bar>
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
  watch: {
    "$store.state.view.toolbarVisible" : {
      handler() {
        this.updateAppHeight();
      }
    },
    "$store.state.view.logPanelVisible" : {
      handler() {
        this.updateAppHeight();
      }
    },
  },
  methods: {
    updateAppHeight() {
      let h = '';
      if(this.$store.state.view.toolbarVisible && this.$store.state.view.logPanelVisible) {
        h = 'calc(100% - 115px - 280px)';
      }else if(this.$store.state.view.toolbarVisible) {
        h = 'calc(100% - 115px)';
      }else if(this.$store.state.view.logPanelVisible) {
        h = 'calc(100% - 115px + 40px - 280px)';
      }else {
        h = 'calc(100% - 115px + 40px)';
      }
      return document.getElementById('app').style.height = h;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
