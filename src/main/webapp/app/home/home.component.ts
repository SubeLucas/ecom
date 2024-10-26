import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

// temporary imports for cart validation tests
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  // temporary members for cart validation tests
  // private cartMap = new Map<number, number>();
  private cart = new Cart(new Map<number, number>());

  constructor(private http: CartService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    // temporary members for cart validation tests
    this.cart.cart.set(1, 8);
    this.cart.cart.set(6, 3);
    this.cart.cart.set(10, 1);
    // this.cart = new Cart(this.cartMap);
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
    // TODO use CartService
    // console.log(this.cart.map.get(1), this.cart.map.get(6), this.cart.map.get(10));
    this.http.validate(this.cart).subscribe(success => console.log(success));
  }
}
