import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { Cart } from '../cart/cart.model';

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
<<<<<<< HEAD
<<<<<<< HEAD
  @Input() inCart: boolean | undefined;
=======
>>>>>>> 86cf773 (petite modification)
=======
  @Input() inCart: boolean | undefined;
>>>>>>> 4d50a73 (Affichage produits panier en mode cart)

  quantity = -1;
  maxQuantity = 99;

  totalPriceProduct = this.quantity * this.priceProduct!;
  ngOnInit(): void {
    const cart = Cart.getCart();
    if (this.product) {
      this.quantity = Cart.getItemQuantity(this.product.id);
    }
    if (this.quantity > this.maxQuantity) {
      this.quantity = this.maxQuantity;
    }
    this.updateTotalPriceProduct();
  }

  minusQuantity(): void {
    if (this.quantity !== 0) {
      this.quantity--;
      this.updateTotalPriceProduct();
      if (this.product) {
        Cart.setItemQuantity(this.product.id, this.quantity);
        if (this.quantity === 0) {
          Cart.removeItem(this.product.id);
        }
      }
    }
  }

  plusQuantity(): void {
    if (this.quantity !== this.maxQuantity) {
      this.quantity++;
      this.updateTotalPriceProduct();
      if (this.product) {
        Cart.setItemQuantity(this.product.id, this.quantity);
      }
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

  isSeasonProduct(season: number): boolean {
    return season === 32435;
  }
}
