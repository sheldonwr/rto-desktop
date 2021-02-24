<template>
  <ul class="drop-menu">
    <li
      class="drop-menu-item"
      v-for="dropItem in datas"
      :key="dropItem.value"
      @mouseenter="menuMouseenterHandler(dropItem)"
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
  methods: {
    menuMouseenterHandler(dropItem) {
      this.openedItem = dropItem.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-menu {
  width: 150px;
  padding: 0;
  background: #eee;
  .drop-menu-item {
    padding: 5px 0 5px 16px;
    position: relative;
    &:hover {
      background-color: #f2f2f2;
    }
    .menu-right {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }
}
</style>
