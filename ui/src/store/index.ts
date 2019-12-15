import Vue from "vue";
import Vuex from "vuex";
import { branchService, releaseService, localeService } from "@/service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    branches: [],
    releases: [],
    locales: []
  },
  mutations: {
    setReleases(state, payload = []) {
      state.releases = payload;
    },
    setBranches(state, payload = []) {
      state.branches = payload;
    },
    setLocales(state, payload = []) {
      state.branches = payload;
    }
  },
  actions: {
    async init({ commit }) {
      const [branches, releases, locales] = await Promise.all([branchService.getBranchesWithCollections(), releaseService.getReleases(), localeService.getLocales()]);
      commit('setBranches', branches);
      commit('setReleases', releases);
      commit('setLocales', locales);
    },
    async createBranch({ dispatch }, payload) {
      await branchService.createBranch(payload);
      await dispatch('init');
    },
    async publishDraftBranch({ dispatch }, { id, payload }) {
      await branchService.publishDraft(id, payload);
      await dispatch('init');
    },
    async discardDraftBranch({ dispatch }, branchId) {
      await branchService.discardDraft(branchId);
      await dispatch('init');
    }
  },
  getters: {
    draftBranches: state => {
      return state.branches.filter(branch => Boolean(branch.draftVersionId));
    },
    liveBranches: state => {
      return state.branches.filter(branch => !Boolean(branch.draftVersionId));
    },
    // branchCollections: state => {
    //   return (branchId) => state.collections[branchId];
    // }
  }
});
