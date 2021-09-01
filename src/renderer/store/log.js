export default {
  namespaced: true,
  state: {
    allLogs: []
  },
  mutations: {
    allLogs(state, val=[]) {
      state.allLogs = val;
    },
    addLog(state, node) {
      state.allLogs.push({
        fnode: getNodeLabel(node.id),
        ftime: new Date().toLocaleString(),
        title: "在线编辑",
        level: 'warning'
      });
    }
  },
  actions: {
    connect() {
      return window.SuanpanAPI.componentLogService.connect()
    },
    register({ state, commit }, appId) {
      window.SuanpanAPI.componentLogService.unregisterAllLogProcessor()
      window.SuanpanAPI.componentLogService.registerLogProcessor(appId, (logs) => {
        commit('allLogs', addLogs(state.allLogs, logs))      
      })
    },
    query({ state, commit }, appId) {
      window.SuanpanAPI.componentLogService.query(appId).then( res => {
        commit('allLogs', addLogs(state.allLogs, res.logs))  
      })
    },
    getAppLog({}, {appId, curlogPos=0}) {
      let logPath = window.SuanpanAPI.logService.getAppLogId(window.appConfig.userId, appId);
      return window.SuanpanAPI.logService.getLog(logPath, curlogPos);
    },
    getComponentLog({}, {appId, nodeId, curlogPos=0}) {
      let logPath = window.SuanpanAPI.logService.getLogId(window.appConfig.userId, appId, nodeId);
      return window.SuanpanAPI.logService.getLog(logPath, curlogPos); 
    }
  }
};

function addLogs(logs, newLogs=[]) {
  // format
  for(let i = 0; i < newLogs.length; i++) {
    convertUTCDateToLocalDate(newLogs[i]);
    newLogs[i].fnode = getNodeLabel(newLogs[i].data.node);
  }
  logs = logs.concat(newLogs);
  // sort
  logs.sort((a, b) => {
    return b.htime - a.htime;
  })
  // slice
  const MAX_LEN = 3000
  if(logs.length > MAX_LEN) {
    logs = logs.slice(0, MAX_LEN);
  }
  return logs;
}

function convertUTCDateToLocalDate(log) {
  let date = new Date(log.time);
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  log.ftime = newDate.toLocaleString();
  log.htime = newDate.getTime();
}

function getNodeLabel(nodeId) {
  if(!nodeId) {
    return '';
  }
  let nodeObj = window.SuanpanAPI.nodeService.getNode(nodeId);
  if(nodeObj) {
    let nodeLabel = nodeObj.metadata.label;
    return `${nodeLabel} (id:${nodeId.slice(0, 6)})`
  }else {
    return `id:${nodeId.slice(0, 6)}`
  }
}