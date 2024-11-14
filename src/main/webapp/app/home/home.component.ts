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
import { PDFService } from '../core/util/PDF.service';

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

  private item = new CartItem(0, 0);

  //constructor(private http: CartService) {}
  constructor(
    private http: CartService,
    private PDFService: PDFService,
  ) {}
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
    this.http
      .validate(new Cart([new CartItem(1, 5), new CartItem(2, 1), new CartItem(2, 1), new CartItem(3, 1), new CartItem(4, 1)]))
      .subscribe(success => {
        this.PDFService.generatePDF(success);

        console.log(success);
      });
  }

  onAddPommeButtonClick(): void {
    this.item = new CartItem(1, 5);
    Cart.addItem(this.item.toString());
  }

  onAddBananeButtonClick(): void {
    this.item = new CartItem(2, 3);
    Cart.addItem(this.item.toString());
  }

  isCartEmpty(): boolean {
    return localStorage.getItem('cart') === null;
  }
}
