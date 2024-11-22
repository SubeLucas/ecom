import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Cart } from '../cart/cart.model';
import { PDFService } from '../core/util/PDF.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'jhi-payment',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  private router = inject(Router);

  constructor(
    private pdfService: PDFService,
    private httpCart: CartService,
  ) {}

  onButtonClick(): void {
    this.router.navigate(['cart']);
  }

  onPayButtonClick(): void {
    // TODO envoyer le numéro de carte au backend

    // TODO si numéro de carte accepté, envoyer le panier au backend
    this.httpCart.validate(Cart.getCart()).subscribe(order => {
      if (order > 0) {
        console.log(order);
        this.pdfService.generatePDF(order);
      } else {
        this.router.navigate(['cart']);
      }
    });
  }
}
