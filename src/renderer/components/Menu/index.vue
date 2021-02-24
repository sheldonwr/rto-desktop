<template>
  <div>
    <ul class="menu-list">
      <li
        class="menu-item"
        tabindex="-1"
        v-for="menuItem in menuItems"
        :key="menuItem.value"
        @click="menuClickHandler(menuItem)"
        @mouseenter="menuMouseenterHandler(menuItem)"
        @blur="menuBlurHandler"
      >
        <span>{{ menuItem.label }}</span>
        <drop-menu v-if="openedMenu === menuItem.value" class="menu-bottom" :datas="menuItem.items"></drop-menu>
      </li>
    </ul>
  </div>
</template>

<script>
import DropMenu from "./DropMenu";

export default {
  components: {
    DropMenu,
  },
  data() {
    return {
      menus: {
        file: {
          label: "文件",
          value: "file",
          items: [
            {
              label: "新建",
              value: "file-new",
            },
            {
              label: "打开",
              value: "file-open",
              items: [
                {
                  label: 'aaa',
                  value: 'aaa'
                },
                 {
                  label: 'bbb',
                  value: 'bbb'
                },
              ]
            },
            {
              label: "保存",
              value: "file-save",
            },
          ],
        },
        edit: {
          label: "编辑",
          value: "edit",
          items: [
            {
              label: "剪切",
              value: "edit-cut",
              items: [
                {
                  label: 'ccc',
                  value: 'ccc'
                },
                {
                  label: 'ddd',
                  value: 'ddd'
                },
                {
                  label: 'eee',
                  value: 'eee'
                },
              ]
            },
            {
              label: "复制",
              value: "edit-copy",
            },
            {
              label: "粘贴",
              value: "edit-paste",
            },
            {
              label: "删除",
              value: "edit-delete",
            },
          ],
        },
        view: {
          label: "视图",
          value: "view",
          items: [
            {
              label: "工具栏",
              value: "view-tool",
            },
            {
              label: "状态栏",
              value: "view-status",
            },
            {
              label: "平台窗口",
              value: "view-platform",
              items: [
                {
                  label: 'fff',
                  value: 'fff'
                },
                {
                  label: 'ggg',
                  value: 'ggg'
                },
                {
                  label: 'hhh',
                  value: 'hhh'
                },
              ]
            },
          ],
        },
        action: {
          label: "动作",
          value: "action",
          items: [
            {
              label: "连接",
              value: "action-connection",
            },
            {
              label: "路径",
              value: "edit-path",
            },
            {
              label: "更新",
              value: "edit-update",
            },
          ],
        },
      },
      openedMenu: ''
    };
  },
  computed: {
    menuItems() {
      return Object.keys(this.menus).map((menuKey) => ({
        ...this.menus[menuKey],
      }));
    },
  },
  methods: {
    menuClickHandler(menuItem) {
      this.openedMenu = menuItem.value;
    },
    menuMouseenterHandler(menuItem) {
      if(this.openedMenu) {
        this.openedMenu = menuItem.value;
      }
    },
    menuBlurHandler() {
      this.openedMenu = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-list {
  display: flex;
  align-items: center;
  padding-left: 8px;
  .menu-item {
    padding: 5px 8px;
    cursor: pointer;
    outline: 0;
    position: relative;
    &:hover {
      background-color: rgba(238, 238, 238, 0.6);
      border-radius: 2px;
    }
    .menu-bottom {
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
}
</style>
