<template>
  <div class="rto_custom rto_status">
    <span class="status-title">{{ $store.state.statustooltip.status }}</span>
  </div>
</template>

<script>
export default {
  name: "status",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss">
.rto_status {
  position: relative;
  z-index: 9999;
  height: 24px;
  box-sizing: border-box;
  padding: 0 12px;
  font-size: 12px;
  border-top: 1px solid #acacac;
  line-height: 22px;
  width: 100vw;
  .status-title {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss" scoped>
</style>
