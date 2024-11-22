import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { PDFService } from 'app/core/util/PDF.service';

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
    private httpPayment: PaymentService,
    private httpCart: CartService,
    private pdfService: PDFService,
  ) {}

  onButtonClick(): void {
    this.router.navigate(['cart']);
  }

  onPayButtonClick(): void {
    // envoyer le panier au backend
    this.httpCart.validate(Cart.getCart()).subscribe(order => {
      if (order > 0) {
        console.log('Panier accepté, order n°', order);
        // TODO envoyer le numéro de carte du formulaire
        this.httpPayment.pay('5155123456789108').subscribe(success => {
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
