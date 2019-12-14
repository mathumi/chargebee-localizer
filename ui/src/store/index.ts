import Vue from 'vue';
import Vuex from 'vuex';
import ApiService from '@/service';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    branches: [],
    releases: []
  },
  mutations: {
    updateReleases(state, payload = []) {
      state.releases = payload;
    },
    updateBranches(state, payload = []) {
      state.branches = payload;
    }
  },
  actions: {
    async init({ commit }) {
      
    }
  },
  getters: {
    draftBranches: state => {
      return state.branches.filter(branch => Boolean(branch.draftVersionId));
    },
    liveBranches: state => {
      return state.branches.filter(branch => !Boolean(branch.draftVersionId));
    }
  },
});
