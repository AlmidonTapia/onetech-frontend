import { Routes } from '@angular/router';
import { authGuard } from './core/domains/identity/guards/auth.guard';
import { adminGuard } from './core/domains/identity/guards/admin.guard';

export const routes: Routes = [
    
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadComponent: () =>
            import('./shared/layout/shop-layout/shop-layout').then(m => m.ShopLayoutComponent),
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES)
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./shared/layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
            }
        ]
    },
    {
        path: '**',
        loadComponent: () =>
            import('./features/shop/pages/not-found/not-found').then(m => m.NotFoundComponent)
    }
];
