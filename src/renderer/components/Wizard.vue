<template>
  <div class="wizard-wrap">
    <a-spin :spinning="loading">
      <a-page-header title="项目列表">
        <template slot="extra">
          <a-tooltip title="刷新">
            <a-button class="reload" type="primary" icon="reload" @click="reload"/>
          </a-tooltip>
          <a-button type="primary" @click="createApp">
            新建
          </a-button>
          <a-button v-if="$store.state.view.wizardClosable" @click="close">
            关闭
          </a-button>
        </template>
        <p v-if="appList.length === 0">暂无项目</p>
        <template v-else>
          <a-row :gutter="16">
            <a-col :span="6" v-for="app in appList" :key="app.id">
              <a-card :bordered="true">
                <div class="cover-wrap" slot="cover" @click="openApp(app)">
                  <div class="title-wrap">
                    <a-badge :status="app.status === 'Running' ? 'success' : 'default'"></a-badge>
                    <p class="title">{{ app.name }}</p>
                  </div>
                  <div class="inner-wrap">
                    <a-button type="link">
                      打开
                    </a-button>
                  </div>
                </div>
                <template slot="actions" class="ant-card-actions">
                  <a-button type="danger" icon="delete" @click="deleteApp(app)">
                    删除
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </template>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      appList: [],
    };
  },
  created() {},
  mounted() {
    this.reload();
  },
  methods: {
    fetchApps() {
      this.$store
        .dispatch("file/list")
        .then((list) => {
          this.appList = list;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    createApp() {
      this.$store
        .dispatch("file/create")
        .then(() => {
          this.$store.commit("view/wizardVisible", false);
        })
        .catch(() => {});
    },
    openApp(app) {
      this.$store.dispatch("file/openApp", "" + app.id).then(() => {
        this.$store.commit("file/currentAppName", app.name);
        this.$store.commit("view/wizardVisible", false);
      });
    },
    deleteApp(app) {
      this.$confirm({
        title: `确定删除“${app.name}”这个项目吗？`,
        okText: '',
        cancelText: '',
        onOk: () => {
          return this.$store.dispatch('file/delete', app.id).then(() => {
            this.fetchApps();
          })
        },
        onCancel() {},
      });
    },
    close() {
      this.$store.commit("view/wizardVisible", false);
    },
    reload() {
      this.loading = true;
      if (window.SuanpanAPI) {
        this.fetchApps();
      } else {
        window.addEventListener("load", () => {
          this.fetchApps();
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.wizard-wrap {
  width: 100%;
  position: absolute;
  top: 37px;
  z-index: 999;
  height: calc(100vh - 37px);
  background: #fff;
  .reload {
    position: relative;
    top: 2px;
  }
  .cover-wrap {
    height: 80px;
    cursor: pointer;
    .title-wrap {
      overflow: hidden;
      padding-top: 30px;
      padding-left: 20px;
      display: flex;
      .title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .inner-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 80px;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      visibility: hidden;
      justify-content: center;
      align-items: center;
      transition: transform 0.3s;
      transform: translateY(-150px);
    }
    &:hover {
      .inner-wrap {
        visibility: visible;
        transform: translateY(0);
      }
    }
  }
}
</style>
