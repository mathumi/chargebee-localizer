import {Entity, model, property} from '@loopback/repository';

@model()
export class Releases extends Entity {
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


  constructor(data?: Partial<Releases>) {
    super(data);
  }
}

export interface ReleasesRelations {
  // describe navigational properties here
}

export type ReleasesWithRelations = Releases & ReleasesRelations;
