import { IAliment } from 'app/entities/aliment/aliment.model';

export interface IImages {
  id: number;
  url?: string | null;
  img?: string | null;
  aliment?: IAliment | null;
}

export type NewImages = Omit<IImages, 'id'> & { id: null };
