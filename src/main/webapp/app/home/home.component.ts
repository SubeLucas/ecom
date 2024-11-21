import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { IAliment } from '../entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';

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
  aliments: IAliment[] = [];

  constructor(
    private httpCart: CartService,
    private httpAliment: AlimentService,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.httpAliment.all().subscribe(aliments => {
      this.aliments = aliments.body != null ? aliments.body : [];
    });
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
    this.http
      .validate(new Cart([new CartItem(1, 5), new CartItem(2, 1), new CartItem(2, 1), new CartItem(3, 1), new CartItem(4, 1)]))
      .subscribe(success => {
        if (success > 0) {
          console.log(success);
          this.PDFService.generatePDF(success);
        }
        // else page d'erreur

        console.log(success);
      });
  }

  onAddPommeButtonClick(): void {
    this.item = new CartItem(4, 100);
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
