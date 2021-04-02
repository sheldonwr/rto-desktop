<template>
  <div class="resize-content" :style="{ height: `${height}px` }">
    <slot></slot>
    <div class="resize-bar" @mousedown.stop="resizeMousedown"></div>
  </div>
</template>

<script>
export default {
  props: {
    defaultHeight: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      height: this.defaultHeight
    }
  },
  methods: {
    resizeMousedown(e) {
      e.preventDefault();
      this.startDrag = true;
      this.dragPre = e.clientY;
      this.orgHeight = this.height;
      document.addEventListener("mousemove", this.resizeMove);
      document.addEventListener("mouseup", this.resizeMouseUp);
    },
    resizeMove(e) {
      if (!this.startDrag) {
        return;
      }
      e.preventDefault();
      let diff = e.clientY - this.dragPre;
      let maxHeight = window.innerHeight * 0.5;
      this.height = Math.min(
        maxHeight,
        Math.max(this.defaultHeight, this.orgHeight + diff)
      );
    },
    resizeMouseUp(e) {
      if (!this.startDrag) {
        return;
      }
      this.startDrag = false;
      document.removeEventListener("mousemove", this.resizeMove);
      document.removeEventListener("mouseup", this.resizeMouseUp);
    },
  }
}
</script>

<style lang="scss" scoped>
.resize-content {
  position: relative;
  .resize-bar {
    position: absolute;
    left: 0;
    top: -5px;
    right: 0;
    height: 8px;
    background: transparent;
    cursor: ns-resize;
    &:hover {
      background-color: rgba(0,132,255,.16);
    }
  }
}
</style>