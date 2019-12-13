import {DefaultCrudRepository} from '@loopback/repository';
import {ReleasedCollections, ReleasedCollectionsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ReleasedCollectionsRepository extends DefaultCrudRepository<
  ReleasedCollections,
  typeof ReleasedCollections.prototype.id,
  ReleasedCollectionsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ReleasedCollections, dataSource);
  }
}
