import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { Cart } from '../cart/cart.model';
import { IImages } from 'app/entities/images/images.model';
import { ImagesService } from 'app/entities/images/service/images.service';

@Component({
  selector: 'jhi-card-product',
  standalone: true,
  imports: [NgClass, NgIf],
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
  imagesService = inject(ImagesService);
  alimentsService = inject(AlimentService);
  public image: IImages | null = null;
  valid = true;

  ngOnInit(): void {
    const cart = Cart.getCart();
    if (this.product) {
      // récupérer la quantite dans le panier, ne jamais permettre plus de maxQuantity
      this.quantity = Cart.getItemQuantity(this.product.id);
      if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
        Cart.setItemQuantity(this.product.id, this.maxQuantity);
      }
      // récupérer le stock pour detecter une trop grosse quantite
      this.alimentsService.getStock(this.product.id).subscribe(response => {
        if (response.body) {
          this.product!.stockQuantity = response.body;
          if (this.quantity > this.product!.stockQuantity) {
            // TODO afficher un message dans la page panier
            console.log(`Aliment d'id ${this.product!.id} n'a plus que ${this.product!.stockQuantity} exemplaires en stock`);
            this.valid = false;
          }
        }
      });

      this.imagesService.findByAlimentId(this.product.id).subscribe(response => {
        this.image = response.body;
      });

      if (this.product.price && this.product.weight) {
        this.priceByKg = (this.product.price / (this.product.weight / 1000)).toFixed(2);
      }
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
        if (!this.valid && this.quantity <= this.product.stockQuantity!) {
          this.valid = true;
        }
      }
      this.quantityChanged.emit();
    }
  }

  plusQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
      this.updateTotalPriceProduct();
      if (this.product) {
        Cart.setItemQuantity(this.product.id, this.quantity);
        if (this.valid && this.quantity > this.product.stockQuantity!) {
          this.valid = false;
        }
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
        this.valid = this.quantity <= this.product.stockQuantity!;
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
