<template>
  <div class="wizard-wrap">
    <a-spin :spinning="loading">
      <a-page-header title="项目列表">
        <template slot="extra">
          <a-button type="primary" @click="createApp">
            新建
          </a-button>
          <a-button v-if="$store.state.view.wizardClosable" @click="createApp">
             关闭
          </a-button>
        </template>
        <p v-if="appList.length === 0">暂无历史项目</p>
        <template v-else>
          <a-row :gutter="16">
            <a-col :span="6" v-for="app in appList" :key="app.id">
              <a-card :title="app.name" :bordered="true" @click="openApp(app)">
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
    this.loading = true
    if(window.SuanpanAPI) {
      this.fetchApps();
    }else {
      window.addEventListener('load', () => {
        this.fetchApps();
      })
    }
  },
  methods: {
    fetchApps() {
      this.$store.dispatch("file/list").then( list => {
        this.appList = list
        this.loading = false
      }).catch( err => {
        console.error(err)
        this.loading = false
      })
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
      this.$store.dispatch('file/openApp', app.id).then(() => {
        this.$store.commit('view/wizardVisible', false)
      })
      
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
  .close-wrap {

  }
}
</style>
