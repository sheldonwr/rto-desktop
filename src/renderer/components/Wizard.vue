<template>
  <div class="wizard-wrap">
    <a-spin :spinning="showLoading && loading">
      <a-page-header title="项目列表">
        <template slot="extra">
          <a-tooltip title="刷新">
            <a-button :loading="loading" class="reload" type="primary" icon="reload" @click="reload"/>
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
                  <a-tooltip :title="app.status === 'Running' ? '停止': '开启'">
                    <a-button type="default" shape="circle" style="border:0;line-height:1" @click="changeStatus(app)">
                      <span :class="['rto_iconfont', app.status === 'Running' ? 'icon-stop' : 'icon-start']" style="font-size: 26px;"></span>
                    </a-button>
                  </a-tooltip>
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
import { interval } from 'utils/'

export default {
  data() {
    return {
      showLoading: true,
      loading: false,
      appList: [],
      refreshInterval: 5000
    };
  },
  created() {},
  mounted() {
    this.reload(true);
    this.refreshTimer = interval(
      () => this.fetchApps(),
      this.refreshInterval
    );
  },
  beforeDestroy() {
    this.refreshTimer.clear();
  },
  methods: {
    fetchApps(showLoading) {
      if(showLoading) {
        this.showLoading = true;
      }else {
        this.showLoading = false;
      }
      this.loading = true;
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
          this.fetchApps();
          // this.$store.commit("view/wizardVisible", false);
          // this.$store.commit('view/wizardClosable', true)
        })
        .catch(err => {
          console.error(err)
        });
    },
    openApp(app) {
      this.$store.dispatch("file/openApp", {id: app.id, path:app.path}).then(() => {
        this.$store.commit("view/wizardVisible", false);
        this.$store.commit('view/wizardClosable', true)
      });
    },
    deleteApp(app) {
      this.$confirm({
        title: `确定删除“${app.name}”这个项目吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return this.$store.dispatch('file/delete', {id:app.id,path:app.path}).then(() => {
            this.$store.commit('view/wizardClosable', false)
            this.fetchApps();
          }).catch(err => {
            console.error(err)
          })
        },
        onCancel() {},
      });
    },
    close() {
      this.$store.commit("view/wizardVisible", false);
    },
    reload(showLoading) {
      if (window.SuanpanAPI) {
        this.fetchApps(showLoading);
      } else {
        window.addEventListener("load", () => {
          this.fetchApps(showLoading);
        });
      }
    },
    changeStatus(app) {
      if(app.status === 'Running') {
        this.$store.dispatch('showMessage', { type: 'info', msg: '停止中...'})
        this.$store.dispatch('status/release', app.id)
      } else {
        this.$store.dispatch('showMessage', { type: 'info', msg: '开启中...'})
        this.$store.dispatch('status/deploy', app.id)
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
