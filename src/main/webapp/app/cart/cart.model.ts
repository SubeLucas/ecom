import { Subject } from 'rxjs';

export class Cart {
  private static cartChanged: Subject<void> = new Subject<void>();

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
    //this.cartChanged.next();
  }

  static getItemQuantity(itemId: number): number {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return 0;
    }
    try {
      const parsedCart = JSON.parse(cart) as CartItem[];
      for (const cartItem of parsedCart) {
        if (cartItem.id === itemId) {
          return cartItem.qt;
        }
      }
      return 0; // Si l'élément n'est pas trouvé
    } catch (e) {
      console.error('Invalid JSON in localStorage:', e);
      return 0;
    }
  }

  static setItemQuantity(itemId: number, newQt: number): void {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return;
    }
    try {
      const parsedCart = JSON.parse(cart) as CartItem[];
      let found = false;
      for (const cartItem of parsedCart) {
        if (cartItem.id === itemId) {
          cartItem.qt = newQt;
          found = true;
          break;
        }
      }
      if (found) {
        localStorage.setItem('cart', JSON.stringify(parsedCart));
      } else {
        const newItem = new CartItem(itemId, newQt);
        this.addItem(newItem);
      }
    } catch (e) {
      console.error('Invalid JSON in localStorage:', e);
    }
    if (newQt === 0) {
      this.cartChanged.next();
    }
  }

  static removeItem(itemId: number): void {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return;
    }
    try {
      const parsedCart = JSON.parse(cart) as CartItem[];
      const updatedCart = parsedCart.filter(cartItem => cartItem.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Invalid JSON in localStorage:', e);
    }
    this.cartChanged.next();
  }

  static getCartChangedObservable(): Subject<void> {
    return this.cartChanged;
  }

  static clearCart(): void {
    localStorage.setItem('cart', JSON.stringify([]));
    this.cartChanged.next();
  }
}

export class CartItem {
  constructor(
    public id: number,
    public qt: number,
  ) {}
}
