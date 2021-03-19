<template>
    <div v-if="$store.state.wizardVisible" class="wizard-wrap">
      <a-spin :spinning="loading">
      <a-page-header title="项目列表">
        <template slot="extra">
          <a-button type="primary" @click="createApp">
            新建
          </a-button>
        </template>
        <p>暂无项目</p>
        <!-- <a-row :gutter="16">
          <a-col :span="6">
            <a-card title="Card title" :bordered="true">
              <p>card content</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card title="Card title" :bordered="true">
              <p>card content</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card title="Card title" :bordered="true">
              <p>card content</p>
            </a-card>
          </a-col>
        </a-row> -->
      </a-page-header>
  </a-spin>
    </div>
</template>

<script>

export default {
  data() {
    return {
      loading: false
    }
  },
  created() {
  },
  methods: {
    createApp() {
      this.$store.dispatch('file/create').then( () => {
        this.$store.commit('wizardVisible', false)
      }).catch( () => {
      })
    }
  }
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
}
</style>
