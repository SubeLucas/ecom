import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PaymentService } from '../payment/payment.service';
import { Cart } from '../cart/cart.model';
import { ClientOrderService } from '../entities/client-order/service/client-order.service';
import { Payment } from './payment.model';
import { Title } from '@angular/platform-browser';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { IAliment } from 'app/entities/aliment/aliment.model';

interface AlimentWithQuantity {
  aliment: IAliment;
  quantity: number;
}

@Component({
  selector: 'jhi-payment',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf, BreadcrumbModule, NgFor],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  protected readonly localStorage = localStorage;
  private router = inject(Router);
  breadcrumbItems: MenuItem[] = [
    { label: 'Mon panier', routerLink: '../cart' },
    { label: 'Informations de livraison', routerLink: '../delivery' },
    { label: 'Paiement' },
  ]; // Les éléments du fil d'Ariane
  numCard = '';
  errorMsg = '';
  owner = '';
  expDate = '';
  ccv = '';
  private titleService = inject(Title);
  aliments: IAliment[] = [];
  alimentsWithQuantityInCart: AlimentWithQuantity[] = [];
  alimentsInCart: IAliment[] = [];
  alimentsIdInCart: number[] = [];
  alimentsQuantityInCart: number[] = [];

  constructor(
    private httpPayment: PaymentService,
    private clientOrderService: ClientOrderService,
    private httpAliment: AlimentService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Cueillette - Paiement');
    this.httpAliment.all().subscribe(aliments => {
      this.aliments = aliments.body != null ? aliments.body : [];

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.forEach((item: { id: number; qt: number }) => {
        this.alimentsIdInCart.push(item.id);
        this.alimentsQuantityInCart.push(item.qt);
      });
      console.log(this.alimentsIdInCart);
      this.alimentsInCart = this.aliments
        .filter(aliment => this.alimentsIdInCart.includes(aliment.id))
        .sort((a, b) => {
          return this.alimentsIdInCart.indexOf(a.id) - this.alimentsIdInCart.indexOf(b.id);
        });
      console.log(this.alimentsInCart);
      for (let i = 0; i < this.alimentsInCart.length; i++) {
        this.alimentsWithQuantityInCart.push({
          aliment: this.alimentsInCart[i],
          quantity: this.alimentsQuantityInCart[i],
        });
      }
      console.log(this.alimentsWithQuantityInCart);
    });
  }

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
                localStorage.setItem('totalPrice', '0');
                localStorage.setItem('totalQuantity', '0');
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
        } else if (order == -4) {
          alert('Date de livraison refusée');
          this.router.navigate(['delivery']);
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
