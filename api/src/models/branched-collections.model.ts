import { Entity, model, property } from '@loopback/repository';

@model()
export class BranchedCollections extends Entity {
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
    type: 'number',
    required: true,
  })
  branch_id: number;

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

  @property({
    type: 'string',
  })
  published_texts_version: string;

  @property({
    type: 'string'
  })
  draft_texts_version: string;

  constructor(data?: Partial<BranchedCollections>) {
    super(data);
  }
}

export interface BranchedCollectionsRelations {
  // describe navigational properties here
}

export type BranchedCollectionsWithRelations = BranchedCollections & BranchedCollectionsRelations;
