import { BranchApiBase } from '@/service/api';

class BranchService extends BranchApiBase {
  async getBranchesWithCollections() {
    const branches: any[] = await branchService.getBranches();
    for (const branch of branches) {
      branch.collections = await branchService.getCollections(branch.id, branch.draft_version || branch.publised_version);
    }
    return branches;
  }
}

export const branchService = new BranchService();

