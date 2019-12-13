import {DefaultCrudRepository} from '@loopback/repository';
import {ReleasedTexts, ReleasedTextsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ReleasedTextsRepository extends DefaultCrudRepository<
  ReleasedTexts,
  typeof ReleasedTexts.prototype.id,
  ReleasedTextsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ReleasedTexts, dataSource);
  }
}
