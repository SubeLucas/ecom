import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { Cart } from '../cart/cart.model';
import { IImages } from 'app/entities/images/images.model';
import { ImagesService } from 'app/entities/images/service/images.service';

@Component({
  selector: 'jhi-card-product',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent {
  @Input() priceProduct!: number | null | undefined;
  @Input() product: IAliment | undefined;
  @Input() inCart: boolean | undefined;
  @Output() quantityChanged = new EventEmitter<void>();

  quantity = -1;
  maxQuantity = 99;

  totalPriceProduct = this.quantity * this.priceProduct!;
  imagesService = inject(ImagesService);
  public image: IImages | null = null;

  ngOnInit(): void {
    const cart = Cart.getCart();
    if (this.product) {
      this.quantity = Cart.getItemQuantity(this.product.id);
      this.imagesService.findByAlimentId(this.product.id).subscribe(response => {
        this.image = response.body;
      });
    }
    if (this.quantity > this.maxQuantity) {
      this.quantity = this.maxQuantity;
    }
    this.updateTotalPriceProduct();
  }

  getImageUrl(): string {
    return this.image && this.image.url ? this.image.url : '../../content/images/tomate.png';
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
      this.quantityChanged.emit();
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
    if (this.product) {
      Cart.removeItem(this.product.id);
    }
    this.quantityChanged.emit();
  }

  updateTotalPriceProduct(): void {
    this.totalPriceProduct = this.quantity * this.priceProduct!;
    this.quantityChanged.emit();
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
      if (+el.value < 0) {
        el.value = '1';
      } else if (+el.value > this.maxQuantity) {
        el.value = this.maxQuantity.toString();
      }
      this.quantity = +el.value;
      if (this.product) {
        Cart.setItemQuantity(this.product.id, this.quantity);
      }
      this.updateTotalPriceProduct();
      this.quantityChanged.emit();
    }
  }

  onBlur(event: Event): void {
    const element = event.target as HTMLInputElement;
    console.warn(element.value);
    if (element.value == '') {
      element.value = this.quantity.toString();
    }
    this.quantityChanged.emit();
  }

  isSeasonProduct(season: number | null | undefined): boolean {
    if (season === null || undefined) return false;
    return season === 16795;
  }
}
