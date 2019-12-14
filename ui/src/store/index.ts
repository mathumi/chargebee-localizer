import Vue from "vue";
import Vuex from "vuex";
import { branchService, releaseService } from "@/service";
import { collections } from './stub';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    branches: [],
    releases: [],
    collections: {}
  },
  mutations: {
    setReleases(state, payload = []) {
      state.releases = payload;
    },
    setBranches(state, payload = []) {
      state.branches = payload;
    },
    setCollections(state, { branchId, payload }) {
      Vue.set(state.collections, branchId, payload);
    }
  },
  actions: {
    async init({ commit }) {
      const [branches, releases] = await Promise.all([branchService.getBranches(), releaseService.getReleases()]);
      commit('setBranches', branches);
      commit('setReleases', releases);
    },

    async mockInit({ commit }) {
      await new Promise(resolve => {
        commit('setCollections', {
          branchId: 10,
          payload: collections
        });
        resolve();
      });
    }
  },
  getters: {
    draftBranches: state => {
      return state.branches.filter(branch => Boolean(branch.draftVersionId));
    },
    liveBranches: state => {
      return state.branches.filter(branch => !Boolean(branch.draftVersionId));
    },
    branchCollections: state => {
      return (branchId) => state.collections[branchId];
    }
  }
});
