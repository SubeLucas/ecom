import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'jhi-card-product',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss',
})
export class CardProductComponent {
  titleProduct = 'Tomate';
  weightProduct = '0,99g';
  priceKiloProduct = '6,78€/kg';
  originroduct = 'France';
  priceProduct = '1,80€';
  isSeasonProduct = false;
  quantity = 0;
  maxQuantity = 99;

  minusQuantity(): void {
    if (this.quantity !== 0) {
      this.quantity--;
    }
  }

  plusQuantity(): void {
    if (this.quantity !== this.maxQuantity) {
      this.quantity++;
    }
  }
}
