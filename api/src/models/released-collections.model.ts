import { Entity, model, property } from '@loopback/repository';

@model()
export class ReleasedCollections extends Entity {
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
    type: 'number',
    required: true,
  })
  release_id: number;

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


  constructor(data?: Partial<ReleasedCollections>) {
    super(data);
  }
}

export interface ReleasedCollectionsRelations {
  // describe navigational properties here
}

export type ReleasedCollectionsWithRelations = ReleasedCollections & ReleasedCollectionsRelations;
