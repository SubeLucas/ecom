import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IAliment } from 'app/entities/aliment/aliment.model';

@Component({
  selector: 'jhi-card-product',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss',
})
export class CardProductComponent {
  @Input() priceProduct!: number | null | undefined;
  @Input() product: IAliment | undefined;
  @Input() inCart: boolean | undefined;

  quantity = 2;
  maxQuantity = 99;

  totalPriceProduct = this.quantity * this.priceProduct!;

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
    this.totalPriceProduct = this.quantity * this.priceProduct!;
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

  isSeasonProduct(season: number | null | undefined): boolean {
    if (season === null || undefined) return false;
    return season === 16795;
  }
}
