import LoadingView from './Loading.vue'
import Vue from 'vue'

let loadingInst;
export default {
  show(args) {
    let loadingEl = document.getElementById('rto-loading');
    if(!loadingEl) {
      let vueInst = new Vue({
        render:  h => h(LoadingView)
      }).$mount();
      loadingInst = vueInst.$children[0];
      document.body.append(vueInst.$el);
    }else {
      loadingInst = loadingEl.__vue__;
    }
    for(let key in args) {
      loadingInst[key] = args[key];
    }
    loadingInst.show();
  },
  close() {
    if(loadingInst) {
      loadingInst.close();
    }
  }
}