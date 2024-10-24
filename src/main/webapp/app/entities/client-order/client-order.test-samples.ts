import dayjs from 'dayjs/esm';

import { IClientOrder, NewClientOrder } from './client-order.model';

export const sampleWithRequiredData: IClientOrder = {
  id: 22322,
  orderDate: dayjs('2024-10-23'),
  deliveryDate: dayjs('2024-10-24'),
  deliveryAddress: 'lotion shrilly',
  status: 'IN_PROGRESS',
  totalPrice: 20054.02,
};

export const sampleWithPartialData: IClientOrder = {
  id: 28001,
  orderDate: dayjs('2024-10-24'),
  deliveryDate: dayjs('2024-10-24'),
  deliveryAddress: 'grandpa fooey',
  status: 'IN_PROGRESS',
  totalPrice: 23124.87,
};

export const sampleWithFullData: IClientOrder = {
  id: 19259,
  orderDate: dayjs('2024-10-24'),
  deliveryDate: dayjs('2024-10-24'),
  deliveryAddress: 'hourly rarely',
  status: 'SHIPPED',
  totalPrice: 10525.48,
};

export const sampleWithNewData: NewClientOrder = {
  orderDate: dayjs('2024-10-23'),
  deliveryDate: dayjs('2024-10-24'),
  deliveryAddress: 'minority pendant front',
  status: 'CANCELLED',
  totalPrice: 4064.93,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
