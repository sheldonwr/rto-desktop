import createPersistedState from "vuex-persistedstate";

export default createPersistedState({
  key: "rto",
  paths: [
    "view.toolbarVisible",
    "view.logPanelVisible",
  ],
});