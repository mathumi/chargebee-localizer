import {Entity, model, property} from '@loopback/repository';

@model()
export class Branches extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  modified_at: string;


  constructor(data?: Partial<Branches>) {
    super(data);
  }
}

export interface BranchesRelations {
  // describe navigational properties here
}

export type BranchesWithRelations = Branches & BranchesRelations;
