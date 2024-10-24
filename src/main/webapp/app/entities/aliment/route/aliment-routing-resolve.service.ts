import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAliment } from '../aliment.model';
import { AlimentService } from '../service/aliment.service';

const alimentResolve = (route: ActivatedRouteSnapshot): Observable<null | IAliment> => {
  const id = route.params.id;
  if (id) {
    return inject(AlimentService)
      .find(id)
      .pipe(
        mergeMap((aliment: HttpResponse<IAliment>) => {
          if (aliment.body) {
            return of(aliment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default alimentResolve;
