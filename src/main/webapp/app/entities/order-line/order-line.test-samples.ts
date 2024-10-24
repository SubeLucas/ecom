import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 29916,
  quantity: 613,
  purchasePrice: 3954.32,
};

export const sampleWithPartialData: IOrderLine = {
  id: 91,
  quantity: 1087,
  purchasePrice: 13204.36,
};

export const sampleWithFullData: IOrderLine = {
  id: 7887,
  quantity: 12293,
  purchasePrice: 2697.5,
};

export const sampleWithNewData: NewOrderLine = {
  quantity: 23391,
  purchasePrice: 10469.67,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
