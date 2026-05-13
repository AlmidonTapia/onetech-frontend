import { Routes as ShopRoutes } from '@angular/router';
// import { authGuard } from '../../core/auth/auth.guard';

export const SHOP_ROUTES: ShopRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.HomeComponent)
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./catalog/catalog').then(m => m.CatalogComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./product-detail/product-detail').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./checkout/checkout').then(m => m.CheckoutComponent)
  },
  {
    path: 'orders',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./orders/orders').then(m => m.OrdersComponent)
  },
  {
    path: 'profile',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile').then(m => m.ProfileComponent)
  },
  {
    path: 'wishlist',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./wishlist/wishlist').then(m => m.WishlistComponent)
  }
];
