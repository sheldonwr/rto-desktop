<template>
  <a-modal
    v-model="mvisible"
    title="新建文件夹"
    ok-text="确认"
    cancel-text="取消"
    :maskClosable="false"
    @ok="okHandler"
    @cancel="cancelHandler"
  >
    <div>
      <a-form-model
        ref="dirCreateForm"
        :model="dirCreateForm"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback label="文件夹名称:" prop="name">
          <a-input v-model="dirCreateForm.name" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="新建到:" prop="dir">
          <a-tree-select
            v-model="dirCreateForm.dir"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="dirData"
            tree-default-expand-all
            :replaceFields="{key: 'id', title: 'label', value: 'id'}"
          >
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
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
  },
  watch: {
    value(val) {
      this.mvisible = val;
    },
  },
  data() {
    return {
      mvisible: this.value,
      dirCreateForm: {
        name: "",
        dir: '2',
      },
      rules: {
        name: [{ required: true, message: "请输入文件夹名称", trigger: "change" }],
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      loading: false,
      dirData: []
    };
  },
  mounted() {
    this.$store.dispatch('file/dirList').then( res => {
      this.dirCreateForm.dir = res.id
      this.dirData = [res]
    })
  },
  methods: {
    okHandler() {
      this.$refs["dirCreateForm"].validate((valid) => {
        if (valid) {
          this.mvisible = false;
          this.createDir();
        } else {
          return false;
        }
      });
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    },
    createDir() {
      this.loading = true;
      this.$store
        .dispatch("file/create", this.dirCreateForm)
        .then(() => {
          this.loading = false;
          this.$store.dispatch("showMessage", {
            type: "success",
            msg: "创建成功",
          });
          this.$emit("input", false);
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
          this.$store.dispatch("showMessage", {
            type: "error",
            msg: "创建失败",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
