export class Cart {
  constructor(public cartItems: CartItem[]) {}
}

export class CartItem {
  constructor(
    public id: number,
    public qt: number,
  ) {}
}
