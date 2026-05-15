import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  collapsed = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi-chart-bar', route: '/admin/dashboard' },
    { label: 'Productos', icon: 'pi-box', route: '/admin/products' },
    { label: 'Categorías', icon: 'pi-tags', route: '/admin/categories' },
    { label: 'Marcas', icon: 'pi-bookmark', route: '/admin/brands' },
    { label: 'Órdenes', icon: 'pi-receipt', route: '/admin/orders' },
    { label: 'Inventario', icon: 'pi-warehouse', route: '/admin/inventory' },
    { label: 'Envíos', icon: 'pi-truck', route: '/admin/shipments' },
    { label: 'Usuarios', icon: 'pi-users', route: '/admin/users' },
  ];

  toggleCollapse() { this.collapsed.update(v => !v); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}