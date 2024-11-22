import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from './cart.model';
import { AlimentService } from '../entities/aliment/service/aliment.service';
import { CardProductComponent } from '../card-product/card-product.component';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { NgFor } from '@angular/common';
import { PDFService } from '../core/util/PDF.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule, CardProductComponent, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  aliments: IAliment[] = [];
  stockMap = new Map<number, number>();

  constructor(
    private http: AlimentService,
    private pdfService: PDFService,
    private httpCart: CartService,
  ) {}

  ngOnInit(): void {
    const cart = Cart.getCart();

    for (const item of cart.cartItems) {
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

  scan(): boolean {
    const cart = Cart.getCart();
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
    // placeholder, envoyer le panier au backend dès maintenant
    // plus tard, naviguer vers la page suivante
    // placeholder, envoyer le panier au backend dès maintenant
    // plus tard, naviguer vers la page suivante
    this.httpCart.validate(Cart.getCart()).subscribe(success => {
      //console.log('Validate cart : ' + JSON.stringify(Cart));
      if (success > 0) {
        console.log(success);
        this.pdfService.generatePDF(success);
      }
      // else page d'erreur
    });
  }
}
