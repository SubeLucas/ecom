import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 1568,
  preferedDay: 'filthy aged whose',
  address: 'lined',
};

export const sampleWithPartialData: IClient = {
  id: 15964,
  preferedDay: 'except',
  address: 'hydrocarbon',
};

export const sampleWithFullData: IClient = {
  id: 9891,
  preferedDay: 'avow ew',
  address: 'dreamily',
};

export const sampleWithNewData: NewClient = {
  preferedDay: 'thyme fussy',
  address: 'whistle',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
