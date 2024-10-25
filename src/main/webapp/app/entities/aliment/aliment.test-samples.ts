import { IAliment, NewAliment } from './aliment.model';

export const sampleWithRequiredData: IAliment = {
  id: 30680,
  name: 'antagonize oh lest',
  origin: 'ITALIE',
  season: 30928,
  color: 'BLACK',
  weight: 6972.92,
  stockQuantity: 3569,
  price: 22211.91,
};

export const sampleWithPartialData: IAliment = {
  id: 18580,
  name: 'lift requirement bulky',
  origin: 'ESPAGNE',
  season: 30856,
  color: 'BLACK',
  weight: 22986.3,
  stockQuantity: 5554,
  price: 22284.29,
};

export const sampleWithFullData: IAliment = {
  id: 8354,
  name: 'bowler',
  origin: 'FRANCE',
  season: 11152,
  color: 'ORANGE',
  weight: 2491.16,
  stockQuantity: 5216,
  price: 4184.7,
};

export const sampleWithNewData: NewAliment = {
  name: 'safely',
  origin: 'FRANCE',
  season: 31726,
  color: 'WHITE',
  weight: 29903.61,
  stockQuantity: 20103,
  price: 9637.68,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
