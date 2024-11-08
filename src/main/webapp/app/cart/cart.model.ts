export class Cart {
  constructor(public cartItems: CartItem[]) {}

  static addItem(item: CartItem): void {
    let found = false;

    // recuperer le panier
    const data = JSON.parse(localStorage.getItem('cart')!);

    // modifier le panier
    for (const cartItem of data) {
      if (cartItem['id'] == item.id) {
        // aliment existe deja dans le panier
        let newQt = parseInt(cartItem['qt']);
        newQt += item.qt;
        cartItem['qt'] = newQt;
        found = true;
        break;
      }
    }
    // aliment n'existe pas dans le panier
    if (!found) {
      data.push(item);
    }

    // sauvegarder le panier modifie
    localStorage.setItem('cart', JSON.stringify(data));
  }
}

export class CartItem {
  constructor(
    public id: number,
    public qt: number,
  ) {}
}
