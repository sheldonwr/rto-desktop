<template>
  <a-modal
    v-model="mvisible"
    title="删除文件夹"
    ok-text="确认"
    cancel-text="取消"
    :maskClosable="false"
    @ok="okHandler"
    @cancel="cancelHandler"
  >
    <div>
      <a-alert :description="alertDescription" type="warning" show-icon />
      <div class="tree-container">
        <a-tree
          v-model="checkedKeys"
          checkable
          :expanded-keys="expandedKeys"
          :tree-data="dirData"
          @expand="onExpand"
        >
        </a-tree>
      </div>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="cancelHandler">
        取消
      </a-button>
      <a-button key="ok" type="primary" :loading="loading" @click="okHandler">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import bus from "utils/bus";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dir: {
      default() {
        return { label: "" };
      },
    },
  },
  watch: {
    value(val) {
      this.mvisible = val;
    }
  },
  data() {
    return {
      mvisible: this.value,
      loading: false,
      checkedKeys: [],
      expandedKeys: [],
    };
  },
  computed: {
    alertDescription() {
      return `文件夹“${this.dir.label}”中包含如下项目，选择需要删除的文件夹和项目`
    },
    dirData() {
      if(this.dir.key) {
        this.expandedKeys = [this.dir.key]
      }
      return [this.dir]
    }
  },
  mounted() {},
  methods: {
    okHandler() {
      console.log(this.checkedKeys)
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  min-height: 100px;
  max-height: 400px;
  overflow: auto;
}
</style>
