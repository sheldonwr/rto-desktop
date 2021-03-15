export default {
  namespaced: true,
  state: {
    allLogs: []
  },
  mutations: {
    allLogs(state, val=[]) {
      state.allLogs = val;
    },
  },
  actions: {
    connect() {
      return window.SuanpanAPI.componentLogService.connect()
    },
    register({ state, commit }) {
      commit('allLogs', []);
      window.SuanpanAPI.componentLogService.registerLogProcessor((res) => {
        commit('allLogs', addLogs(state.allLogs, res.logs))      
      })
    },
    query({ state, commit }) {
      commit('allLogs', []);
      window.SuanpanAPI.componentLogService.query().then( res => {
        commit('allLogs', addLogs(state.allLogs, res.logs))  
      })
    }
  }
};

function addLogs(logs, newLogs=[]) {
  // time
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
  return logs.slice(0, newLen);
}

function convertUTCDateToLocalDate(dateStr) {
  let date = new Date(dateStr);
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate.toLocaleString();   
}

function getNodeLabel(nodeId) {
  let nodeObj = window.SuanpanAPI.nodeService.getNode(nodeId);
  let nodeLabel = nodeObj.metadata.label;
  return `${nodeLabel} (id:${nodeId.slice(0, 6)})`
}