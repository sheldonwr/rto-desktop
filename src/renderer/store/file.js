import { invoke } from "../services";
import { createEmpty, openFile, saveFile} from "services/file"

export default {
  namespaced: true,
  state: {
    lastOpenedPath: null,
    lastAppId: null,
  },
  mutations: {
    lastOpenedPath(state, val) {
      state.lastOpenedPath = val;
    },
    lastAppId(state, val) {
      state.lastAppId = val;
    },
  },
  actions: {
    startApp({ state, commit, dispatch }) {
      this.dispatch('showLoading');
      window.addEventListener('load', () => {
        let firstId = window.SuanpanAPI.eventService.on('sp:transition:success', (event, data) => {
          window.SuanpanAPI.eventService.off(firstId)
          if (state.lastOpenedPath) {
            
          } else {
            // create an empty app
            createEmpty().then(res => {
              commit("lastAppId", res.id);
              let secondId = window.SuanpanAPI.eventService.on('sp:transition:success', () => {
                window.SuanpanAPI.eventService.off(secondId)
                this.dispatch('closeLoading', true);
              });
              window.SuanpanAPI.common.goto("predict", res.id);
            }).catch((err) => {
              this.dispatch('closeLoading', true);
              console.error(err);
            });
          }
        });
      })
    },
    importFile({ state }) {
      invoke("file-open").then( filePath => {
        if(filePath) {
          openFile(filePath).then( res => {
            commit("lastAppId", res.id);
            window.SuanpanAPI.common.goto("predict", res.id);
          }).catch(err => {
            console.error(err);
          })
        }
      });
    },
    saveFile({ state }) {
      invoke("file-save-dialog").then(filePath => {
        if(filePath) {
          saveFile(state.lastAppId, filePath).then(res => {

          }).catch(err => {
            console.error(err);
          });
        }
      });
    },
  },
};
