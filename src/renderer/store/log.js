export default {
  namespaced: true,
  state: {
    allLogs: [],
    allLogsUnique: {}
  },
  mutations: {
    cleanLogs(state) {
      state.allLogs = [];
      state.allLogsUnique = {};
    },
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
        commit('allLogs', addLogs(state.allLogs, state.allLogsUnique, logs))      
      })
    },
    query({ state, commit }, appId) {
      window.SuanpanAPI.componentLogService.query(appId).then( res => {
        commit('allLogs', addLogs(state.allLogs, state.allLogsUnique, res.logs))  
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

function addLogs(logs, logsUnique, newLogs=[]) {
  // format
  let filterLogs = [];
  for(let i = 0; i < newLogs.length; i++) {
    let newLog = newLogs[i];
    if(!newLog.time) {
      continue
    }
    convertUTCDateToLocalDate(newLog);
    let id = newLog.htime + newLog.title.slice(0, 10);
    if(logsUnique[id]) {
      continue;
    }
    logsUnique[id] = true;
    newLog.id = id;
    newLog.fnode = getNodeLabel(newLog.data.node);
    filterLogs.push(newLog);
  }
  // sort
  filterLogs.sort((a, b) => {
    return b.htime - a.htime;
  })
  logs = filterLogs.concat(logs);

  // slice
  const MAX_LEN = 500
  if(logs.length > MAX_LEN) {
    for(let i = MAX_LEN; i < logs.length; i++) {
      let lg = logs[i];
      delete logsUnique[lg.id];
    }
    logs = logs.slice(0, MAX_LEN);
  }
  return logs;
}

function convertUTCDateToLocalDate(log) {
  let date = new Date(log.time);
  log.ftime = date.toLocaleString();
  log.htime = date.getTime();
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