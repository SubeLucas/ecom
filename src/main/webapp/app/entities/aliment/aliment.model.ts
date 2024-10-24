import { EnumOrigin } from 'app/entities/enumerations/enum-origin.model';
import { EnumColor } from 'app/entities/enumerations/enum-color.model';

export interface IAliment {
  id: number;
  name?: string | null;
  origin?: keyof typeof EnumOrigin | null;
  season?: number | null;
  color?: keyof typeof EnumColor | null;
  weight?: number | null;
  stockQuantity?: number | null;
  price?: number | null;
}

export type NewAliment = Omit<IAliment, 'id'> & { id: null };
