export function rightClickMenuInit(storeInst, Vue) {
  window.addEventListener('click', () => {
    if (storeInst.state.drawer.menuInfo.visible) {
      storeInst.commit('drawer/changeMenuVisible', { visible: false });
    }
  });

  window.addEventListener('load', () => {
    // 画布右键菜单
    window.SuanpanAPI.eventService.on('sp:app:contextmenu', (...data) => {
      let url = new URL(window.location.href);
      if(!url.pathname.startsWith('/web/service/predict')) {
        return;
      }
      if(data.length > 1) {
        const commonMenu = [{
          key: 'setting',
          name: '属性配置',
          active: true,
          function: () => {
            storeInst.dispatch("view/showSettingPannel")
          }
        },{
          key: 'cut',
          name: '剪切',
          active: false,
          function: () => {
            storeInst.dispatch("edit/cutNode");
          }
        }, {
          key: 'copy',
          name: '复制',
          active: false,
          function: () => {
            storeInst.dispatch("edit/copyNode");
          }
        }, {
          key: 'paste',
          name: '粘贴',
          active: !storeInst.getters["status/isRunning"],
          function: () => {
            storeInst.dispatch("edit/pasteNode");
          }
        }, {
          key: 'delete',
          name: '删除',
          active: false,
          function: () => {
            Vue.prototype.$confirm({
              title: `确定删除这个组件吗？`,
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
                storeInst.dispatch("edit/deleteNode");
              },
              onCancel() {},
            });
          }
        }];
        let mouseEvent = data[1][0];
        storeInst.commit('drawer/changeMenuVisible', {
          visible: true,
          location: { x: mouseEvent.clientX, y: mouseEvent.clientY},
          detail: commonMenu
        });
      }
    })
  
    // 组件右键菜单
    window.SuanpanAPI.eventService.on('sp:node:contextmenu', (event, options = []) => {
      let url = new URL(window.location.href);
      if(!url.pathname.startsWith('/web/service/predict')) {
        return;
      }
      if (options.length > 0) {
        const { item, itemKey } = options[0];
        const commonMenu = [{
          key: 'setting',
          name: '属性配置',
          active: true,
          function: () => {
            storeInst.dispatch("view/showSettingPannel", itemKey)
          }
        }, {
          key: 'cut',
          name: '剪切',
          active: !storeInst.getters["status/isRunning"],
          function: () => {
            storeInst.dispatch("edit/cutNode");
          }
        }, {
          key: 'copy',
          name: '复制',
          active: !storeInst.getters["status/isRunning"],
          function: () => {
            storeInst.dispatch("edit/copyNode");
          }
        }, {
          key: 'paste',
          name: '粘贴',
          active: !storeInst.getters["status/isRunning"],
          function: () => {
            storeInst.dispatch("edit/pasteNode");
          }
        }, {
          key: 'delete',
          name: '删除',
          active: !storeInst.getters["status/isRunning"],
          function: () => {
            Vue.prototype.$confirm({
              title: `确定删除这个组件吗？`,
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
                storeInst.dispatch("edit/deleteNode");
              },
              onCancel() {},
            });
          }
        }];
        storeInst.commit('edit/selectedNode', item);
        let detail = [...commonMenu];
        if (item && item.metadata && item.metadata.def) {
          const { actionList } = item.metadata.def;
          const { x, y, height, width } = document.getElementById(itemKey).getBoundingClientRect();
          if (_.isEmpty(actionList) || actionList.length === 0) return;
          actionList.map((action, index) => {
            if (action.hasOwnProperty('url') && action.url) {
              // const { url } = actionList[0];
              const url = action.url;
              const { appId, userId } = window.appConfig;
              let iframeUrl = url;
              if(url.startsWith('{{origin}}')) {
                iframeUrl = url.replace('{{origin}}', window.location.origin);
              }else {
                iframeUrl = `${appConfig.redirectRequest}${(url || '').match(/\/proxr[\S]*/)}`
                                .replace('{{userId}}', userId)
                                .replace('{{appId}}', appId)
                                .replace('{{nodeId}}', itemKey)    
              }
              detail.push({
                key: `action${index}`, 
                name: action.label || '操作页面',
                active: storeInst.getters['status/isRunning'],
                function: () => {
                  storeInst.commit('drawer/changeMenuVisible', { visible: false });
                  if(iframeUrl.includes('modelAlgoManage')) {
                    let url = new URL(iframeUrl);
                    let params = new URLSearchParams(url.search);
                    let tab = params.get("tab");
                    if(tab == 'model') {
                      storeInst.dispatch('window/createModalWindow');
                    }else if(tab == 'algo') {
                      storeInst.dispatch('window/createAlgorithmWindow');
                    }
                  }else {
                    window.open(iframeUrl);
                  }
                }
              });
            }
          });
          if (storeInst.state.drawer.menuInfo.visible) {
            storeInst.commit('drawer/changeMenuVisible', { visible: false });
          } else {
            storeInst.commit('drawer/changeMenuVisible', {
              visible: true,
              location: { x: x + width, y: y + height / 2},
              detail
            });
          }
        }
      }
    });
  });
}