<template>
  <ul class="drop-menu">
    <li
      :class="['drop-menu-item', { 'disabled' : dropItem.disabled }]"
      v-for="dropItem in datas"
      :key="dropItem.value"
      @mouseenter="menuMouseenterHandler(dropItem)"
      @click.stop="menuClickHandler(dropItem)"
    >
      <span class="check-wrap">
        <span v-if="dropItem.checkable && dropItem.checked" class="rto_iconfont icon-check"></span>
      </span>
      <span>{{ dropItem.label }}</span>
      <drop-menu
        v-if="openedItem === dropItem.value"
        class="menu-right"
        :datas="dropItem.items"
      ></drop-menu>
    </li>
  </ul>
</template>

<script>
import { findComponentUpward } from 'utils'

export default {
  name: "drop-menu",
  props: {
    datas: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      openedItem: "",
    };
  },
  mounted() {
    this.menuInst = findComponentUpward(this, 'app-menu');
  },
  methods: {
    menuMouseenterHandler(dropItem) {
      this.openedItem = dropItem.value;
    },
    menuClickHandler(dropItem) {
      if(dropItem.disabled) {
        return;
      }
      this.menuInst.menuItemClicked(dropItem);
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-menu {
  width: 150px;
  padding: 0;
  background: #fff;
  border-radius: 2px;
  .drop-menu-item {
    padding: 5px 0 7px 28px;
    position: relative;
    font-size: 14px;
    &.disabled {
      color: #888;
      cursor: not-allowed;
    }
    &:not(.disabled):hover {
      background-color: #f2f2f2;
      color: #0084ff;
    }
    .check-wrap {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      .rto_iconfont {
        font-size: 13px;
      }
    }
    .menu-right {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }
}
</style>
