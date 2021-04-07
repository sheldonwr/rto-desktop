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
          defaultExpandAll
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
    };
  },
  computed: {
    alertDescription() {
      return `文件夹“${this.dir.label}”中包含如下项目和子文件夹，选择需要删除的文件夹和项目`
    },
    dirData() {
      return [this.dir]
    }
  },
  mounted() {},
  methods: {
    okHandler() {
      if(!this.checkedKeys || (this.checkedKeys.length === 0)) {
        return;
      }
      let dirIds = [], appIds = [];
      for(let i = 0; i < this.checkedKeys.length; i++) {
        let key = this.checkedKeys[i];
        let keys = key.split('-');
        if(keys[0] === 'app') {
          appIds.push(keys[1])
        }else if(keys[0] === 'dir') {
          dirIds.push(keys[1]);
        }
      }
      this.deleteApps(dirIds, appIds);
    },
    deleteApps(dirIds, appIds) {
      if(appIds.length > 0) {
        this.loading = true;
        this.appCount = 0;
        for(let i = 0; i < appIds.length; i++) {
          this.deleteApp(appIds[i], dirIds, appIds);
        }
      }else {
        this.loading = true;
        this.deleteDirs(dirIds)
      }
    },
    deleteApp(id, dirIds, appIds) {
      this.$store.dispatch('file/delete', {id}).then( () => {
        this.appCount++;
        if(this.appCount === appIds.length) {
          this.deleteDirs(dirIds)
        }
      }).catch( () => {
        this.appCount++;
        if(this.appCount === appIds.length) {
          this.deleteDirs(dirIds)
        }
      })
    },
    deleteDirs(dirIds) {
      this.$store.dispatch('file/deleteDirs', dirIds).then( () => {
        this.loading = false;
        this.$emit("input", false);
        this.$store.dispatch("showMessage", {
          type: "success",
          msg: "删除成功",
        });
        this.$emit("success");
      }).catch( err => {
        console.error(err)
        this.loading = false;
        this.$store.dispatch("showMessage", {
          type: "error",
          msg: "删除失败",
        });
      })
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
