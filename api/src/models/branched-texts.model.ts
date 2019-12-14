import {Entity, model, property} from '@loopback/repository';

@model()
export class BranchedTexts extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  collection_id: number;

  @property({
    type: 'string',
    required: true,
  })
  version: string;

  @property({
    type: 'string',
    required: true,
  })
  locale_code: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

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


  constructor(data?: Partial<BranchedTexts>) {
    super(data);
  }
}

export interface BranchedTextsRelations {
  // describe navigational properties here
}

export type BranchedTextsWithRelations = BranchedTexts & BranchedTextsRelations;
