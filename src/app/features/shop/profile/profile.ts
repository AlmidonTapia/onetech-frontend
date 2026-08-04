import { Component, inject } from '@angular/core';
import { RouterLink, Router, RouterOutlet, RouterLinkActive } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { AuthService } from '../../../core/domains/identity/services/auth.service';

import { ButtonComponent } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    BreadcrumbComponent,
    ButtonComponent
  ],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);
  get breadcrumb(): BreadcrumbItem[] {
    return [{ label: 'Mi perfil' }];
  }

  get sidebarMenu() {
    return [
      { label: 'Información', route: '/profile/info', icon: 'pi pi-user' },
      { label: 'Mis Pedidos', route: '/profile/orders', icon: 'pi pi-shopping-bag' },
      { label: 'Seguridad', route: '/profile/security', icon: 'pi pi-lock' }
    ];
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
