import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
import { PDFService } from '../core/util/PDF.service';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, CardProductComponent, BreadcrumbModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  breadcrumbItems: MenuItem[] = []; // Les éléments du fil d'Ariane
  categories: string[] = ['Fruits', 'Légumes'];

  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private item = new CartItem(0, 0);
  aliments: IAliment[] = [];

  isCatCollapsed = signal(false);
  isSelected = false;
  selectedCategories: string[] = [];

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

    this.breadcrumbItems = [{ label: 'Catalogue' }];

    this.handleNavigation();
    this.updateCrumbsCat();
    console.warn('AAAAAAAAAAAAAA');
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

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      // Si la navigation est vers la page d'accueil ou le catalogue sans filtres
      if (event.url === '/') {
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
    this.selectedCategories = [];
    //Récup ce qui est coché niveau catégories
    const cbListElements = document.getElementsByClassName('cb-cat') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < cbListElements.length; i++) {
      if (cbListElements[i].checked) {
        this.selectedCategories.push(cbListElements[i].name);
      }
    }
    //Récup ce qui est indiqué nv prix

    //Appel apply
    console.warn(this.selectedCategories);

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
        queryParamsHandling: 'merge', // Supprime uniquement les paramètres spécifiés
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
}
