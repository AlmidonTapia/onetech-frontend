import { Routes as ShopRoutes } from '@angular/router';
import { authGuard } from '../../core/domains/identity/guards/auth.guard';

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
    path: 'checkout/success/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./checkout/success/checkout-success').then(m => m.CheckoutSuccessComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile').then(m => m.ProfileComponent),
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadComponent: () => import('./profile/components/profile-info/profile-info').then(m => m.ProfileInfoComponent) },
      { path: 'security', loadComponent: () => import('./profile/components/profile-security/profile-security').then(m => m.ProfileSecurityComponent) },
      { path: 'orders', loadComponent: () => import('./profile/components/profile-orders/profile-orders').then(m => m.ProfileOrdersComponent) }
    ]
  },
  {
    path: 'wishlist',
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
    path: 'privacidad',
    loadComponent: () =>
      import('./pages/privacy/privacy').then(m => m.PrivacyComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contact-us/contact-us').then(m => m.ContactUsComponent)
  }
];
