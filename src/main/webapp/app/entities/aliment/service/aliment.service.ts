import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAliment, NewAliment } from '../aliment.model';

export type PartialUpdateAliment = Partial<IAliment> & Pick<IAliment, 'id'>;

export type EntityResponseType = HttpResponse<IAliment>;
export type EntityArrayResponseType = HttpResponse<IAliment[]>;

@Injectable({ providedIn: 'root' })
export class AlimentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/aliments');

  all(): Observable<EntityArrayResponseType> {
    return this.http.get<IAliment[]>(this.resourceUrl, { observe: 'response' });
  }

  create(aliment: NewAliment): Observable<EntityResponseType> {
    return this.http.post<IAliment>(this.resourceUrl, aliment, { observe: 'response' });
  }

  update(aliment: IAliment): Observable<EntityResponseType> {
    return this.http.put<IAliment>(`${this.resourceUrl}/${this.getAlimentIdentifier(aliment)}`, aliment, { observe: 'response' });
  }

  partialUpdate(aliment: PartialUpdateAliment): Observable<EntityResponseType> {
    return this.http.patch<IAliment>(`${this.resourceUrl}/${this.getAlimentIdentifier(aliment)}`, aliment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAliment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStock(id: number): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.resourceUrl}/quantity/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAliment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAlimentIdentifier(aliment: Pick<IAliment, 'id'>): number {
    return aliment.id;
  }

  compareAliment(o1: Pick<IAliment, 'id'> | null, o2: Pick<IAliment, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlimentIdentifier(o1) === this.getAlimentIdentifier(o2) : o1 === o2;
  }

  addAlimentToCollectionIfMissing<Type extends Pick<IAliment, 'id'>>(
    alimentCollection: Type[],
    ...alimentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const aliments: Type[] = alimentsToCheck.filter(isPresent);
    if (aliments.length > 0) {
      const alimentCollectionIdentifiers = alimentCollection.map(alimentItem => this.getAlimentIdentifier(alimentItem));
      const alimentsToAdd = aliments.filter(alimentItem => {
        const alimentIdentifier = this.getAlimentIdentifier(alimentItem);
        if (alimentCollectionIdentifiers.includes(alimentIdentifier)) {
          return false;
        }
        alimentCollectionIdentifiers.push(alimentIdentifier);
        return true;
      });
      return [...alimentsToAdd, ...alimentCollection];
    }
    return alimentCollection;
  }
}
