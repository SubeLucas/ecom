import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Aliment',
    route: '/aliment',
    translationKey: 'global.menu.entities.aliment',
  },
  {
    name: 'Client',
    route: '/client',
    translationKey: 'global.menu.entities.client',
  },
  {
    name: 'Images',
    route: '/images',
    translationKey: 'global.menu.entities.images',
  },
  {
    name: 'ClientOrder',
    route: '/client-order',
    translationKey: 'global.menu.entities.clientOrder',
  },
  {
    name: 'OrderLine',
    route: '/order-line',
    translationKey: 'global.menu.entities.orderLine',
  },
];
