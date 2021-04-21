
export default {
  namespaced: true,
  state: {
    selectedNode: null,
    copiedNodeObj: null
  },
  mutations: {
    selectedNode(state, val) {
      state.selectedNode = val;
    },
    copiedNodeObj(state, val) {
      state.copiedNodeObj = val;
    }
  },
  actions: {
    cutNode({ state, commit }) {
      if(state.selectedNode && !this.getters["status/isRunning"]) {
        let copied =  window.SuanpanAPI.nodeService.copyNode(state.selectedNode.id);
        commit('copiedNodeObj', copied);
        window.SuanpanAPI.nodeService.removeNode(state.selectedNode.id);
      }
    },
    copyNode({ state, commit }) {
      if(state.selectedNode && !this.getters["status/isRunning"]) {
        let copied =  window.SuanpanAPI.nodeService.copyNode(state.selectedNode.id);
        commit('copiedNodeObj', copied);
        this.dispatch('showMessage', { type: 'success', msg: '复制成功'});
      }
    },
    pasteNode({ state }) {
      if(state.copiedNodeObj && !this.getters["status/isRunning"]) {
        window.SuanpanAPI.nodeService.pasteNode(state.copiedNodeObj);
      }
    },
    deleteNode({ state }) {
      if(state.selectedNode && !this.getters["status/isRunning"]) {
        window.SuanpanAPI.nodeService.removeNode(state.selectedNode.id);
      }
    }
  }
};
