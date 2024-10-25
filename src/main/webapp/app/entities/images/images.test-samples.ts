import { IImages, NewImages } from './images.model';

export const sampleWithRequiredData: IImages = {
  id: 4006,
  url: 'https://rare-concentration.org/',
};

export const sampleWithPartialData: IImages = {
  id: 20997,
  url: 'https://humiliating-lawmaker.com',
};

export const sampleWithFullData: IImages = {
  id: 7955,
  url: 'https://cooperative-tarragon.info',
};

export const sampleWithNewData: NewImages = {
  url: 'https://superb-newsletter.com/',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
