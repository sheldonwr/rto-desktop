<template>
  <a-table :columns="columns" :data-source="data" rowKey="appId">
    <span slot="status" slot-scope="status">
      <a-badge :status="status === 'Running' ? 'success' : 'default'"></a-badge
      >{{ status === "Running" ? "运行中" : "已停止" }}</span
    >
    <span slot="operation" slot-scope="item">
      <a href="#" @click="enterApp({ id: item.appId, name: item.appName })"
        >查看</a
      >
    </span>
  </a-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      columns: [
        {
          title: "项目名称",
          dataIndex: "appName",
          key: "appName",
        },
        {
          title: "项目ID",
          dataIndex: "appId",
          key: "appId",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: 'status' },
        },
        {
          title: "时长",
          dataIndex: "age",
          key: "age"
        },
        {
          title: "CPU占用(毫核)",
          dataIndex: "resources.cpu",
          key: "resources.cpu",
          align: 'center'
        },
        {
          title: "内存占用(M)",
          dataIndex: "resources.mem",
          key: "resources.mem",
          align: 'center'
        },
        {
          title: '操作',
          key: "operation",
          scopedSlots: { customRender: 'operation' },
        },
      ],
    }
  },
  methods: {
    enterApp() {

    }
  }
};
</script>

<style lang="scss"></style>
