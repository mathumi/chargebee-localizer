import {DefaultCrudRepository} from '@loopback/repository';
import {BranchedTexts, BranchedTextsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BranchedTextsRepository extends DefaultCrudRepository<
  BranchedTexts,
  typeof BranchedTexts.prototype.id,
  BranchedTextsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(BranchedTexts, dataSource);
  }
}
