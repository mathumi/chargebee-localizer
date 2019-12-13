import {DefaultCrudRepository} from '@loopback/repository';
import {BranchedCollections, BranchedCollectionsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BranchedCollectionsRepository extends DefaultCrudRepository<
  BranchedCollections,
  typeof BranchedCollections.prototype.id,
  BranchedCollectionsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(BranchedCollections, dataSource);
  }
}
