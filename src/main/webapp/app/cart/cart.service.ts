import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Cart } from './cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(private http: HttpClient) {}

  add(cart: Cart): Observable<boolean> {
    return this.http.post<boolean>(this.resourceUrl, cart);
  }
}
