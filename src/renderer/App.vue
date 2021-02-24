<template>
  <div id="app">
    <top-header></top-header>
    <menu-view></menu-view>
  </div>
</template>

<script>
import TopHeader from "components/Header";
import MenuView from "components/Menu/index";

export default {
  components: {
    TopHeader,
    MenuView
  },
  name: 'App',
  mounted() {
    window.addEventListener('resize', () => {
      this.$store.dispatch('window/getMaximizedState');
    });
  }
}
</script>

<style lang="scss">
</style>
