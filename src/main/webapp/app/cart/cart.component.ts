import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from './cart.model';
import { AlimentService } from '../entities/aliment/service/aliment.service';
import { CardProductComponent } from '../card-product/card-product.component';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { NgFor } from '@angular/common';
import { PDFService } from '../core/util/PDF.service';
import { CartService } from '../cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule, CardProductComponent, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  aliments: IAliment[] = [];
  stockMap = new Map<number, number>();
  private cartSubscription: Subscription;
  private cart: Cart;
  constructor(
    private http: AlimentService,
    private pdfService: PDFService,
    private httpCart: CartService,
  ) {
    this.cartSubscription = Cart.getCartChangedObservable().subscribe(() => {
      this.loadCartItems();
    });
    //this.cart = Cart.getCart();
  }

  ngOnInit(): void {
    this.cart = Cart.getCart();
    for (const item of this.cart.cartItems) {
      this.http.find(item.id).subscribe(aliment => {
        if (aliment.body) {
          this.aliments.push(aliment.body);
          this.stockMap.set(item.id, item.qt);
        } else {
          console.log(`ERREUR : impossible de récupérer l'aliment d'id ${item.id}`);
        }
      });
    }

    console.log(this.aliments);
    this.scan();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private loadCartItems(): void {
    this.cart = Cart.getCart();
  }

  scan(): boolean {
    const cart = Cart.getCart();
    let invalid = false;
    // todo : pas sur de la condition du if là
    if (!cart) {
      console.log('Cart vide');
      return true;
    }
    // attendre le composant IHM pour appeler cette fonction lorsque les boutons +/- sont cliqués
    let invalid = false;
    for (const aliment of this.aliments) {
      const quantity = this.stockMap.get(aliment.id)!;
      if (aliment.stockQuantity! < quantity) {
        console.log(`Aliment d'id ${aliment.id} n'a plus que ${aliment.stockQuantity} exemplaires en stock`);
        invalid = true;
      }
    }

    return invalid;
  }

  onButtonClick(): void {
    this.router.navigate(['']);
  }

  onValidateButtonClick(): void {
    this.router.navigate(['payment']);
  }
}
