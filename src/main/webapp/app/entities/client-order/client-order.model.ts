import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { EnumStatus } from 'app/entities/enumerations/enum-status.model';

export interface IClientOrder {
  id: number;
  orderDate?: dayjs.Dayjs | null;
  deliveryDate?: dayjs.Dayjs | null;
  deliveryAddress?: string | null;
  status?: keyof typeof EnumStatus | null;
  totalPrice?: number | null;
  client?: IClient | null;
}

export type NewClientOrder = Omit<IClientOrder, 'id'> & { id: null };
