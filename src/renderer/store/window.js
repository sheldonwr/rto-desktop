import { send, invoke } from "../services"

export default {
  namespaced: true,
  state: {
    maximized: false
  },
  mutations: {
  },
  actions: {
    getMaximizedState({ state }) {
      invoke('window-getMaximize').then(isMaximized => {
        state.maximized = isMaximized;
      });
    },
    minimizeWindow() {
      send('window-minimize');
    },
    maximizeWindow() {
      send('window-maximize');
    },
    closeWindow() {
      send('window-close');
    }
  }
};
