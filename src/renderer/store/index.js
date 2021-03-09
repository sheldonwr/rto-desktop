import window from "./window";
import view from "./view";
import drawer from './drawer';
import ci from './ci';
import file from './file';
import PersistedState from './persistedState';

export default {
  plugins: [PersistedState],
  modules: {
    window,
    view,
    drawer,
    ci,
    file
  },
  state: {},
  mutations: {},
  actions: {
    showLoading() {
      this._vm.$loading.show();
    },
    closeLoading({ state }, delay=false) {
      if(delay) {
        setTimeout(() => {
          this._vm.$loading.close();
        }, 500);
      }else {
        this._vm.$loading.close();
      }
    }
  }
};
