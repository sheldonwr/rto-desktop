<template>
  <div class="rto_custom rto_header">
    <top-header></top-header>
    <menu-view></menu-view>
    <tool-bar></tool-bar>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";
import ToolBar from "components/Toolbar";

export default {
  components: {
    TopHeader,
    MenuView,
    ToolBar
  },
  name: 'App',
  mounted() {
    window.addEventListener('resize', () => {
      this.$store.dispatch('window/getMaximizedState');
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
