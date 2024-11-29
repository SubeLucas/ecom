import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-delivery',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent {
  private router = inject(Router);
  street = '';
  code = '';
  city = '';

  onValidateButtonClick(): void {
    // envoyer infos livraison au backend "street+', '+'code+' '+city" ?
    this.router.navigate(['payment']);
  }
}
