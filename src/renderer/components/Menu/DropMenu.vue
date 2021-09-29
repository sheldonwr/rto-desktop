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
      <span class="keycut-wrap">
        <span>{{ dropItem.keycut ? dropItem.keycut : '' }}</span>
      </span>
      <span v-if="dropItem.items && dropItem.items.length>0 && !dropItem.disabled" class="more-wrap">
        <span class="rto_iconfont icon-right-arrow"></span>
      </span>
      <drop-menu
        v-if="openedItem === dropItem.value && !dropItem.disabled"
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
  background: #FFFFFF;
  border: 1px solid rgba(112,112,112,0.3);
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  .drop-menu-item {
    width: 240px;
    padding-left: 28px;
    position: relative;
    font-size: 14px;
    color: initial;
    line-height: 32px;
    color: #1F1F1F;
    &.sub {
      width: 240px;
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
      background-color: #B8DCFD;
      // color: #0084ff;
    }
    &.disabled {
      color: #888;
      cursor: not-allowed;
      &.selected {
        background: #FFFFFF;
      }
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
    .keycut-wrap {
      position: absolute;
      right: 15px;
      top: 0;
      bottom: 0;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .more-wrap {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 20px;
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
