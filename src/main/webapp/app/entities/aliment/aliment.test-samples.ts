import { IAliment, NewAliment } from './aliment.model';

export const sampleWithRequiredData: IAliment = {
  id: 24885,
  name: 'neatly cross via',
  origin: 'ITALIE',
  season: 15658,
  color: 'PINK',
  weight: 11493.3,
  stockQuantity: 16980,
  price: 32243.53,
};

export const sampleWithPartialData: IAliment = {
  id: 11319,
  name: 'whether likewise a',
  origin: 'ESPAGNE',
  season: 18824,
  color: 'PURPLE',
  weight: 11763.89,
  stockQuantity: 23832,
  price: 7239.56,
};

export const sampleWithFullData: IAliment = {
  id: 4499,
  name: 'mount among',
  origin: 'FRANCE',
  season: 26575,
  color: 'BROWN',
  weight: 10972.83,
  stockQuantity: 13280,
  price: 29150.35,
};

export const sampleWithNewData: NewAliment = {
  name: 'annual while',
  origin: 'FRANCE',
  season: 7411,
  color: 'RED',
  weight: 3943.21,
  stockQuantity: 13591,
  price: 20433.55,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
