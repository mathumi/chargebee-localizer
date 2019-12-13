import {DefaultCrudRepository} from '@loopback/repository';
import {Locales, LocalesRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LocalesRepository extends DefaultCrudRepository<
  Locales,
  typeof Locales.prototype.code,
  LocalesRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Locales, dataSource);
  }
}
