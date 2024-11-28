import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { PDFService } from '../core/util/PDF.service';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, CardProductComponent, FormsModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];
  filteredAliments: IAliment[] = [];
  kindFilteredAliments: IAliment[] = [];
  searchKeyword = '';

  isCatCollapsed = signal(true);
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

  isCollapse(): void {
    this.router.navigate(['/cart']);
  }

  toggleNavbar(): void {
    this.isCatCollapsed.update(isCatCollapsed => !isCatCollapsed);
  }

  onSearch(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (keyword) {
      if (this.kindFilteredAliments.length > 0) {
        this.kindFilteredAliments = this.kindFilteredAliments.filter(aliment => aliment.name?.toLowerCase().includes(keyword));
        if (this.kindFilteredAliments.length == 0) alert('Aucune produit trouvé !');
      } else {
        this.filteredAliments = this.aliments.filter(aliment => aliment.name?.toLowerCase().includes(keyword));
        if (this.filteredAliments.length == 0) alert('Aucune produit trouvé !');
      }
    } else {
      this.filteredAliments = this.aliments;
    }
  }

  onApplyFilters(): void {
    //Récup ce qui est coché niveau catégories
    this.kindFilteredAliments = [];
    const kindChosen = [];
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        kindChosen.push(cbListElements[i].name);
      }
    }
    //Récup ce qui est indiqué nv prix
    for (const kind of kindChosen) {
      if (kind === 'cb-fruit') {
        if (this.filteredAliments.length > 0) {
          for (const aliment of this.filteredAliments) {
            if (aliment.id % 2 == 1) this.kindFilteredAliments.push(aliment);
          }
        } else {
          for (const aliment of this.aliments) {
            if (aliment.id % 2 == 1) this.kindFilteredAliments.push(aliment);
          }
        }
      }
      if (kind === 'cb-vegetable') {
        if (this.filteredAliments.length > 0) {
          for (const aliment of this.filteredAliments) {
            if (aliment.id % 2 == 0) this.kindFilteredAliments.push(aliment);
          }
        } else {
          for (const aliment of this.aliments) {
            if (aliment.id % 2 == 0) this.kindFilteredAliments.push(aliment);
          }
        }
      }
    }
    //Appel apply
    console.warn(kindChosen);
  }

  onRemoveFilters(): void {
    //Supprimer coche catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      cbListElements[i].checked = false;
    }
    //Réinit prix
    this.kindFilteredAliments = [];
  }

  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'ordered_price':
        if (this.kindFilteredAliments.length > 0) {
          this.kindFilteredAliments = this.kindFilteredAliments
            .filter(aliment => aliment.price != null)
            .sort((a, b) => a.price! - b.price!);
        } else if (this.filteredAliments.length > 0) {
          this.filteredAliments = this.filteredAliments.filter(aliment => aliment.price != null).sort((a, b) => a.price! - b.price!);
        } else {
          this.aliments = this.aliments.filter(aliment => aliment.price != null).sort((a, b) => a.price! - b.price!);
        }
        break;
      case 'unordered_price':
        if (this.kindFilteredAliments.length > 0) {
          this.kindFilteredAliments = this.kindFilteredAliments
            .filter(aliment => aliment.price != null)
            .sort((a, b) => b.price! - a.price!);
        } else if (this.filteredAliments.length > 0) {
          this.filteredAliments = this.filteredAliments.filter(aliment => aliment.price != null).sort((a, b) => b.price! - a.price!);
        } else {
          this.aliments = this.aliments.filter(aliment => aliment.price != null).sort((a, b) => b.price! - a.price!);
        }
        break;
      case 'alpha':
        if (this.kindFilteredAliments.length > 0) {
          this.kindFilteredAliments = this.kindFilteredAliments
            .filter(aliment => aliment.name != null)
            .sort((a, b) => a.name!.localeCompare(b.name!));
        } else if (this.filteredAliments.length > 0) {
          this.filteredAliments = this.filteredAliments
            .filter(aliment => aliment.name != null)
            .sort((a, b) => a.name!.localeCompare(b.name!));
        } else {
          this.aliments = this.aliments.filter(aliment => aliment.name != null).sort((a, b) => a.name!.localeCompare(b.name!));
        }
    }
  }
}
