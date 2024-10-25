import dayjs from 'dayjs/esm';

import { IClientOrder, NewClientOrder } from './client-order.model';

export const sampleWithRequiredData: IClientOrder = {
  id: 25344,
  orderDate: dayjs('2024-10-23'),
  deliveryDate: dayjs('2024-10-23'),
  deliveryAddress: 'while yippee',
  status: 'IN_PROGRESS',
  totalPrice: 21872.32,
};

export const sampleWithPartialData: IClientOrder = {
  id: 4189,
  orderDate: dayjs('2024-10-23'),
  deliveryDate: dayjs('2024-10-23'),
  deliveryAddress: 'so sniff',
  status: 'CANCELLED',
  totalPrice: 18360,
};

export const sampleWithFullData: IClientOrder = {
  id: 22431,
  orderDate: dayjs('2024-10-24'),
  deliveryDate: dayjs('2024-10-23'),
  deliveryAddress: 'selfishly pish',
  status: 'IN_PROGRESS',
  totalPrice: 32748.54,
};

export const sampleWithNewData: NewClientOrder = {
  orderDate: dayjs('2024-10-24'),
  deliveryDate: dayjs('2024-10-23'),
  deliveryAddress: 'till nor',
  status: 'SHIPPED',
  totalPrice: 32066.89,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
