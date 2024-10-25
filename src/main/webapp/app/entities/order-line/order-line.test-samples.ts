import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 13771,
  quantity: 21716,
  purchasePrice: 21477.28,
};

export const sampleWithPartialData: IOrderLine = {
  id: 31368,
  quantity: 15355,
  purchasePrice: 16895.9,
};

export const sampleWithFullData: IOrderLine = {
  id: 4491,
  quantity: 14032,
  purchasePrice: 29762.81,
};

export const sampleWithNewData: NewOrderLine = {
  quantity: 9583,
  purchasePrice: 1474.15,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
