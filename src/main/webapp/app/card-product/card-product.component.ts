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
  originProduct = 'France';
  priceProduct = 1.8;
  isSeasonProduct = false;
  quantity = 2;
  maxQuantity = 99;
  inCart = false;

  totalPriceProduct = this.quantity * this.priceProduct;

  minusQuantity(): void {
    if (this.quantity !== 0) {
      this.quantity--;
      this.updateTotalPriceProduct();
    }
  }

  plusQuantity(): void {
    if (this.quantity !== this.maxQuantity) {
      this.quantity++;
      this.updateTotalPriceProduct();
    }
  }

  deleteArticleFromCart(): void {
    this.quantity = 0;
  }

  updateTotalPriceProduct(): void {
    this.totalPriceProduct = this.quantity * this.priceProduct;
  }
}
