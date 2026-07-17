import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

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


  ts = inject(TranslationService);
  t = this.ts.t;

  get navItems(): AdminNavItem[] {
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
      { label: this.t().adminLayout.navItems.invoices, route: '/admin/invoices', icon: 'pi-file-pdf' },
      { label: this.t().adminLayout.navItems.users, route: '/admin/users', icon: 'pi-users' },
      { label: this.t().adminLayout.navItems.reviews, route: '/admin/reviews', icon: 'pi-comments' },
      { label: this.t().adminLayout.navItems.inbox, route: '/admin/inbox', icon: 'pi-inbox' },
      { label: this.t().adminLayout.navItems.settings, route: '/admin/settings', icon: 'pi-cog' }
    ];
  }

  toggleCollapse() {
    this.collapsed.update(state => !state);
    this.collapsedChange.emit(this.collapsed());
  }
}
