import { Routes as AdminRoutes } from '@angular/router';

export const ADMIN_ROUTES: AdminRoutes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories/categories').then(m => m.CategoriesComponent)
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./brands/brands').then(m => m.BrandsComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders').then(m => m.OrdersComponent)
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./inventory/inventory').then(m => m.InventoryComponent)
  },
  {
    path: 'shipments',
    loadComponent: () =>
      import('./shipments/shipments').then(m => m.ShipmentsComponent)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users').then(m => m.UsersComponent)
  },
  {
    path: 'coupons',
    loadComponent: () =>
      import('./coupons/coupons').then(m => m.CouponsComponent)
  },
  {
    path: 'shipment-methods',
    loadComponent: () =>
      import('./shipment-methods/shipment-methods').then(m => m.ShipmentMethodsComponent)
  },
  {
    path: 'shipping',
    loadComponent: () =>
      import('./shipping/shipping-page').then(m => m.ShippingPageComponent)
  },
  {
    path: 'payment-methods',
    loadComponent: () =>
      import('./payment-methods/payment-methods').then(m => m.PaymentMethodsComponent)
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews/reviews').then(m => m.ReviewsComponent)
  },
  {
    path: 'inbox',
    loadComponent: () =>
      import('./inbox/inbox').then(m => m.InboxComponent)
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoices/invoices').then(m => m.InvoicesComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/admin-profile').then(m => m.AdminProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/admin-settings').then(m => m.AdminSettingsComponent)
  }
];
