import { BranchApiBase } from '@/service/api';

class BranchService extends BranchApiBase {
  async getBranchesWithCollections() {
    const branches = await branchService.getBranches();
    const collections = [];
    for (let branch of branches) {
      let res = await branchService.getCollections(branch.id, branch.draft_version || branch.publised_version);
      collections.push(res);
    }
    this.getBranches();
  }
}

export const branchService = new BranchService();

