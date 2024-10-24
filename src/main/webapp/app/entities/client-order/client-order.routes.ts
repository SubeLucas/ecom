import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClientOrderResolve from './route/client-order-routing-resolve.service';

const clientOrderRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/client-order.component').then(m => m.ClientOrderComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/client-order-detail.component').then(m => m.ClientOrderDetailComponent),
    resolve: {
      clientOrder: ClientOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/client-order-update.component').then(m => m.ClientOrderUpdateComponent),
    resolve: {
      clientOrder: ClientOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/client-order-update.component').then(m => m.ClientOrderUpdateComponent),
    resolve: {
      clientOrder: ClientOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clientOrderRoute;
