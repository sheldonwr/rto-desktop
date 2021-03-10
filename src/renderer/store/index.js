import window from "./window";
import view from "./view";
import drawer from './drawer';
import ci from './ci';
import file from './file';
import status from './status';

import PersistedState from './persistedState';

export default {
  plugins: [PersistedState],
  modules: {
    window,
    view,
    drawer,
    ci,
    file,
    status
  },
  state: {},
  mutations: {},
  actions: {
    showLoading({}, args) {
      let opts = Object.assign({
        opacity: true,
        msg: ''
      }, args)
      this._vm.$loading.show(opts);
    },
    closeLoading({ state }) {
      this._vm.$loading.close();
    },
    showNotify({ state }, opts) {
      if(typeof opts === 'string') {
        opts = {
          message: opts
        }
      }
      let option = Object.assign({
        type: 'error',
        duration: 3,
        message: '',
        description: '',
        placement: 'topRight',
        top: '24px'
      }, opts);
      this._vm.$notification[option.type](option);
    }
  }
};
