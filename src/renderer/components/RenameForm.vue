<template>
  <a-modal
    v-model="mvisible"
    :title="isDir?'文件夹重命名':'项目重命名'"
    ok-text="确认"
    cancel-text="取消"
    destroyOnClose
    :maskClosable="false"
    @ok="okHandler"
    @cancel="cancelHandler"
  >
    <div>
      <a-form-model
        ref="renameForm"
        :model="renameForm"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item has-feedback :label="isDir?'文件夹名称':'项目名称'" prop="name">
          <a-input v-model="renameForm.name" />
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
    isDir: {
      type: Boolean,
      required: true,
    },
    model: {
      default() {
        return {name:''}
      },
      validator(value) {
        if(value == null || value.name == null) {
          return {name:''}
        }else {
          return value
        }
      }
    }
  },
  watch: {
    value(val) {
      this.mvisible = val;
    },
    model(val) {
      this.renameForm = {
        name: (val && val.name) || '',
        id: (val && val.id) || '',
      }
    }
  },
  data() {
    return {
      mvisible: this.value,
      renameForm: {
        name: (this.model && this.model.name) || '',
        id: (this.model && this.model.id) || '',
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      loading: false,
    };
  },
  mounted() {
    
  },
  methods: {
    okHandler() {
      this.$refs["renameForm"].validate((valid) => {
        if (valid) {
          this.mvisible = false;
          this.rename();
        } else {
          return false;
        }
      });
    },
    cancelHandler() {
      this.mvisible = false;
      this.$emit("input", false);
    },
    rename() {
      this.loading = true;
      let dispatchName = this.isDir ? "file/dirChangName" : "file/appChangeName"
      this.$store
        .dispatch(dispatchName, this.renameForm)
        .then(() => {
          this.loading = false;
          this.$emit("input", false);
          this.$emit("success", false);
          this.showSuccess();
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
          this.showFail();
        });
      
    },
    showSuccess() {
      this.$store.dispatch("showMessage", {
        type: "success",
        msg: "重命名成功",
      });
    },
    showFail() {
      this.$store.dispatch("showMessage", {
        type: "error",
        msg: "重命名失败",
      });
    }
  },
};
</script>

<style lang="scss" scoped></style>
