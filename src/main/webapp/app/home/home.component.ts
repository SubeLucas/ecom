import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { IAliment } from '../entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';

//import { BreadcrumbModule } from 'primeng/breadcrumb';

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
  imports: [SharedModule, RouterModule, CardProductComponent],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];

  isCatCollapsed = signal(false);
  isSelected = false;

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

  toggleNavbar(): void {
    this.isCatCollapsed.update(isCatCollapsed => !isCatCollapsed);
  }

  onApplyFilters(): void {
    //Récup ce qui est coché niveau catégories
    const test = [];
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        test.push(cbListElements[i].name);
      }
    }
    //Récup ce qui est indiqué nv prix

    //Appel apply
    console.warn(test);
  }

  onRemoveFilters(): void {
    //Supprimer coche catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      cbListElements[i].checked = false;
    }
    //Réinit prix
  }
}
