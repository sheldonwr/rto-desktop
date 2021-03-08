<template>
  <div v-if="$store.state.view.logPanelVisible" class="rto_custom rto_log">
    <ul class="log-head-wrap"></ul>
    <ul class="log-content-wrap">
      <li>xxxx</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'log',
}
</script>

<style lang="scss" scoped>
.rto_log {
  background: gray;
}
.log-head-wrap {
  height: 38px;
}
.log-content-wrap {
  height: 242px;
}
</style>