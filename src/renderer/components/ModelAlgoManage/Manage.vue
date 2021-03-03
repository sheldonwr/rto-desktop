<template>
  <div class="manage-content">
    <a-table
      size="middle"
      :columns="initColumns"
      :data-source="dataList"
      :pagination="pagination"
      @change="this.changeTable"
    >
      <span slot="action">
        <a @click="editorRow">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="popconfirmTitle"
          ok-text="确定"
          cancel-text="取消"
          @confirm="deleteRow"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <div v-if="formVisible">
      <a-button class="okBtn" type="primary">
        确定
      </a-button>
      <a-button type="primary" @click="closeForm">
        取消
      </a-button>
    </div>
     <a-button v-else type="primary" @click="showForm">
      新建{{ this.type }}
    </a-button>
    <div class="form" v-show="formVisible">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-model-item ref="name" label="模型名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="desc" label="模型描述" prop="desc">
          <a-input v-model="form.desc" />
        </a-form-model-item>
        <a-form-model-item
          class="prop"
          v-bind="index !== 0 && formItemLayoutWithOutLabel"
          v-for="(item, index) in form.prop"
          :key="item.key"
          :label="index === 0 ? '基本参数' : ''"
        >
          <a-input
            v-model="item.label"
            placeholder="标题"
          />
          <a-input
            v-model="item.value"
            placeholder="key"
          />
          <a-select class="select_type" v-model="item.type" placeholder="类型">
            <a-select-option value="string">string</a-select-option>
            <a-select-option value="int">int</a-select-option>
          </a-select>
          <a-input-number
            v-if="item.type === 'int'"
            v-model="item.value"
            placeholder="默认值"
          />
          <a-input
            v-else
            v-model="item.value"
            placeholder="默认值"
          />
          <a-icon
            v-if="form.prop.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="form.prop.length === 1"
            @click="removeProp(item)"
          />
        </a-form-model-item>
        <a-form-model-item class="addBtn" v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 100%" @click="addProp">
            <a-icon type="plus" /> 添加基本参数
          </a-button>
        </a-form-model-item>
        <a-form-model-item
          class="param"
          v-for="(item, index) in form.param"
          v-bind="index !== 0 && formItemLayoutWithOutLabel"
          :key="item.key"
          :label="index === 0 ? '参数配置' : ''"
        >
          <a-input
            v-model="item.label"
            placeholder="标题"
          />
          <a-input
            v-model="item.value"
            placeholder="key"
          />
          <a-select class="select_type" v-model="item.type" placeholder="类型">
            <a-select-option value="string">string</a-select-option>
            <a-select-option value="int">int</a-select-option>
          </a-select>
          <a-input-number
            v-if="item.type === 'int'"
            v-model="item.defaultValue"
            placeholder="初始值"
          />
          <a-input
            v-else
            v-model="item.defaultValue"
            placeholder="初始值"
          />
          <a-radio v-model="item.isRequired">必填</a-radio>
          <a-icon
            v-if="form.param.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="form.param.length === 1"
            @click="removeParam(item)"
          />
        </a-form-model-item>
        <a-form-model-item class="addBtn" v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 100%" @click="addParam">
            <a-icon type="plus" /> 添加参数设置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type"],
  computed: {
    initColumns: function() {
      this.columns[0].title = `${this.types[this.type]}名称`;
      this.columns[1].title = `${this.types[this.type]}描述`;
      return this.columns;
    },
    popconfirmTitle: function() {
      return `确定删除当前${this.types[this.type]}?`;
    },
    dataList: function() {
      let data = new Array();
      this.$store.state.ci.ciList.map(val => {
        const { id, name, desc } = val;
        data.push({
          key: val.id,
          name,
          desc
        });
      });
      return data;
    },
    pagination: function() {
      const { pageSize, pageNo } = this.$store.state.ci.pagination;
      return {
        pageSize,
        current: pageNo
      };
    }
  },
  watch: {
    '$store.state.drawer.drawerVisible': function(drawerVisible) {
      console.log(drawerVisible)
      const { activeTab } = this.$store.state.drawer;
      if (!drawerVisible) {
        this.closeForm();
      } else if (activeTab === this.type){
        this.getList();
      }
    },
    '$store.state.drawer.activeTab':  function(activeTab) {
      const { drawerVisible } = this.$store.state.drawer;
      if (drawerVisible && activeTab === this.type){
        this.getList();
      }
    }
  },
  data() {
    return {
      types: {
        model: '模型',
        algo: '算法'
      },
      columns: [
        { title: '名称', dataIndex: 'name', key: 'name'},
        { title: '描述', dataIndex: 'desc', key: 'desc'},
        { title: '操作', dataIndex: 'operation', key: 'operation', width: 100, scopedSlots: { customRender: 'action' }},
      ],
      labelCol: { span: 4},
      wrapperCol: { span: 20 },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 20, offset: 4 },
          sm: { span: 20, offset: 4 },
        },
      },
      form: {
        name: '',
        prop: [
          { label: '', name: ''}
        ],
        param: [
          { label: '', name: ''}
        ]
      },
      rules: {
        name: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ],
      },
      formVisible: false
    };
  },
  methods: {
    changeTable(pagination) {
      this.$store.commit('ci/updatePagination', pagination);
    },
    showForm() {
      this.formVisible = true;
    },
    closeForm() {
      this.formVisible = false;
    },
    addProp() {
      this.form.prop.push({
        value: '',
        label: '',
      });
    },
    removeProp(item) {
      let index = this.form.prop.indexOf(item);
      if (index !== -1) {
        this.form.prop.splice(index, 1);
      }
    },
    addParam() {
      this.form.param.push({
        value: '',
        label: '',
      });
    },
    removeParam(item) {
      let index = this.form.param.indexOf(item);
      if (index !== -1) {
        this.form.param.splice(index, 1);
      }
    },
    deleteRow() {

    },
    editorRow() {
      this.showForm();
    },
    getList() {
      this.$store.dispatch('ci/getList', {
        type: this.type,
        pagination: this.$store.getters['ci/getPagination']
      });
    }
  }, 
};
</script>
<style lang="scss">
  .manage-content {
    .okBtn {
      margin-right: 10px;
    }
    
    .form {
      margin-top: 10px;
      border-top: 1px solid #e8e8e8;
      padding-top: 10px;

      .ant-form-item {
        margin-bottom: 0;
      }

      .prop .ant-form-item-children, .param .ant-form-item-children {
        display: flex;
        align-items: center;

        .ant-form-item-label {
          margin-bottom: 0;
        }

        .ant-input, .ant-select, .ant-input-number {
          margin-right: 2px;
        }

        .ant-radio-wrapper {
          margin-left: 2px;
          span.ant-radio + * {
            padding-right: 4px;
            padding-left: 4px;
          }
        }

        .select_type {
          max-width: 80px;
        }
        .ant-input-number {
          min-width: 70px;
        }
      }

      .addBtn {
        margin-bottom: 10px;
      }
    }
  }
</style>