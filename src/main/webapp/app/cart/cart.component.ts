import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cart } from './cart.model';
import { AlimentService } from '../entities/aliment/service/aliment.service';
import { CardProductComponent } from '../card-product/card-product.component';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { Title } from '@angular/platform-browser';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule, CardProductComponent, NgFor, SharedModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  aliments: IAliment[] = [];
  stockMap = new Map<number, number>();
  private cartSubscription: Subscription;
  private cart: Cart;
  totalPrice = 0;
  private accountService = inject(AccountService);
  private titleService = inject(Title);

  protected readonly localStorage = localStorage;

  constructor(private http: AlimentService) {
    this.cartSubscription = Cart.getCartChangedObservable().subscribe(() => {
      this.loadCartItems();
    });
    this.cart = Cart.getCart();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Cueillette - Panier');
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private loadCartItems(): void {
    this.aliments = [];
    this.stockMap.clear();
    this.totalPrice = 0;
    this.cart = Cart.getCart();
    for (const item of this.cart.cartItems) {
      if (item.qt > 0) {
        this.http.find(item.id).subscribe(aliment => {
          if (aliment.body) {
            this.aliments.push(aliment.body);
            this.stockMap.set(item.id, aliment.body.stockQuantity!);
            if (aliment.body.price) {
              this.totalPrice += aliment.body.price * item.qt;
            }
          } else {
            console.log(`ERREUR : impossible de récupérer l'aliment d'id ${item.id}`);
          }
        });
      }
      if (item.qt == 0) {
        Cart.removeItem(item.id);
      }
    }
  }

  updateTotalPrice(): void {
    this.totalPrice = 0;
    const cart = Cart.getCart();
    for (const item of cart.cartItems) {
      const aliment = this.aliments.find(a => a.id === item.id);
      if (aliment && aliment.price) {
        this.totalPrice += aliment.price * item.qt;
      }
    }
    // this.cartService.updateTotalPrice(this.totalPrice);
    console.log(`New totalPrice: ${this.totalPrice}`);
  }

  scan(): boolean {
    let valid = true;
    if (Cart.isEmpty()) {
      console.log('Cart vide');
      valid = false;
    }
    for (const aliment of this.aliments) {
      const quantity = Cart.getItemQuantity(aliment.id);
      console.log(quantity, this.stockMap.get(aliment.id)!);
      if (quantity > this.stockMap.get(aliment.id)!) {
        valid = false;
      }
    }
    return valid;
  }

  onButtonClick(): void {
    this.router.navigate(['']);
  }

  onValidateButtonClick(): void {
    if (this.accountService.isAuthenticated()) {
      console.log(this.scan());
      if (this.scan()) {
        this.router.navigate(['delivery']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  onClearButtonClick(): void {
    const confirmClear = confirm('Êtes-vous sûr de vouloir vider votre panier ?');
    if (confirmClear) {
      this.aliments = [];
      Cart.clearCart();
      this.totalPrice = 0;
    }
  }

  onQuantityChanged(): void {
    this.updateTotalPrice();
  }

  protected readonly Cart = Cart;
}
