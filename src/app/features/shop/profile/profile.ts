import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // 👈 IMPORTADO: Router
import { TabsModule } from 'primeng/tabs';
import { ProfileInfoComponent } from './components/profile-info/profile-info';
import { ProfileAddressesComponent } from './components/profile-addresses/profile-addresses';
import { ProfileSecurityComponent } from './components/profile-security/profile-security';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    TabsModule,
    ProfileInfoComponent,
    ProfileAddressesComponent,
    ProfileSecurityComponent,
    BreadcrumbComponent,
    ButtonComponent
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

    quickActions: {
      ordersLabel: 'Mis pedidos',
      ordersIcon: 'pi-receipt',
      ordersRoute: '/orders',
      wishlistLabel: 'Favoritos',
      wishlistIcon: 'pi-heart',
      wishlistRoute: '/wishlist',
      logoutLabel: 'Cerrar sesión'
    },

    tabs: {
      infoValue: 'info',
      infoLabel: 'Información',
      infoIcon: 'pi pi-user',

      addressesValue: 'addresses',
      addressesLabel: 'Direcciones',
      addressesIcon: 'pi pi-map-marker',

      securityValue: 'security',
      securityLabel: 'Seguridad',
      securityIcon: 'pi pi-lock'
    }
  };

  breadcrumb: BreadcrumbItem[] = [{ label: this.content.breadcrumbLabel }];

  onLogout(): void {
    this.authService.logout();

    this.router.navigate(['/']);
  }
}
