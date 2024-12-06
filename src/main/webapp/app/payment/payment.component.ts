import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { PDFService } from 'app/core/util/PDF.service';
import { ClientOrderService } from '../entities/client-order/service/client-order.service';

@Component({
  selector: 'jhi-payment',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf, BreadcrumbModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  private router = inject(Router);
  breadcrumbItems: MenuItem[] = [
    { label: 'Mon Panier', routerLink: '../cart' },
    { label: 'Informations de Livraison', routerLink: '../delivery' },
    { label: 'Paiement' },
  ]; // Les éléments du fil d'Ariane
  numCard = '';
  errorMsg = '';

  constructor(
    private httpPayment: PaymentService,
    private httpCart: CartService,
    //private pdfService: PDFService,
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
    // envoyer le panier au backend
    this.httpCart.validate(cart).subscribe({
      next: order => {
        if (order > 0) {
          console.log('Panier accepté, order n°', order);
          this.httpPayment.pay(this.numCard).subscribe({
            next: success => {
              if (success) {
                console.log('Numéro de carte accepté');
                this.router.navigate(['/payment-success'], { queryParams: { order: order } });
                //this.pdfService.generatePDF(order);
                Cart.clearCart();
              } else {
                this.errorMsg = 'Numéro de carte refusé';
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
              console.log(error);
              this.errorMsg = 'Erreur lors du paiement';
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
        }
      },
      error: error => {
        console.log(error);
        this.errorMsg = 'Erreur lors de la validation du panier';
        this.router.navigate(['cart']);
      },
    });
  }
}
