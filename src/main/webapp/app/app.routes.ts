import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/my-navbar/my-navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(({ CartComponent }) => CartComponent),
  },
  {
    path: 'delivery',
    loadComponent: () => import('./delivery/delivery.component').then(({ DeliveryComponent }) => DeliveryComponent),
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.component').then(({ PaymentComponent }) => PaymentComponent),
  },
  {
    path: 'payment-success',
    loadComponent: () =>
      import('./payment-success/payment-success.component').then(({ PaymentSuccessComponent }) => PaymentSuccessComponent),
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  ...errorRoute,
];

export default routes;
