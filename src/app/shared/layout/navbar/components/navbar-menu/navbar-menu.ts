import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

interface NavCategory {
  label: string;
  route: string;
  queryParams: Record<string, string>;
  accent?: boolean;
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.css'
})
export class NavbarMenuComponent {
  categories: NavCategory[] = [
    { label: 'Laptops & PCs', route: '/catalog', queryParams: { category: 'laptops' } },
    { label: 'Componentes', route: '/catalog', queryParams: { category: 'componentes' } },
    { label: 'Gaming', route: '/catalog', queryParams: { category: 'gaming' } },
    { label: 'Monitores', route: '/catalog', queryParams: { category: 'monitores' } },
    { label: 'Celulares', route: '/catalog', queryParams: { category: 'celulares' } },
    { label: 'Tablets', route: '/catalog', queryParams: { category: 'tablets' } },
    { label: 'Periféricos', route: '/catalog', queryParams: { category: 'perifericos' } },
    { label: 'Accesorios', route: '/catalog', queryParams: { category: 'accesorios' } },
    { label: 'Ofertas', route: '/catalog', queryParams: { category: 'ofertas' }, accent: true },
  ];
}