export default {
  install(Vue) {
    Vue.directive('focus', {
      inserted: function (el) {
        // 聚焦元素
        el.focus && el.focus()
      }
    })
  }
}