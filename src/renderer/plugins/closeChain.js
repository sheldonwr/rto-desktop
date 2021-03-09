class CallbackChain {
  constructor(){
    super();
    this._callbacks = {};
  }
  add(event, listener) {
    if(!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(listener);
  }
  exec(event) {
    if(this.listeners.length === 0) {
      return;
    }
    let lastIdx = this.listeners.length - 1;
    while(lastIdx >= 0) {
      
    }
  }
}

export default {
  install(Vue, options) {
    Vue.prototype.$callbackChain = new CallbackChain();
  }
}