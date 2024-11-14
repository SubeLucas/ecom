import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from './cart.model';
import { AlimentService } from '../entities/aliment/service/aliment.service';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private router = inject(Router);

  constructor(private http: AlimentService) {}

  ngOnInit(): void {
    const cart = Cart.getCart();
    const stockMap = new Map<number, number>();

    for (const item of cart.cartItems) {
      this.http.getStock(item.id).subscribe(quantity => {
        stockMap.set(item.id, quantity.body != null ? quantity.body : -1);
        console.log(stockMap);
      });
    }

    // appel initial à scan()
  }

  scan(): void {
    // analyser les quantités dans le panier et dans la Map
    // si une quantité n'est pas bonne, griser le bouton de validation,
    // afficher une info pour le user (message dans console pour commencer) et passer au prochain
    // attendre le composant IHM pour appeler cette fonction lorsque les boutons +/- sont cliqués
  }

  onButtonClick(): void {
    this.router.navigate(['']);
  }

  onValidateButtonClick(): void {
    // placeholder, envoyer le panier au backend dès maintenant
    // plus tard, naviguer vers la page suivante
  }
}
