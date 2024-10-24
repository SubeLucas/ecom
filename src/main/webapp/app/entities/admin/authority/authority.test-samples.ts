import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '50716330-7640-4a4f-ab2a-79cf8211c489',
};

export const sampleWithPartialData: IAuthority = {
  name: 'c03f29f3-bbe8-4a21-b5e0-14885575c0a4',
};

export const sampleWithFullData: IAuthority = {
  name: 'd6746d27-cf7b-477e-aeba-8d2eaae79336',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
