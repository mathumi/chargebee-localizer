import {DefaultCrudRepository} from '@loopback/repository';
import {Releases, ReleasesRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ReleasesRepository extends DefaultCrudRepository<
  Releases,
  typeof Releases.prototype.id,
  ReleasesRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Releases, dataSource);
  }
}
