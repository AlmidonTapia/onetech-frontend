import { Routes as AuthRoutes } from '@angular/router';

export const AUTH_ROUTES: AuthRoutes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then(m => m.RegisterComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
