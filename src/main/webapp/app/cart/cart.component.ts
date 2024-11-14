import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from './cart.model';
import { AlimentService } from '../entities/aliment/service/aliment.service';
import { CardProductComponent } from '../card-product/card-product.component';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule, CardProductComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  private cart = new Cart([]);
  private stockMap = new Map<number, number>();

  constructor(private http: AlimentService) {}

  ngOnInit(): void {
    this.cart = Cart.getCart();

    for (const item of this.cart.cartItems) {
      this.http.getStock(item.id).subscribe(quantity => {
        this.stockMap.set(item.id, quantity.body != null ? quantity.body : -1);
      });
    }

    console.log(this.stockMap);
    this.scan();
  }

  scan(): boolean {
    // attendre le composant IHM pour appeler cette fonction lorsque les boutons +/- sont cliqués
    let invalid = false;
    for (const item of this.cart.cartItems) {
      if (item.qt > this.stockMap.get(item.id)!) {
        console.log('Item id ' + item.id.toString() + " n'a plus que " + this.stockMap.get(item.id)!.toString() + ' exemplaires en stock');
        invalid = true;
      }
    }

    return invalid;
  }

  onButtonClick(): void {
    this.router.navigate(['']);
  }

  onValidateButtonClick(): void {
    // placeholder, envoyer le panier au backend dès maintenant
    // plus tard, naviguer vers la page suivante
  }
}
