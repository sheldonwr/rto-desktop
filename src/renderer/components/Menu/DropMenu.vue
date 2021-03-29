<template>
  <ul class="drop-menu">
    <li
      :class="['drop-menu-item', {'selected': openedItem === dropItem.value} , { 'disabled' : dropItem.disabled }, {'sub': dropItem.level === 2}]"
      v-for="dropItem in datas"
      :key="dropItem.value"
      @mouseenter="menuMouseenterHandler(dropItem)"
      @mousedown.stop="menuClickHandler(dropItem)"
    >
      <span class="check-wrap">
        <span v-if="dropItem.checkable && dropItem.checked" class="rto_iconfont icon-check"></span>
      </span>
      <div class="menu-label" :title="dropItem.level === 2? dropItem.label: ''">{{ dropItem.label }}</div>
      <span v-if="dropItem.items && dropItem.items.length>0" class="more-wrap">
        <span class="rto_iconfont icon-right-arrow"></span>
      </span>
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
  padding: 0;
  background: rgba(250,250,250,1.0);
  border-radius: 2px;
  .drop-menu-item {
    width: 150px;
    padding: 8px 0 8px 28px;
    position: relative;
    font-size: 14px;
    color: initial;
    &.sub {
      width: 200px;
      padding-right: 10px;
      .menu-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 150px;
        // display: inline-block;
      }
    }
    &.selected {
      background-color: #f2f2f2;
      color: #0084ff;
    }
    &.disabled {
      color: #888;
      cursor: not-allowed;
    }
    // &:not(.disabled):hover {
    //   background-color: #f2f2f2;
    //   color: #0084ff;
    // }
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
    .more-wrap {
      position: absolute;
      right: 0;
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
