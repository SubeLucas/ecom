import { IClientOrder } from 'app/entities/client-order/client-order.model';
import { IAliment } from 'app/entities/aliment/aliment.model';

export interface IOrderLine {
  id: number;
  quantity?: number | null;
  purchasePrice?: number | null;
  clientOrder?: IClientOrder | null;
  aliment?: IAliment | null;
}

export type NewOrderLine = Omit<IOrderLine, 'id'> & { id: null };
