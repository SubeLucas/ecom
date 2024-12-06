import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { ClientOrderService } from '../entities/client-order/service/client-order.service';
import { Payment } from './payment.model';

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
    private clientOrderService: ClientOrderService,
  ) {}

  onButtonClick(): void {
    this.router.navigate(['cart']);
  }

  onPayButtonClick(): void {
    // re-limiter les quantités à maxQuantity si un petit malin a changé des valeurs à la main dans localStorage
    const cart = Cart.getCart();
    for (const item of cart.cartItems) {
      item.qt = item.qt > 99 ? 99 : item.qt;
    }
    // envoyer la commande au backend
    if (!localStorage.getItem('deliveryYear') || !localStorage.getItem('deliveryMonth') || !localStorage.getItem('deliveryDay')) {
      alert('Date de livraison erronée');
      this.router.navigate(['delivery']);
    }
    const deliveryDate = [
      JSON.parse(localStorage.getItem('deliveryYear')!),
      JSON.parse(localStorage.getItem('deliveryMonth')!),
      JSON.parse(localStorage.getItem('deliveryDay')!),
    ];
    const payment = new Payment(cart, deliveryDate);
    this.httpPayment.sendOrder(payment).subscribe({
      next: order => {
        if (order > 0) {
          console.log('Panier accepté, order n°', order);
          this.httpPayment.pay(this.numCard).subscribe({
            next: success => {
              if (success) {
                console.log('Numéro de carte accepté');
                this.router.navigate(['/payment-success'], { queryParams: { order: order } });
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
        } else if (order == -1) {
          console.log('Panier invalide');
          this.router.navigate(['cart']);
        } else if (order == -2) {
          alert('Une erreur est survenue. Veuillez réessayer.');
        } else if (order == -3) {
          console.log('Manque de stock');
          this.router.navigate(['cart']);
        } else if (order == -4) {
          alert('Date de livraison refusée');
          this.router.navigate(['delivery']);
        }
      },
      error: error => {
        console.error('Erreur lors de la validation du panier', error);
        alert('Erreur lors de la validation du panier');
        this.router.navigate(['cart']);
      },
    });
  }
}
