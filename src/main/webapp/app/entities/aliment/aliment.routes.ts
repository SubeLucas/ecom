import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AlimentResolve from './route/aliment-routing-resolve.service';

const alimentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/aliment.component').then(m => m.AlimentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/aliment-detail.component').then(m => m.AlimentDetailComponent),
    resolve: {
      aliment: AlimentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/aliment-update.component').then(m => m.AlimentUpdateComponent),
    resolve: {
      aliment: AlimentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/aliment-update.component').then(m => m.AlimentUpdateComponent),
    resolve: {
      aliment: AlimentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default alimentRoute;
