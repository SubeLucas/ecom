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
  inCart = true;

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
    this.updateTotalPriceProduct();
  }

  updateTotalPriceProduct(): void {
    this.totalPriceProduct = this.quantity * this.priceProduct;
  }

  onInputChange(event: Event): void {
    const el = event.target as HTMLInputElement;
    const inputEvt = event as InputEvent;
    const inputEvtType = inputEvt.inputType;

    if (
      el.value &&
      (inputEvtType === 'insertText' ||
        inputEvtType === 'deleteContentBackward' ||
        inputEvtType === 'deleteContentForward' ||
        inputEvtType === 'historyUndo' ||
        inputEvtType === 'historyRedo' ||
        inputEvtType === 'insertFromPaste' ||
        inputEvtType === 'insertFromDrop')
    ) {
      this.quantity = +el.value;
      this.updateTotalPriceProduct();
    }
  }

  onBlur(event: Event): void {
    //Pour le moment prend le 1er id qt-input qu'il trouve sur toute la page
    //TODO corriger
    if (document.getElementById('qt-input')) {
      const element = document.getElementById('qt-input') as HTMLInputElement;
      console.warn(element.value);
      if (element.value == '') {
        element.value = this.quantity.toString();
      }
    }
  }
}
