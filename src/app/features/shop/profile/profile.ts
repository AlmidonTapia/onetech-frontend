import { Component, inject } from '@angular/core';
import { RouterLink, Router, RouterOutlet, RouterLinkActive } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { AuthService } from '../../../core/domains/identity/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    BreadcrumbComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  content = {
    breadcrumbLabel: 'Mi cuenta',
    defaultAvatarLetter: 'U',
    
    sidebarMenu: [
      { label: 'Información personal', route: '/profile/info', icon: 'pi pi-user' },
      { label: 'Mis pedidos', route: '/profile/orders', icon: 'pi pi-shopping-bag' },
      { label: 'Direcciones', route: '/profile/addresses', icon: 'pi pi-map-marker' },
      { label: 'Seguridad', route: '/profile/security', icon: 'pi pi-lock' }
    ],
    
    logoutLabel: 'Cerrar sesión'
  };

  breadcrumb: BreadcrumbItem[] = [{ label: this.content.breadcrumbLabel }];

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
