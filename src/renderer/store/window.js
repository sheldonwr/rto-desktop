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
    },
    createModalWindow() {
      send('window-modal');
    },
    createAlgorithmWindow() {
      send('window-algorithm');
    },
    createWizardWindow() {
      send('window-wizard');
    },
    openModelManager() {
      return invoke('window-model-manager')
    }
  }
};
