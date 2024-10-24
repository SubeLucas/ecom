import { IUser } from 'app/entities/user/user.model';

export interface IClient {
  id: number;
  preferedDay?: string | null;
  address?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
