export default {
  namespaced: true,
  state: {
    status: ''
  },
  mutations: {
    status(state, val) {
      state.status = val;
    },
  }
};