import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from './payment.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment');

  constructor(private http: HttpClient) {}

  sendOrder(payment: Payment): Observable<number> {
    return this.http.post<number>(this.resourceUrl, payment);
  }

  pay(numCard: string): Observable<boolean> {
    return this.http.post<boolean>(this.resourceUrl, numCard);
  }
}
