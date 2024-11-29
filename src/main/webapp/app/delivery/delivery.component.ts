import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AccountService } from 'app/core/auth/account.service';
import { ClientService } from 'app/entities/client/service/client.service';

@Component({
  selector: 'jhi-delivery',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  private router = inject(Router);
  private accountService = inject(AccountService);
  street = '';
  code = '';
  city = '';

  constructor(private http: ClientService) {}

  ngOnInit(): void {
    if (this.accountService.isAuthenticated()) {
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
