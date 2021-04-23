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
    register({ state, commit }) {
      window.SuanpanAPI.componentLogService.registerLogProcessor((res) => {
        commit('allLogs', addLogs(state.allLogs, res.logs))      
      })
    },
    query({ state, commit }) {
      window.SuanpanAPI.componentLogService.query().then( res => {
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
    newLogs[i].ftime = convertUTCDateToLocalDate(newLogs[i].time);
    newLogs[i].fnode = getNodeLabel(newLogs[i].data.node);
  }
  logs = logs.concat(newLogs);
  // sort
  logs.sort((a, b) => {
    return b.id - a.id;
  })
  // unique
  let n = logs.length;
  let newLen = 0;
  for (let i = 0; i < n; i++) {
    if (i < n - 1 && logs[i].id == logs[i + 1].id) {
      continue;
    }
    logs[newLen++] = logs[i];
  }
  logs = logs.slice(0, newLen)
  // slice
  const MAX_LEN = 500
  if(logs.length > MAX_LEN) {
    logs = logs.slice(0, MAX_LEN);
  }
  return logs;
}

function convertUTCDateToLocalDate(dateStr) {
  let date = new Date(dateStr);
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate.toLocaleString();   
}

function getNodeLabel(nodeId) {
  let nodeObj = window.SuanpanAPI.nodeService.getNode(nodeId);
  if(nodeObj) {
    let nodeLabel = nodeObj.metadata.label;
    return `${nodeLabel} (id:${nodeId.slice(0, 6)})`
  }else {
    return `id:${nodeId.slice(0, 6)}`
  }
}