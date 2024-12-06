import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { IAliment } from '../entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

// temporary imports for cart validation tests
import { CartService } from '../cart/cart.service';
import { Cart, CartItem } from '../cart/cart.model';
import { CardProductComponent } from '../card-product/card-product.component';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, CardProductComponent, FormsModule, BreadcrumbModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  breadcrumbItems: MenuItem[] = []; // Les éléments du fil d'Ariane
  categories: string[] = ['Fruits', 'Légumes'];
  private titleService = inject(Title);

  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubscription: Subscription | undefined;

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];
  searchedAliments: IAliment[] = [];
  filteredAliments: IAliment[] = [];
  sortedAliments: IAliment[] = [];
  sortedSearchedAliments: IAliment[] = [];
  sortedFilteredAliments: IAliment[] = [];
  searchKeyword = '';

  isCatCollapsed = signal(false);
  isSorted = false;
  selectedCategories: string[] = [];

  constructor(
    private httpCart: CartService,
    private httpAliment: AlimentService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Cueillette');
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.httpAliment.all().subscribe(aliments => {
      this.aliments = aliments.body != null ? aliments.body : [];
      console.warn('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    });

    this.searchSubscription = this.sharedService.searchTriggered$.subscribe(keyword => {
      this.performSearch(keyword);
    });

    this.breadcrumbItems = [{ label: 'Catalogue' }];

    this.handleNavigation();
    this.updateCrumbs();
  }

  private handleNavigation(): void {
    this.route.queryParams.subscribe(params => {
      const catParam = params['category'];
      if (catParam) {
        // If cat in url
        this.selectedCategories = catParam.split(',');
      } else {
        this.selectedCategories = [];
      }
      const searchParam = params['search'];
      if (searchParam) {
        // If search in url
        this.searchKeyword = searchParam;
      } else {
        this.searchKeyword = '';
      }
      this.updateCrumbs();
    });

    //TODO Si clic accueil liste aliments pas maj
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      // Si la navigation est vers la page d'accueil ou le catalogue sans filtres
      if (event.url === '/') {
        console.warn('fffffffffffffffffffff');
        this.onResetSearch();
        this.onRemoveFilters(); // Réinitialiser les filtres et le fil d'Ariane
      }
    });

    /*this.route.url.subscribe(url => {
      console.warn(url)
      const currentUrl = this.router.url;

      if (currentUrl.startsWith('?')) {

      }
    });
    */
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubscription?.unsubscribe();
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

  performSearch(keyword: string): void {
    keyword = keyword.trim().toLowerCase();
    if (keyword) {
      if (this.filteredAliments.length > 0) {
        this.onRemoveFilters();
      }
      this.searchedAliments = this.aliments.filter(aliment => aliment.name?.toLowerCase().includes(keyword));
      if (this.searchedAliments.length == 0) {
        alert('Aucun produit trouvé !');
      } else {
        this.searchKeyword = keyword;
        this.updateCrumbs(); // Met à jour le fil d'Ariane
      }
    } else {
      this.searchKeyword = '';
      this.searchedAliments = [];
    }
  }

  onApplyFilters(): void {
    console.log('filter applied');
    this.selectedCategories = [];
    this.filteredAliments = [];
    //Récup ce qui est coché niveau catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        this.selectedCategories.push(cbListElements[i].name);
      }
    }

    if (this.searchedAliments.length > 0) {
      this.searchedAliments = [];
    }

    //Récup ce qui est indiqué nv prix
    for (const kind of this.selectedCategories) {
      if (kind === 'Fruits') {
        for (const aliment of this.aliments) {
          if (aliment.id % 2 == 1) this.filteredAliments.push(aliment);
        }
      }
      if (kind === 'Légumes') {
        for (const aliment of this.aliments) {
          if (aliment.id % 2 == 0) this.filteredAliments.push(aliment);
        }
      }
    }
    //Appel apply

    this.updateCrumbs(); // Met à jour le fil d'Ariane
  }

  onRemoveFilters(): void {
    //Supprimer coche catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      cbListElements[i].checked = false;
    }
    this.selectedCategories = [];
    this.filteredAliments = [];
    //Réinit prix

    this.updateCrumbs(); // Met à jour le fil d'Ariane
  }

  onResetSearch(): void {
    //réinit search
    this.searchKeyword = '';
    this.searchedAliments = [];

    this.updateCrumbs(); // Met à jour le fil d'Ariane
  }

  printCrumbCatLabel(): string {
    const maxCategoriesToShow = 2; // Nombre maximal de catégories affichées
    const visibleCategories = this.selectedCategories.slice(0, maxCategoriesToShow).join(' et ');
    const additionalCount = this.selectedCategories.length - maxCategoriesToShow;

    const categoriesLabel = additionalCount > 0 ? `${visibleCategories} et ${additionalCount} autres` : visibleCategories;

    return categoriesLabel;
  }

  updateCrumbs(): void {
    // Met à jour le fil d'Ariane quand une catégorie est sélectionnée ou non

    if (this.selectedCategories.length > 0) {
      const categoriesLabel = this.printCrumbCatLabel();
      const joinItems = this.selectedCategories.join(',');
      this.router.navigate([], { relativeTo: this.route, queryParams: { category: joinItems } });

      this.breadcrumbItems = [
        { label: 'Catalogue', routerLink: './', command: () => this.onRemoveFilters() },
        {
          label: categoriesLabel,
          routerLink: './',
          queryParams: { category: joinItems }, // Plusieurs catégories comme paramètre
          queryParamsHandling: 'merge',
        },
      ];
    } else if (this.searchKeyword != '') {
      this.router.navigate([], { relativeTo: this.route, queryParams: { search: this.searchKeyword } });

      this.breadcrumbItems = [
        { label: 'Catalogue', routerLink: './', command: () => this.onResetSearch() },
        {
          label: `Recherche : ${this.searchKeyword}`,
          routerLink: './',
          queryParams: { search: this.searchKeyword }, // Plusieurs catégories comme paramètre
          queryParamsHandling: 'merge',
        },
      ];
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}, // Aucun paramètre
        // Supprime uniquement les paramètres spécifiés
      });
      this.breadcrumbItems = [{ label: 'Catalogue', routerLink: './', queryParamsHandling: 'merge' }];
    }
  }

  updateCrumbsSearch(query: string): void {
    // Met à jour le fil d'Ariane quand une recherche est effectuée
    this.breadcrumbItems = [{ label: 'Catalogue' }, { label: `Recherche : ${query}` }];
  }

  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.sortedAliments = [];
    this.sortedFilteredAliments = [];
    this.sortedSearchedAliments = [];
    switch (selectedValue) {
      case 'default':
        this.isSorted = false;
        this.sortedAliments = [];
        this.sortedFilteredAliments = [];
        this.sortedSearchedAliments = [];
        break;
      case 'ordered_price':
        this.isSorted = true;
        if (this.filteredAliments.length > 0) {
          this.sortedFilteredAliments = this.filteredAliments.filter(aliment => aliment.price != null).sort((a, b) => a.price! - b.price!);
        } else if (this.searchedAliments.length > 0) {
          this.sortedSearchedAliments = this.searchedAliments.filter(aliment => aliment.price != null).sort((a, b) => a.price! - b.price!);
        } else {
          this.sortedAliments = this.aliments.filter(aliment => aliment.price != null).sort((a, b) => a.price! - b.price!);
        }
        break;
      case 'unordered_price':
        this.isSorted = true;
        if (this.filteredAliments.length > 0) {
          this.sortedFilteredAliments = this.filteredAliments.filter(aliment => aliment.price != null).sort((a, b) => b.price! - a.price!);
        } else if (this.searchedAliments.length > 0) {
          this.sortedSearchedAliments = this.searchedAliments.filter(aliment => aliment.price != null).sort((a, b) => b.price! - a.price!);
        } else {
          this.sortedAliments = this.aliments.filter(aliment => aliment.price != null).sort((a, b) => b.price! - a.price!);
        }
        break;
      case 'alpha':
        this.isSorted = true;
        if (this.filteredAliments.length > 0) {
          this.sortedFilteredAliments = this.filteredAliments
            .filter(aliment => aliment.name != null)
            .sort((a, b) => a.name!.localeCompare(b.name!));
        } else if (this.searchedAliments.length > 0) {
          this.sortedSearchedAliments = this.searchedAliments
            .filter(aliment => aliment.name != null)
            .sort((a, b) => a.name!.localeCompare(b.name!));
        } else {
          this.sortedAliments = this.aliments.filter(aliment => aliment.name != null).sort((a, b) => a.name!.localeCompare(b.name!));
        }
    }
  }
}
