import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface AdminNavItem {
  label: string;
  route: string;
  icon: string;
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
  @Input() set collapsedState(value: boolean) {
    this.collapsed.set(value);
  }
  @Output() collapsedChange = new EventEmitter<boolean>();


  content = {
    dashboardRoute: '/admin/dashboard',
    logoTag: 'Admin',
    logoCollapsed: 'OT',
    ariaLabelNav: 'Menú admin',
    defaultAvatarLetter: 'A',
    userRoleLabel: 'Administrador',
    logoutLabel: 'Cerrar sesión',
    ariaLabels: {
      expand: 'Expandir menú',
      collapse: 'Colapsar menú'
    }
  } as const;

  navItems: AdminNavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'pi-home' },
    { label: 'Productos', route: '/admin/products', icon: 'pi-box' },
    { label: 'Categorías', route: '/admin/categories', icon: 'pi-tags' },
    { label: 'Marcas', route: '/admin/brands', icon: 'pi-star' },
    { label: 'Inventario', route: '/admin/inventory', icon: 'pi-server' },
    { label: 'Cupones', route: '/admin/coupons', icon: 'pi-ticket' },
    { label: 'Órdenes', route: '/admin/orders', icon: 'pi-shopping-bag' },
    { label: 'Envíos', route: '/admin/shipments', icon: 'pi-truck' },
    { label: 'Logística / Envíos', route: '/admin/shipping', icon: 'pi-compass' },
    { label: 'Métodos Pago', route: '/admin/payment-methods', icon: 'pi-credit-card' },
    { label: 'Usuarios', route: '/admin/users', icon: 'pi-users' },
    { label: 'Reseñas', route: '/admin/reviews', icon: 'pi-comments' },
    { label: 'Bandeja Entrada', route: '/admin/inbox', icon: 'pi-inbox' }
  ];

  toggleCollapse() {
    this.collapsed.update(state => !state);
    this.collapsedChange.emit(this.collapsed());
  }
}
