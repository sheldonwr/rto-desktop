let _instantDataKey = 0;

export default {
  namespaced: true,
  state: {
    allLogs: [],
    allLogsUnique: {},
    logUpdateFlag: 0,
    allInstantDatas: {}
  },
  mutations: {
    cleanLogs(state) {
      state.allLogs = [];
      state.allLogsUnique = {};
      state.allInstantDatas = {};
    },
    logUpdateFlag(state) {
      let val = state.logUpdateFlag + 1
      if (val === Number.MAX_SAFE_INTEGER) {
        val = 0
      }
      state.logUpdateFlag = val
    },
    allLogs(state, val = []) {
      state.allLogs = val;
    },
    allInstantDatas(state, val = {}) {
      state.allInstantDatas = val
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
    register({state, commit}, appId) {
      // 日志
      commit('cleanLogs')
      window.SuanpanAPI.componentLogService.unregisterAllLogProcessor()
      window.SuanpanAPI.componentLogService.registerLogProcessor(appId, (logs) => {
        commit('allLogs', addLogs(state.allLogs, state.allLogsUnique, logs))
        if (logs && (logs.length > 0)) {
          commit('logUpdateFlag')
        }
      })
      // 实时数据
      window.SuanpanAPI.instantDataService.unregisterAllLogProcessor()
      window.SuanpanAPI.instantDataService.registerInstantDataProcessor(appId, (logs) => {
        commit('allInstantDatas', formatInstantData(state.allInstantDatas, logs))
      })
    },
    query({state, commit}, appId) {
      window.SuanpanAPI.componentLogService.query(appId).then(res => {
        commit('allLogs', addLogs(state.allLogs, state.allLogsUnique, res.logs))
        if (res.logs && (res.logs.length > 0)) {
          commit('logUpdateFlag')
        }
      })
    },
    getAppLog({}, {appId, curlogPos = 0}) {
      let logPath = window.SuanpanAPI.logService.getAppLogId(window.appConfig.userId, appId);
      return window.SuanpanAPI.logService.getLog(logPath, curlogPos);
    },
    getComponentLog({}, {appId, nodeId, curlogPos = 0}) {
      let logPath = window.SuanpanAPI.logService.getLogId(window.appConfig.userId, appId, nodeId);
      return window.SuanpanAPI.logService.getLog(logPath, curlogPos);
    }
  }
};

function addLogs(logs, logsUnique, newLogs = []) {
  // format
  let filterLogs = [];
  for (let i = 0; i < newLogs.length; i++) {
    let newLog = newLogs[i];
    if (!newLog.time) {
      continue
    }
    convertUTCDateToLocalDate(newLog);
    let id = newLog.id ? newLog.id : newLog.htime + newLog.title.slice(0, 10);
    if (logsUnique[id]) {
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
  const MAX_LEN = 3000
  if (logs.length > MAX_LEN) {
    for (let i = MAX_LEN; i < logs.length; i++) {
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
  if (!nodeId) {
    return '';
  }
  let nodeObj = window.SuanpanAPI.nodeService.getNode(nodeId);
  if (nodeObj) {
    let nodeLabel = nodeObj.metadata.label;
    return `${nodeLabel} (id:${nodeId.slice(0, 6)})`
  } else {
    return `id:${nodeId.slice(0, 6)}`
  }
}

// 实时数据
const MaxNodeDataLen = 50
const PORT_PATTERN = /^(in|out)\d+$/;

function formatInstantData(allData, newData = {}) {
  let newDataKeys = Object.keys(newData)
  if (newDataKeys.length < 1) {
    return allData
  }
  let resData = Object.assign({}, allData)
  newDataKeys.forEach(nodeId => {
    let nodeDataArr = newData[nodeId]
    nodeDataArr.forEach(nodeData => {
      Object.keys(nodeData.log).forEach(portId => {

        if (PORT_PATTERN.test(portId)) {
          if (resData[nodeId] == null) {
            resData[nodeId] = []
          }

          const record = JSON.parse(nodeData.log[portId]);

          if (record) {
            resData[nodeId] = record.values.map(value => Object.assign({}, value, { port: portId, connection: record.module_id, properties: value.properties || {} }));
          }
        }
      })
    })
  })
  return resData;
}

function getPortDescription(nodeId, portId) {
  let node = window.SuanpanAPI.nodeService.getNode(nodeId)
  if (!node) {
    return portId;
  }
  let portName = portId;
  let ports = [];
  if (node.metadata && node.metadata.def && node.metadata.def.ports) {
    ports = node.metadata.def.ports;
  }
  let p = ports.find(i => i.uuid == portId);
  if (p && p.description) {
    portName = p.description.zh_CN || p.description;
  }
  return portName;
}