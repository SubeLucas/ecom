import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { IAliment } from '../entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';

// temporary imports for cart validation tests
import { CartService } from '../cart/cart.service';
import { Cart, CartItem } from '../cart/cart.model';
import { CardProductComponent } from '../card-product/card-product.component';
import { PDFService } from '../core/util/PDF.service';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, CardProductComponent, FormsModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  inputValue = '';
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];
  filteredAliments: IAliment[] = [];
  searchKeyword = '';

  isCatCollapsed = signal(true);

  constructor(
    private httpCart: CartService,
    private httpAliment: AlimentService,
    private pdfService: PDFService,
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
    this.httpCart.validate(Cart.getCart()).subscribe(success => {
      console.log(success);
    });
  }

  onAddPommeButtonClick(): void {
    this.item = new CartItem(4, 1);
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

  isCollapse(): void {
    this.router.navigate(['/cart']);
  }

  toggleNavbar(): void {
    this.isCatCollapsed.update(isCatCollapsed => !isCatCollapsed);
  }

  onWheel(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;

    if (event.deltaY !== 0) {
      event.preventDefault();

      container.scrollLeft += event.deltaY;
    }
  }

  onSearch(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (keyword) {
      this.filteredAliments = this.aliments.filter(
        aliment => aliment.name?.toLowerCase().includes(keyword) || aliment.origin?.toLowerCase().includes(keyword),
      );
    } else {
      this.filteredAliments = this.aliments;
    }
  }
}
