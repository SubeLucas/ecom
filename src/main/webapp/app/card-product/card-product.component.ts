import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { Cart } from '../cart/cart.model';
import { IImages } from 'app/entities/images/images.model';
import { ImagesService } from 'app/entities/images/service/images.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'jhi-card-product',
  standalone: true,
  imports: [NgClass, NgIf, TitleCasePipe],
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
  priceByKg: string | undefined;

  totalPriceProduct = this.quantity * this.priceProduct!;
  totalPrice = 0;
  totalQuantity = 0;
  imagesService = inject(ImagesService);
  alimentsService = inject(AlimentService);
  public image: IImages | null = null;
  valid = true;

  ngOnInit(): void {
    const cart = Cart.getCart();
    if (this.product) {
      // récupérer la quantite dans le panier, ne jamais permettre plus de maxQuantity ou un négatif
      this.quantity = Cart.getItemQuantity(this.product.id);
      if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
        Cart.setItemQuantity(this.product.id, this.maxQuantity);
        this.quantityChanged.emit();
      }
      if (this.quantity < 0) {
        this.quantity = 0;
        this.quantityChanged.emit();
      }
      // récupérer le stock pour detecter une trop grosse quantite
      this.alimentsService.getStock(this.product.id).subscribe(response => {
        if (response.body) {
          this.product!.stockQuantity = response.body;
          if (this.quantity > this.product!.stockQuantity) {
            this.valid = false;
          }
        } else {
          this.valid = false;
        }
      });

      this.imagesService.findByAlimentId(this.product.id).subscribe(response => {
        this.image = response.body;
      });

      if (this.product.price && this.product.weight) {
        this.priceByKg = (this.product.price / (this.product.weight / 1000)).toFixed(2);
      }
    }
    // this.updateTotalPriceProduct();
    this.totalPriceProduct = this.quantity * this.priceProduct!;
    this.quantityChanged.emit();
  }

  getImageUrl(): string {
    return this.image && this.image.url ? this.image.url : '../../content/images/tomate.png';
  }

  minusQuantity(): void {
    if (this.quantity !== 0) {
      if (!(this.inCart && this.quantity == 1)) {
        this.quantity--;
        this.totalQuantity = localStorage.getItem('totalQuantity') ? parseInt(localStorage.getItem('totalQuantity')!) : 0;
        this.totalQuantity--;
        localStorage.setItem('totalQuantity', this.totalQuantity.toString());
      } else {
        this.deleteArticleFromCart();
        return;
      }

      this.updateTotalPriceProduct();
      if (this.product) {
        Cart.setItemQuantity(this.product.id, this.quantity);
        if (this.quantity === 0) {
          Cart.removeItem(this.product.id);
        }
        if (!this.valid && this.quantity <= this.product.stockQuantity!) {
          this.valid = true;
        }
      }
      this.quantityChanged.emit();
    }
  }

  plusQuantity(): void {
    this.quantity++;
    if (this.quantity > this.product!.stockQuantity!) {
      this.quantity--;
      return;
    }
    if (this.quantity > this.maxQuantity) {
      this.quantity--;
      return;
    }
    this.totalQuantity = localStorage.getItem('totalQuantity') ? parseInt(localStorage.getItem('totalQuantity')!) : 0;
    this.totalQuantity++;
    localStorage.setItem('totalQuantity', this.totalQuantity.toString());
    this.updateTotalPriceProduct();
    Cart.setItemQuantity(this.product!.id, this.quantity);
    this.quantityChanged.emit();
  }

  deleteArticleFromCart(): void {
    this.totalQuantity = localStorage.getItem('totalQuantity') ? parseInt(localStorage.getItem('totalQuantity')!) : 0;
    this.totalQuantity -= this.quantity;
    this.quantity = 0;
    localStorage.setItem('totalQuantity', this.totalQuantity.toString());
    this.updateTotalPriceProduct();
    if (this.product) {
      Cart.removeItem(this.product.id);
    }
    this.quantityChanged.emit();
  }

  updateTotalPriceProduct(): void {
    this.totalPrice = parseFloat(localStorage.getItem('totalPrice')!) || 0;
    this.totalPrice -= isNaN(this.totalPriceProduct) ? 0 : this.totalPriceProduct;
    this.totalPriceProduct = this.quantity * this.priceProduct!;
    this.totalPriceProduct = parseFloat(this.totalPriceProduct.toFixed(2)); //js
    this.totalPrice += this.totalPriceProduct;
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2)); // on est jamais assez sûr.es avec le js
    localStorage.setItem('totalPrice', this.totalPrice.toFixed(2));
    // localStorage.setItem('totalQuantity', this.totalQuantity.toString());
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
      if (+el.value <= 0) {
        this.deleteArticleFromCart();
        return;
      }
      if (+el.value > this.product!.stockQuantity!) {
        el.value = this.product!.stockQuantity!.toString();
      }
      if (+el.value > this.maxQuantity) {
        el.value = this.maxQuantity.toString();
      }
      this.totalQuantity = localStorage.getItem('totalQuantity') ? parseInt(localStorage.getItem('totalQuantity')!) : 0;
      this.totalQuantity -= this.quantity;
      this.quantity = +el.value;
      this.totalQuantity += this.quantity;
      localStorage.setItem('totalQuantity', this.totalQuantity.toString());
      Cart.setItemQuantity(this.product!.id, this.quantity);
      this.valid = this.quantity <= this.product!.stockQuantity!;
      this.updateTotalPriceProduct();
      this.quantityChanged.emit();
    }
  }

  onBlur(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.value == '') {
      element.value = this.quantity.toString();
    }
    this.quantityChanged.emit();
  }

  isSeasonProduct(season: number | null | undefined): boolean {
    if (season === null || undefined) return false;
    else {
      const currentDate = new Date();
      let currentMonth = currentDate.getMonth() + 1;
      currentMonth = 2 ** (12 - currentMonth);
      const result = (currentMonth & season!) === 1;
      return result;
    }
  }
}
