export class Cart {
  constructor(public cartItems: CartItem[]) {}

  static addItem(item: string): void {
    localStorage.setItem('cart', localStorage.getItem('cart') ? localStorage.getItem('cart')!.concat(';', item) : item);
  }
}

export class CartItem {
  constructor(
    public id: number,
    public qt: number,
  ) {}

  toString(): string {
    return this.id.toString(10).concat(',', this.qt.toString(10));
  }
}
