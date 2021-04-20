<template>
  <div class="resize-content" :style="{ height: `${height}px` }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    resizeHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      height: this.resizeHeight
    }
  },
  watch: {
    resizeHeight() {
      this.height = this.resizeHeight;
    },
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>