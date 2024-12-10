import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AccountService } from 'app/core/auth/account.service';
import { ClientService } from 'app/entities/client/service/client.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';

interface AlimentWithQuantity {
  aliment: IAliment;
  quantity: number;
}

@Component({
  selector: 'jhi-delivery',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf, BreadcrumbModule, NgFor],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [{ label: 'Mon panier', routerLink: '../cart' }, { label: 'Informations de livraison' }];
  private router = inject(Router);
  private accountService = inject(AccountService);
  aliments: IAliment[] = [];
  alimentsWithQuantityInCart: AlimentWithQuantity[] = [];
  alimentsInCart: IAliment[] = [];
  alimentsIdInCart: number[] = [];
  alimentsQuantityInCart: number[] = [];

  protected readonly localStorage = localStorage;

  street = '';
  code = '';
  city = '';
  lastName = '';
  firstName = '';
  email = '';
  selectedDate = '';
  minDate = '';
  maxDate = '';

  constructor(
    private http: ClientService,
    private httpAliment: AlimentService,
  ) {}

  ngOnInit(): void {
    if (this.accountService.isAuthenticated()) {
      // récupérer mois et année actuelle
      const currentDate = new Date();

      // Calcul de la date min (aujourd'hui + 2 jours)
      const minDate = new Date();
      minDate.setDate(currentDate.getDate() + 2);
      this.minDate = minDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

      // Calcul de la date maximale (aujourd'hui + 1 mois)
      const maxDate = new Date();
      maxDate.setMonth(currentDate.getMonth() + 1);
      this.maxDate = maxDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

      // récupérer les infos du client connecté
      this.accountService.identity().subscribe(account => {
        if (account) {
          this.firstName = account.firstName!;
          this.lastName = account.lastName!;
          this.email = account.email!;
        }
      });
      this.http.findCurrent().subscribe({
        next: client => {
          if (client.body) {
            const address = client.body.address;
            console.log(address);
            this.street = address!.split(', ')[0];
            this.code = address!.split(', ')[1].split(' ')[0];
            this.city = address!.split(', ')[1].split(' ')[1];
          }
        },
      });
    }

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

  onValidateButtonClick(): void {
    if (this.accountService.isAuthenticated()) {
      // enregistrement de la date de livraison dans le cache
      const [year, month, day] = this.selectedDate.split('-');
      localStorage.setItem('deliveryDay', day);
      localStorage.setItem('deliveryMonth', month);
      localStorage.setItem('deliveryYear', year);
      // mise à jour adresse de livraison du client connecté
      this.http.findCurrent().subscribe({
        next: client => {
          if (client.body) {
            client.body.address = this.street + ', ' + this.code + ' ' + this.city;
            this.http.update(client.body).subscribe({
              next: newClient => {
                console.log(newClient.body);
              },
              error: error => {
                console.error('Erreur lors de la récupération du client courant mis à jour', error);
              },
            });
          } else {
            console.warn('Pas de client connecté actuellement');
          }
        },
        error: error => {
          console.error('Erreur lors de la récupération du client courant', error);
        },
      });

      this.router.navigate(['payment']);
    } else {
      this.router.navigate(['login']);
    }
  }

  validateDate(dateField: NgModel): void {
    dateField.control.setErrors(null);
    const dateValue = this.selectedDate;
    if (dateValue < this.minDate) {
      dateField.control.setErrors({ min: true });
    } else if (dateValue > this.maxDate) {
      dateField.control.setErrors({ max: true });
    } else {
      dateField.control.setErrors(null); // Réinitialise les erreurs si tout est OK
    }
  }
}
