<template>
  <div v-if="$store.state.view.coverVisible" class="rto_custom rto_cover" :style="{ top: $store.state.view.toolbarVisible ? '115px' : '75px'}"></div>
</template>

<script>
export default {
  name: "cover",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss">
.rto_cover {
  position: absolute;
  z-index: 999;
  box-sizing: border-box;
  background: #F5FAFF;
  width: 100vw;
  left: 0;
  top: 115px;
  height: 100vh;
}
</style>
<style lang="scss" scoped>
</style>
