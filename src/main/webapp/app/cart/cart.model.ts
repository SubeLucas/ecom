export class Cart {
  constructor(public cartItems: CartItem[]) {}

  static isEmpty(): boolean {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return true;
    }
    try {
      const parsedCart = JSON.parse(cart);
      return Array.isArray(parsedCart) && parsedCart.length === 0;
    } catch (e) {
      console.error('Invalid JSON in localStorage:', e);
      return true;
    }
  }

  static getCart(): Cart {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return new Cart([]);
    }
    try {
      const parsedCart = JSON.parse(cart);
      return new Cart(parsedCart);
    } catch (e) {
      console.error('Invalid JSON in localStorage:', e);
      return new Cart([]);
    }
  }

  static addItem(item: CartItem): void {
    let found = false;

    // récupérer le panier
    const data = JSON.parse(localStorage.getItem('cart')!) || [];

    // modifier le panier
    for (const cartItem of data) {
      if (cartItem['id'] == item.id) {
        // aliment existe déjà dans le panier
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

    // sauvegarder le panier modifié
    localStorage.setItem('cart', JSON.stringify(data));
  }
}

export class CartItem {
  constructor(
    public id: number,
    public qt: number,
  ) {}
}
