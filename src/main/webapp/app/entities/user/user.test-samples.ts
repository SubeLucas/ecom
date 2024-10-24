import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 5933,
  login: 'H`@CQgh1\\1myBDar\\{K5h3x',
};

export const sampleWithPartialData: IUser = {
  id: 6475,
  login: 'YEaQn@IVxDez\\EUeCTL\\tac\\5C\\&I7dm',
};

export const sampleWithFullData: IUser = {
  id: 16128,
  login: 'KICWdy',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
