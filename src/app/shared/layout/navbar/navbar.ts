import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu';
import { NavbarSearchComponent } from './components/navbar-search/navbar-search';
import { NavbarCartComponent } from './components/navbar-cart/navbar-cart';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NavbarMenuComponent, NavbarSearchComponent, NavbarCartComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
}