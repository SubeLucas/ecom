import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AccountService } from 'app/core/auth/account.service';
import { ClientService } from 'app/entities/client/service/client.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'jhi-delivery',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf, BreadcrumbModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  private router = inject(Router);
  private accountService = inject(AccountService);
  day = 0;
  month = 0;
  year = 0;
  street = '';
  code = '';
  city = '';
  breadcrumbItems: MenuItem[] = [{ label: 'Mon Panier', routerLink: '../cart' }, { label: 'Informations de Livraison' }];

  constructor(private http: ClientService) {}

  ngOnInit(): void {
    if (this.accountService.isAuthenticated()) {
      // récupérer mois et année actuelle
      const currentDate = new Date();
      this.month = currentDate.getMonth() + 1;
      this.year = currentDate.getFullYear();
      // récupérer l'adresse du client connecté
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
  }

  onValidateButtonClick(): void {
    if (this.accountService.isAuthenticated()) {
      // enregistrement de la date de livraison dans le cache
      localStorage.setItem('deliveryDay', this.day.toString());
      localStorage.setItem('deliveryMonth', this.month.toString());
      localStorage.setItem('deliveryYear', this.year.toString());
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
}
