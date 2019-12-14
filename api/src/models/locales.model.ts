import {Entity, model, property} from '@loopback/repository';

@model()
export class Locales extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

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


  constructor(data?: Partial<Locales>) {
    super(data);
  }
}

export interface LocalesRelations {
  // describe navigational properties here
}

export type LocalesWithRelations = Locales & LocalesRelations;
