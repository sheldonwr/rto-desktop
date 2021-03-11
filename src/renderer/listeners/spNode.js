window.addEventListener('load', () => {
  // 监听组件选中
  window.SuanpanAPI.eventService.on('sp:node:select', (event, data) => {
    console.log(event, data)
    if (data && data.length > 1) {
      const nodeInfo = data[1];
      //  判断当前选中组件是否为rto组件
      if (nodeInfo.metadata.def.type ===  601) {

      }
    }
  });
  
  // 监听rto组件打开操作面板
  window.SuanpanAPI.eventService.on('rto:setting:params', (event, data) => {
    console.log(event, data)
    if (data && data.length > 1) {
      const nodeInfo = data[1];
      const { actionList } = nodeInfo.metadata.def;
      actionList.map(action => {
        if (action.hasOwnProperty('label') && action.hasOwnProperty('url')) {
          storeInst.commit('drawer/changeDrawerVisible', true);
          storeInst.commit('drawer/changeIsModelAlgoManage', false);
          storeInst.commit('drawer/changeIframURL', action.url);
        }
      });
    }
  });
})