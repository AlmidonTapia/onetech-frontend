import { Component, EventEmitter, Output, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [ThemeToggleComponent, ReactiveFormsModule, NgClass],
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.css'
})
export class AdminTopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isDropdownOpen = signal(false);
  showSearchResults = signal(false);

  modules = [
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

  dropdownItems = [
    { label: 'Mi Perfil', icon: 'pi-user', route: '/admin/profile' },
    { label: 'Configuración', icon: 'pi-cog', route: '/admin/settings' }
  ];

  searchControl = new FormControl('');
  filteredModules = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const query = (value || '').toLowerCase().trim();
        if (!query) return [];
        return this.modules.filter(m => m.label.toLowerCase().includes(query));
      })
    ),
    { initialValue: [] }
  );

  get userProfile() {
    const user = this.authService.currentUser();
    return {
      name: user ? `${user.firstName} ${user.lastName}` : 'Administrador',
      role: 'ADMIN',
      avatarInitials: user ? user.firstName[0].toUpperCase() : 'AD'
    };
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.querySelector('.profile-menu')?.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleMenu() {
    this.isDropdownOpen.update(val => !val);
  }

  handleDropdownAction(route: string) {
    this.router.navigate([route]);
    this.isDropdownOpen.set(false);
  }

  hideSearchResults() {
    setTimeout(() => this.showSearchResults.set(false), 150);
  }

  goToModule(route: string) {
    this.router.navigate([route]);
    this.searchControl.setValue('');
    this.showSearchResults.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
