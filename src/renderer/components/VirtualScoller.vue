<template>
  <div ref="container" class="sp-virtual-container" @scroll="scrollHandler">
     <div 
        class="sp-virtual-phantom"
        :style="{ height: data.length * itemHeight + 'px' }"
        >
      </div>
      <div ref="content" class="sp-virtual-content">
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualScoller',
  props: {
    itemHeight: {
      type: Number,
      default: 28,
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    updateFlag:{
      required: true
    }
  },
  data() {
    return {}
  },
  watch: {
    updateFlag() {
      this.updateVisibleData()
    }
  },
  mounted() {
    this.updateVisibleData()

    this.resizeObserver = new ResizeObserver(entries => {
      if(!this.$refs.container) {
        return
      }
      this.updateVisibleData();
    });
    this.resizeObserver.observe(this.$refs.container);
  },
  beforeDestroy() {
    this.resizeObserver.disconnect()
  },
  methods: {
    scrollHandler() {
      this.updateVisibleData()
    },
    updateVisibleData() {
      if(!this.$refs.container) {
        return
      }
      let scrollTop = this.$refs.container.scrollTop;
      const visibleCount = Math.ceil(this.$refs.container.clientHeight / this.itemHeight);
      const start = Math.floor(scrollTop / this.itemHeight);
      console.log(scrollTop, start)
      const end = start + visibleCount + 1;
      this.$refs.content.style.webkitTransform = `translate3d(0, ${ start * this.itemHeight }px, 0)`;
      this.$emit('update', start, end)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>