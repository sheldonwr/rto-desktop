<template>
  <ul class="drop-menu">
    <li
      class="drop-menu-item"
      v-for="dropItem in datas"
      :key="dropItem.value"
      @mouseenter="menuMouseenterHandler(dropItem)"
      @click.stop="menuClickHandler(dropItem)"
    >
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
    this.menuInst = findComponentUpward(this, 'menu');
  },
  methods: {
    menuMouseenterHandler(dropItem) {
      this.openedItem = dropItem.value;
    },
    menuClickHandler(dropItem) {
      if(dropItem.status === 'disabled') {
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
  .drop-menu-item {
    padding: 5px 0 7px 16px;
    position: relative;
    font-size: 14px;
    &:hover {
      background-color: #f2f2f2;
      color: #0084ff;
    }
    .menu-right {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }
}
</style>
