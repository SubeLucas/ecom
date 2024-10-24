import { IImages, NewImages } from './images.model';

export const sampleWithRequiredData: IImages = {
  id: 25628,
  url: 'https://bright-corral.info',
};

export const sampleWithPartialData: IImages = {
  id: 29548,
  url: 'https://french-palate.net',
};

export const sampleWithFullData: IImages = {
  id: 2445,
  url: 'https://informal-trash.info',
};

export const sampleWithNewData: NewImages = {
  url: 'https://hospitable-overload.net/',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
