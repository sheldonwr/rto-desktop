import LoadingView from './Loading.vue'
import Vue from 'vue'

let loadingInst;
export default {
  show() {
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
  },
  close() {
    if(loadingInst) {
      loadingInst.close();
    }
  }
}