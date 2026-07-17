import { Component, EventEmitter, Output, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslationService } from '../../../core/services/translation.service';

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
  ts = inject(TranslationService);
  t = this.ts.t;

  isDropdownOpen = signal(false);
  showSearchResults = signal(false);

  get modules() {
    return [
      { label: this.t().adminLayout.navItems.dashboard, route: '/admin/dashboard', icon: 'pi-home' },
      { label: this.t().adminLayout.navItems.products, route: '/admin/products', icon: 'pi-box' },
      { label: this.t().adminLayout.navItems.categories, route: '/admin/categories', icon: 'pi-tags' },
      { label: this.t().adminLayout.navItems.brands, route: '/admin/brands', icon: 'pi-star' },
      { label: this.t().adminLayout.navItems.inventory, route: '/admin/inventory', icon: 'pi-server' },
      { label: this.t().adminLayout.navItems.coupons, route: '/admin/coupons', icon: 'pi-ticket' },
      { label: this.t().adminLayout.navItems.orders, route: '/admin/orders', icon: 'pi-shopping-bag' },
      { label: this.t().adminLayout.navItems.shipments, route: '/admin/shipments', icon: 'pi-truck' },
      { label: this.t().adminLayout.navItems.shipping, route: '/admin/shipping', icon: 'pi-compass' },
      { label: this.t().adminLayout.navItems.paymentMethods, route: '/admin/payment-methods', icon: 'pi-credit-card' },
      { label: this.t().adminLayout.navItems.users, route: '/admin/users', icon: 'pi-users' },
      { label: this.t().adminLayout.navItems.reviews, route: '/admin/reviews', icon: 'pi-comments' },
      { label: this.t().adminLayout.navItems.inbox, route: '/admin/inbox', icon: 'pi-inbox' }
    ];
  }

  get dropdownItems() {
    return [
      { label: this.t().adminLayout.navItems.profile, icon: 'pi-user', route: '/admin/profile' },
      { label: this.t().adminLayout.navItems.settings, icon: 'pi-cog', route: '/admin/settings' }
    ];
  }

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
      name: user ? `${user.firstName} ${user.lastName}` : this.t().adminLayout.topbar.profileRole,
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
