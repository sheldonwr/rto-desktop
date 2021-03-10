<template>
  <div class="toolbar">
    <div class="toolbar-list">
      <div class="toolbar-icon" title="新建" @click="clickHandler('file-new')">
        <span class="rto_iconfont icon-xinjian"></span>
      </div>
      <div class="toolbar-icon" title="打开" @click="clickHandler('file-open')">
        <span class="rto_iconfont icon-dakai"></span>
      </div>
      <div class="toolbar-icon" title="保存" @click="clickHandler('file-save')">
        <span class="rto_iconfont icon-baocun"></span>
      </div>
      <div class="toolbar-icon" title="另存为" @click="clickHandler('file-saveAs')">
        <span class="rto_iconfont icon-lingcunwei"></span>
      </div>
      <div class="separator"></div>
      <div class="toolbar-icon" title="剪切">
        <span class="rto_iconfont icon-jianqie"></span>
      </div>
      <div class="toolbar-icon" title="复制">
        <span class="rto_iconfont icon-fuzhi"></span>
      </div>
      <div class="separator"></div>
      <div class="toolbar-icon" title="设置">
        <span class="rto_iconfont icon-shezhi"></span>
      </div>
      <div class="toolbar-icon" title="日志">
        <span class="rto_iconfont icon-rizhi"></span>
      </div>
      <div class="separator"></div>
      <div class="toolbar-icon" title="帮助">
        <span class="rto_iconfont icon-bangzhu"></span>
      </div>
      <div class="toolbar-icon" title="关于">
        <span class="rto_iconfont icon-about"></span>
      </div>
    </div>
    <div class="deploy-container">
      <div class="toolbar-icon" title="部署">
        <span class="rto_iconfont icon-start"></span>
      </div>
    </div>
    <div class="placeholder"></div>
  </div>
</template>

<script>
export default {
  methods: {
    clickHandler(id) {
      if(id === 'file-new') {
        this.$store.dispatch('file/create')
      }else if(id === 'file-open') {
        this.$store.dispatch('file/openDialog')
      }else if(id === 'file-save') {
        this.$store.dispatch('file/save')
      }else if(id === 'file-saveAs') {
        this.$store.dispatch('file/saveAs')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f7fb;
	border: solid 1px #dcdcdc;
  padding-left: 6px;
  .toolbar-list {
    display: flex;
    align-items: center;
    height: 100%;
    width: 400px;
  }
  .toolbar-icon {
    padding: 4px 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(210, 210, 210, 0.6);
      border-radius: 2px;
    }
    .rto_iconfont {
      font-size: 18px;
    }
  }
  .separator {
    width: 1px;
    background: rgba(220,220,220,0.6);
    height: 100%;
    margin: 0 1px;
  }
  .placeholder {
    width: 400px;
  }
}
</style>