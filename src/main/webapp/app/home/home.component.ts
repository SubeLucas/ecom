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
  actualSort = '';

  isCatCollapsed = signal(false);
  isSorted = false;
  selectedCategories: string[] = [];
  noProduct = false;

  constructor(
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
      const rawAliments = aliments.body != null ? aliments.body : [];

      // Tri aliments : ceux de saison en 1er
      this.aliments = rawAliments.sort((a, b) => {
        const isASeason = this.isSeasonProduct(a.season);
        const isBSeason = this.isSeasonProduct(b.season);

        if (isASeason && !isBSeason) {
          return -1; // `a` saison, donc avant `b`
        } else if (!isASeason && isBSeason) {
          return 1; // `b` saison, donc avant `a`
        } else {
          return 0; // pas changement d'ordre entre `a` et `b`
        }
      });
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
    });

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      // Si la navigation est vers la page d'accueil ou le catalogue sans filtres

      if (event.url === '/') {
        this.onResetSearch();
        this.onRemoveFilters(); // Réinitialiser les filtres et le fil d'Ariane
      }
    });
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
    this.onResetSort(true);
    this.noProduct = false;
    keyword = keyword.trim().toLowerCase();
    if (keyword) {
      if (this.filteredAliments.length > 0) {
        this.onRemoveFilters();
      }
      this.searchedAliments = this.aliments
        .filter(aliment => aliment.name?.toLowerCase().includes(keyword))
        .sort((a, b) => a.name!.localeCompare(b.name!));
      if (this.searchedAliments.length == 0) {
        this.noProduct = true;
      }
      this.searchKeyword = keyword;
      this.updateCrumbs(); // Met à jour le fil d'Ariane
    } else {
      this.onResetSearch();
    }
  }

  onApplyFilters(): void {
    this.selectedCategories = [];
    this.filteredAliments = [];

    //Récup ce qui est coché niveau catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        this.selectedCategories.push(cbListElements[i].name);
      }
    }

    //Je le laisse pour montrer à quel point je me suis embêtée pour rien :))
    // if (this.sortedAliments.length > 0) {
    //   this.sortedFilteredAliments = [];
    //   if (!this.isArraysEqual(this.categories, this.selectedCategories)) {
    //     for (const kind of this.selectedCategories) {
    //       if (kind === 'Fruits') {
    //         for (const aliment of this.sortedAliments) {
    //           if (aliment.id % 2 == 1) this.sortedFilteredAliments.push(aliment);
    //         }
    //       }
    //       if (kind === 'Légumes') {
    //         for (const aliment of this.sortedAliments) {
    //           if (aliment.id % 2 == 0) this.sortedFilteredAliments.push(aliment);
    //         }
    //       }
    //     }
    //   }
    // } else if (this.sortedFilteredAliments.length > 0) {
    //   this.onSortChange(this.actualSort);
    //   if (!this.isArraysEqual(this.categories, this.selectedCategories)) {
    //     for (const kind of this.selectedCategories) {
    //       if (kind === 'Fruits') {
    //         for (const aliment of this.sortedAliments) {
    //           if (aliment.id % 2 == 1) this.sortedFilteredAliments.push(aliment);
    //         }
    //       }
    //       if (kind === 'Légumes') {
    //         for (const aliment of this.sortedAliments) {
    //           if (aliment.id % 2 == 0) this.sortedFilteredAliments.push(aliment);
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   for (const kind of this.selectedCategories) {
    //     if (kind === 'Fruits') {
    //       for (const aliment of this.aliments) {
    //         if (aliment.id % 2 == 1) this.filteredAliments.push(aliment);
    //       }
    //     }
    //     if (kind === 'Légumes') {
    //       for (const aliment of this.aliments) {
    //         if (aliment.id % 2 == 0) this.filteredAliments.push(aliment);
    //       }
    //     }
    //   }
    // }

    let alimentsToIterate = [];
    if (this.searchedAliments.length > 0) {
      alimentsToIterate = this.searchedAliments;
    } else {
      alimentsToIterate = this.aliments;
    }

    for (const kind of this.selectedCategories) {
      if (kind === 'Fruits') {
        for (const aliment of alimentsToIterate) {
          if (aliment.id % 2 == 1) this.filteredAliments.push(aliment);
        }
      }
      if (kind === 'Légumes') {
        for (const aliment of alimentsToIterate) {
          if (aliment.id % 2 == 0) this.filteredAliments.push(aliment);
        }
      }
    }
    if (this.isSorted) {
      this.onSortChange(this.actualSort);
    }
    //Récup ce qui est indiqué nv prix
    //Appel apply

    this.updateCrumbs(); // Met à jour le fil d'Ariane
    console.warn(this.aliments);
    console.warn(this.searchedAliments);
    console.warn(this.filteredAliments);
    console.warn(this.sortedAliments);
    console.warn(this.sortedSearchedAliments);
    console.warn(this.sortedFilteredAliments);
  }

  isArraysEqual(array1: string[], array2: string[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }
    return array1.every(element => array2.includes(element)) && array2.every(element => array1.includes(element));
  }

  onRemoveFilters(): void {
    //Supprimer coche catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      cbListElements[i].checked = false;
    }
    if (this.isSorted) {
      this.onSortChange(this.actualSort);
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
    this.noProduct = false;

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

    //Peu optimisé
    if (this.selectedCategories.length > 0 && this.searchKeyword == '') {
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
    } else if (this.selectedCategories.length < 1 && this.searchKeyword != '') {
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
    } else if (this.selectedCategories.length > 0 && this.searchKeyword != '') {
      this.router.navigate([], { relativeTo: this.route, queryParams: { search: this.searchKeyword } });
      const categoriesLabel = this.printCrumbCatLabel();
      const joinItems = this.selectedCategories.join(',');

      this.breadcrumbItems = [
        { label: 'Catalogue', routerLink: './', command: () => this.onResetAll() },
        {
          label: `Recherche : ${this.searchKeyword}`,
          routerLink: './',
          command: () => this.onRemoveFilters(),
          queryParams: { search: this.searchKeyword }, // Plusieurs catégories comme paramètre
          queryParamsHandling: 'merge',
        },
        {
          label: categoriesLabel,
          routerLink: './',
          queryParams: { category: joinItems }, // Plusieurs catégories comme paramètre
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

  onSortEvent(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.onSortChange(selectedValue);
  }

  onSortChange(selectedValue: string): void {
    this.onResetSort(false);
    switch (selectedValue) {
      case 'default':
        this.onResetSort(false);
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

    this.actualSort = selectedValue;

    console.warn(this.aliments);
    console.warn(this.searchedAliments);
    console.warn(this.filteredAliments);
    console.warn(this.sortedAliments);
    console.warn(this.sortedSearchedAliments);
    console.warn(this.sortedFilteredAliments);
  }

  onResetSort(resetUI: boolean): void {
    if (resetUI) {
      const selectElem = document.getElementById('sort-select') as HTMLSelectElement;
      console.warn(selectElem.selectedIndex);
      selectElem.selectedIndex = 0;
    }

    this.isSorted = false;
    this.sortedAliments = [];
    this.sortedFilteredAliments = [];
    this.sortedSearchedAliments = [];
  }

  isSeasonProduct(season: number | null | undefined): boolean {
    if (season === null || undefined) return false;
    else {
      const currentDate = new Date();
      let currentMonth = currentDate.getMonth() + 1;
      currentMonth = 2 ** (12 - currentMonth);
      const result = (currentMonth & season!) === 1;
      return result;
    }
  }

  onResetAll(): void {
    this.onRemoveFilters();
    this.onResetSearch();
  }
}
