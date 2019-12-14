import {DefaultCrudRepository} from '@loopback/repository';
import {Branches, BranchesRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BranchesRepository extends DefaultCrudRepository<
  Branches,
  typeof Branches.prototype.id,
  BranchesRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Branches, dataSource);
  }
}
