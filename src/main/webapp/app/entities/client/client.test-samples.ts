import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 14534,
  preferedDay: 'consequently embed upright',
  address: 'vicinity aha happily',
};

export const sampleWithPartialData: IClient = {
  id: 18386,
  preferedDay: 'yippee',
  address: 'ah bank',
};

export const sampleWithFullData: IClient = {
  id: 28690,
  preferedDay: 'source for happy-go-lucky',
  address: 'whoever',
};

export const sampleWithNewData: NewClient = {
  preferedDay: 'firsthand meanwhile gee',
  address: 'tribe pfft yowza',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
