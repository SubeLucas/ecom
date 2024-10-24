import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IClientOrder, NewClientOrder } from '../client-order.model';

export type PartialUpdateClientOrder = Partial<IClientOrder> & Pick<IClientOrder, 'id'>;

type RestOf<T extends IClientOrder | NewClientOrder> = Omit<T, 'orderDate' | 'deliveryDate'> & {
  orderDate?: string | null;
  deliveryDate?: string | null;
};

export type RestClientOrder = RestOf<IClientOrder>;

export type NewRestClientOrder = RestOf<NewClientOrder>;

export type PartialUpdateRestClientOrder = RestOf<PartialUpdateClientOrder>;

export type EntityResponseType = HttpResponse<IClientOrder>;
export type EntityArrayResponseType = HttpResponse<IClientOrder[]>;

@Injectable({ providedIn: 'root' })
export class ClientOrderService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-orders');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/client-orders/_search');

  create(clientOrder: NewClientOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientOrder);
    return this.http
      .post<RestClientOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clientOrder: IClientOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientOrder);
    return this.http
      .put<RestClientOrder>(`${this.resourceUrl}/${this.getClientOrderIdentifier(clientOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clientOrder: PartialUpdateClientOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientOrder);
    return this.http
      .patch<RestClientOrder>(`${this.resourceUrl}/${this.getClientOrderIdentifier(clientOrder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClientOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClientOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestClientOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IClientOrder[]>()], asapScheduler)),
    );
  }

  getClientOrderIdentifier(clientOrder: Pick<IClientOrder, 'id'>): number {
    return clientOrder.id;
  }

  compareClientOrder(o1: Pick<IClientOrder, 'id'> | null, o2: Pick<IClientOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientOrderIdentifier(o1) === this.getClientOrderIdentifier(o2) : o1 === o2;
  }

  addClientOrderToCollectionIfMissing<Type extends Pick<IClientOrder, 'id'>>(
    clientOrderCollection: Type[],
    ...clientOrdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientOrders: Type[] = clientOrdersToCheck.filter(isPresent);
    if (clientOrders.length > 0) {
      const clientOrderCollectionIdentifiers = clientOrderCollection.map(clientOrderItem => this.getClientOrderIdentifier(clientOrderItem));
      const clientOrdersToAdd = clientOrders.filter(clientOrderItem => {
        const clientOrderIdentifier = this.getClientOrderIdentifier(clientOrderItem);
        if (clientOrderCollectionIdentifiers.includes(clientOrderIdentifier)) {
          return false;
        }
        clientOrderCollectionIdentifiers.push(clientOrderIdentifier);
        return true;
      });
      return [...clientOrdersToAdd, ...clientOrderCollection];
    }
    return clientOrderCollection;
  }

  protected convertDateFromClient<T extends IClientOrder | NewClientOrder | PartialUpdateClientOrder>(clientOrder: T): RestOf<T> {
    return {
      ...clientOrder,
      orderDate: clientOrder.orderDate?.format(DATE_FORMAT) ?? null,
      deliveryDate: clientOrder.deliveryDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restClientOrder: RestClientOrder): IClientOrder {
    return {
      ...restClientOrder,
      orderDate: restClientOrder.orderDate ? dayjs(restClientOrder.orderDate) : undefined,
      deliveryDate: restClientOrder.deliveryDate ? dayjs(restClientOrder.deliveryDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClientOrder>): HttpResponse<IClientOrder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClientOrder[]>): HttpResponse<IClientOrder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
