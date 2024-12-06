import { Cart } from '../cart/cart.model';

export class Payment {
  constructor(
    public cart: Cart,
    public deliveryDate: number[],
  ) {}
}
