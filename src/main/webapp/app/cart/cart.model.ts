import { IAliment, NewAliment } from '../entities/aliment/aliment.model';

export class Cart {
  constructor(
    public aliment: IAliment,
    public quantity: number,
  ) {}
}
