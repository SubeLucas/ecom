import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Cart, CartItem } from './cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(private http: HttpClient) {}

  validate(cart: Cart): Observable<number> {
    return this.http.post<number>(this.resourceUrl, cart);
  }
}
