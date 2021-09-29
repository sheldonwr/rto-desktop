import window from "./window";
import view from "./view";
import drawer from './drawer';
import file from './file';
import status from './status';
import edit from './edit';
import log from './log';
import statustooltip from './statustooltip';
import setting from './setting';

import PersistedState from './persistedState';

export default {
  // plugins: [PersistedState],
  modules: {
    window,
    view,
    drawer,
    file,
    status,
    edit,
    log,
    statustooltip,
    setting
  },
  state: {
    selectedNode: null,
    appReadonly: false,
    theme: localStorage.getItem('theme') || 'default'
  },
  mutations: {
    selectedNode(state, val) {
      state.selectedNode = val;
    },
    appReadonly(state, val) {
      state.appReadonly = val;
    },
    theme(state, val) {
      state.theme = val;
    }
  },
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
    },
    showMessage({ state }, opts) {
      if(typeof opts === 'string') {
        opts = {
          msg: opts
        }
      }
      let option = Object.assign({
        type: 'error',
        duration: 3,
        msg: '',
      }, opts);
      this._vm.$message[option.type](option.msg, option.duration);
    }
  }
};
