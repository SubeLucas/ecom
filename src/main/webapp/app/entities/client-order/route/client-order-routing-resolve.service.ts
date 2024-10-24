import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientOrder } from '../client-order.model';
import { ClientOrderService } from '../service/client-order.service';

const clientOrderResolve = (route: ActivatedRouteSnapshot): Observable<null | IClientOrder> => {
  const id = route.params.id;
  if (id) {
    return inject(ClientOrderService)
      .find(id)
      .pipe(
        mergeMap((clientOrder: HttpResponse<IClientOrder>) => {
          if (clientOrder.body) {
            return of(clientOrder.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default clientOrderResolve;
