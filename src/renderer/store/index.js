import window from "./window";
import view from "./view";
import drawer from './drawer';
import ci from './ci';
import file from './file';
import PersistedState from './persistedState';

export default {
  plugins: [PersistedState],
  modules: {
    window,
    view,
    drawer,
    ci,
    file
  },
  state: {},
  mutations: {},
  actions: {}
};
