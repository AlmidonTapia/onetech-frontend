import { Routes as ShopRoutes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

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
    loadComponent: () =>
      import('./cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./checkout/checkout').then(m => m.CheckoutComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./orders/orders').then(m => m.OrdersComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile').then(m => m.ProfileComponent)
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./wishlist/wishlist').then(m => m.WishlistComponent)
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./pages/who-we-are/who-we-are').then(m => m.WhoWeAreComponent)
  },
  {
    path: 'preguntas-frecuentes',
    loadComponent: () =>
      import('./pages/faq-page/faq-page').then(m => m.FaqPageComponent)
  },
  {
    path: 'terminos',
    loadComponent: () =>
      import('./pages/terms/terms').then(m => m.TermsComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contact-us/contact-us').then(m => m.ContactUsComponent)
  }
];
