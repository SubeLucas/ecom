import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    console.log('demande backend');
  }

  onButtonClick(): void {
    this.router.navigate(['']);
  }
}
