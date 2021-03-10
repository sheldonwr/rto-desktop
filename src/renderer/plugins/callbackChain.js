class CallbackChain {
  constructor() {
    this._callbacks = {};
  }
  add(event, listener) {
    if (!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    let len = this._callbacks[event].length;
    this._callbacks[event].push(() => {
      listener(this._callbacks[event][len - 1]);
    });
  }
  exec(event) {
    if (!this._callbacks[event]) {
      return;
    }
    let len = this._callbacks[event].length;
    if (len > 0) {
      this._callbacks[event][len - 1]();
    }
  }
}

export default {
  install(Vue, { store }) {
    let callbackChain = new CallbackChain();
    Vue.prototype.$callbackChain = callbackChain;

    // 退出软件
    callbackChain.add('close', () => {
      store.dispatch('window/closeWindow');
    })

    callbackChain.add('close', ( cb ) => {
      store.dispatch('file/messageDialog').then( res => {
        if(res === 0) {
          // 保存
          store.dispatch('file/save', true).then(cb);
        }else if(res === 1) {
          // 不保存
          cb();
        }else if(res === 2) {
          // 取消
        }
      })
    })

  }
};
