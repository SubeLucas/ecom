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

  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchSubscription: Subscription | undefined;

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];
  filteredAliments: IAliment[] = [];
  kindFilteredAliments: IAliment[] = [];
  searchKeyword = '';

  isCatCollapsed = signal(false);
  isSelected = false;
  selectedCategories: string[] = [];

  constructor(
    private httpCart: CartService,
    private httpAliment: AlimentService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.httpAliment.all().subscribe(aliments => {
      this.aliments = aliments.body != null ? aliments.body : [];
    });

    this.searchSubscription = this.sharedService.searchTriggered$.subscribe(keyword => {
      this.performSearch(keyword);
    });

    this.breadcrumbItems = [{ label: 'Catalogue' }];

    this.handleNavigation();
    this.updateCrumbsCat();
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
    });

    this.route.url.subscribe(url => {
      const currentUrl = this.router.url;
      if (currentUrl.startsWith('?')) {
        this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
          // Si la navigation est vers la page d'accueil ou le catalogue sans filtres
          if (event.url === '/') {
            this.onRemoveFilters(); // Réinitialiser les filtres et le fil d'Ariane
          } else {
            this.updateCrumbsCat();
          }
        });
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
    keyword = keyword.trim().toLowerCase();
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
    console.log('filter applied');
    this.selectedCategories = [];
    this.kindFilteredAliments = [];
    //Récup ce qui est coché niveau catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        this.selectedCategories.push(cbListElements[i].name);
      }
    }
    //Récup ce qui est indiqué nv prix
    for (const kind of this.selectedCategories) {
      if (kind === 'Fruits') {
        if (this.filteredAliments.length > 0) {
          console.log(this.filteredAliments);
          for (const aliment of this.filteredAliments) {
            if (aliment.id % 2 == 1) this.kindFilteredAliments.push(aliment);
          }
        } else {
          for (const aliment of this.aliments) {
            if (aliment.id % 2 == 1) this.kindFilteredAliments.push(aliment);
          }
        }
      }
      if (kind === 'Légumes') {
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

    this.updateCrumbsCat(); // Met à jour le fil d'Ariane
  }

  onRemoveFilters(): void {
    //Supprimer coche catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      cbListElements[i].checked = false;
    }
    this.selectedCategories = [];
    //Réinit prix

    this.updateCrumbsCat(); // Met à jour le fil d'Ariane
  }

  printCrumbCatLabel(): string {
    const maxCategoriesToShow = 2; // Nombre maximal de catégories affichées
    const visibleCategories = this.selectedCategories.slice(0, maxCategoriesToShow).join(' et ');
    const additionalCount = this.selectedCategories.length - maxCategoriesToShow;

    const categoriesLabel = additionalCount > 0 ? `${visibleCategories} et ${additionalCount} autres` : visibleCategories;

    return categoriesLabel;
  }

  updateCrumbsCat(): void {
    // Met à jour le fil d'Ariane quand une catégorie est sélectionnée ou non

    if (this.selectedCategories.length === 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}, // Aucun paramètre
        // Supprime uniquement les paramètres spécifiés
      });
      this.breadcrumbItems = [{ label: 'Catalogue', routerLink: './', queryParamsHandling: 'merge' }];
    } else {
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
    }
  }

  updateCrumbsSearch(query: string): void {
    // Met à jour le fil d'Ariane quand une recherche est effectuée
    this.breadcrumbItems = [{ label: 'Catalogue' }, { label: `Recherche : ${query}` }];
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
