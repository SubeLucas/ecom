import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

// temporary imports for cart validation tests
import { CartService } from '../cart/cart.service';
import { Cart, CartItem } from '../cart/cart.model';
import { CardProductComponent } from '../card-product/card-product.component';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, CardProductComponent],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  private item = new CartItem(0, 0);
  /*aliments = [{id: 1, name: 'a'},
  {id: 2, name: 'b'},
  {id: 3, name: 'c'},
  {id: 4, name: 'd'}];*/

  constructor(private http: CartService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // temporary button handler for cart validation tests
  onButtonClick(): void {
    this.http.validate(Cart.getCart()).subscribe(success => {
      console.log(success);
    });
  }

  onAddPommeButtonClick(): void {
    this.item = new CartItem(4, 5);
    Cart.addItem(this.item);
  }

  onAddBananeButtonClick(): void {
    this.item = new CartItem(9, 3);
    Cart.addItem(this.item);
  }

  isCartEmpty(): boolean {
    return Cart.isEmpty();
  }

  onCartButtonClick(): void {
    this.router.navigate(['/cart']);
  }
}
