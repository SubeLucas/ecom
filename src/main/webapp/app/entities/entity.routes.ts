import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'ecomApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'aliment',
    data: { pageTitle: 'ecomApp.aliment.home.title' },
    loadChildren: () => import('./aliment/aliment.routes'),
  },
  {
    path: 'client',
    data: { pageTitle: 'ecomApp.client.home.title' },
    loadChildren: () => import('./client/client.routes'),
  },
  {
    path: 'images',
    data: { pageTitle: 'ecomApp.images.home.title' },
    loadChildren: () => import('./images/images.routes'),
  },
  {
    path: 'client-order',
    data: { pageTitle: 'ecomApp.clientOrder.home.title' },
    loadChildren: () => import('./client-order/client-order.routes'),
  },
  {
    path: 'order-line',
    data: { pageTitle: 'ecomApp.orderLine.home.title' },
    loadChildren: () => import('./order-line/order-line.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
