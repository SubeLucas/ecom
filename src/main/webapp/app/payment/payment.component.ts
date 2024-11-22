import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { PDFService } from 'app/core/util/PDF.service';

@Component({
  selector: 'jhi-payment',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  private router = inject(Router);
  numCard = '';

  constructor(
    private httpPayment: PaymentService,
    private httpCart: CartService,
    private pdfService: PDFService,
  ) {}

  onButtonClick(): void {
    this.router.navigate(['cart']);
  }

  onPayButtonClick(): void {
    console.log('Check formulaire :', this.numCard);
    // envoyer le panier au backend
    this.httpCart.validate(Cart.getCart()).subscribe(order => {
      if (order > 0) {
        console.log('Panier accepté, order n°', order);
        // TODO envoyer le numéro de carte du formulaire
        this.httpPayment.pay(this.numCard).subscribe(success => {
          if (success) {
            console.log('Numéro de carte accepté');
            this.pdfService.generatePDF(order);
          } else {
            console.log('Numéro de carte refusé');
            // TODO notifier au backend que la commande doit etre CANCELLED
          }
        });
      } else {
        console.log('Panier refusé');
        this.router.navigate(['cart']);
      }
    });
  }
}
