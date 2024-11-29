import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { PDFService } from 'app/core/util/PDF.service';
import { ClientOrderService } from '../entities/client-order/service/client-order.service';

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
    private clientOrderService: ClientOrderService,
  ) {}

  onButtonClick(): void {
    this.router.navigate(['cart']);
  }

  onPayButtonClick(): void {
    // envoyer le panier au backend
    this.httpCart.validate(Cart.getCart()).subscribe({
      next: order => {
        if (order > 0) {
          console.log('Panier accepté, order n°', order);
          this.httpPayment.pay(this.numCard).subscribe({
            next: success => {
              if (success) {
                console.log('Numéro de carte accepté');
                this.pdfService.generatePDF(order);
                Cart.clearCart();
              } else {
                console.log('Numéro de carte refusé');
                //notifier au backend que la commande doit etre CANCELLED
                this.clientOrderService.cancel(order).subscribe({
                  next: response => {
                    console.log('Commande annulée avec succès');
                  },
                  error: error => {
                    console.error("Erreur lors de l'annulation de la commande", error);
                  },
                });
              }
            },
            error: error => {
              console.error('Erreur lors du paiement', error);
            },
          });
        } else {
          console.log('Panier refusé');
          this.router.navigate(['cart']);
        }
      },
      error: error => {
        console.error('Erreur lors de la validation du panier', error);
      },
    });
  }
}
