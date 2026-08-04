import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../../../core/domains/catalog/services/category.service';

interface NavCategory {
  label: string;
  route: string;
  queryParams: Record<string, string>;
  accent?: boolean;
  subcategories?: NavCategory[];
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar-menu.html'
})
export class NavbarMenuComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);

  categories = signal<NavCategory[]>([]);
  openMenuIndex = signal<number | null>(null);
  ngOnInit() {
    this.categoryService.getTree().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const mapped: NavCategory[] = res.map(cat => this.mapCategory(cat));

        mapped.unshift({
          label: 'Todas las categorías',
          route: '/catalog',
          queryParams: {}
        });

        mapped.push({
          label: '⚡ Ofertas',
          route: '/catalog',
          queryParams: { search: 'oferta' },
          accent: true
        });

        mapped.push({
          label: 'Sobre nosotros',
          route: '/quienes-somos',
          queryParams: {},
          subcategories: [
            { label: 'Quiénes somos', route: '/quienes-somos', queryParams: {} },
            { label: 'Preguntas frecuentes', route: '/preguntas-frecuentes', queryParams: {} },
            { label: 'Términos y condiciones', route: '/terminos', queryParams: {} },
            { label: 'Políticas de privacidad', route: '/privacidad', queryParams: {} },
            { label: 'Contacto', route: '/contacto', queryParams: {} }
          ]
        });

        this.categories.set(mapped);
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  onMenuEnter(index: number): void {
    // Prevent hover from interfering with mobile click state if screen is small
    if (window.innerWidth > 992) {
      this.openMenuIndex.set(index);
    }
  }

  onMenuLeave(): void {
    if (window.innerWidth > 992) {
      this.openMenuIndex.set(null);
    }
  }

  toggleMenu(index: number, event: Event): void {
    if (window.innerWidth <= 992) {
      if (this.openMenuIndex() === index) {
        this.openMenuIndex.set(null);
      } else {
        this.openMenuIndex.set(index);
      }
      // If it has subcategories, we prevent default navigation to let accordion work
      // Optional: you can comment preventDefault if you want it to navigate AND open.
      event.preventDefault();
    }
  }

  isMenuOpen(index: number): boolean {
    return this.openMenuIndex() === index;
  }

  private mapCategory(cat: any): NavCategory {
    return {
      label: cat.categoryName,
      route: '/catalog',
      queryParams: { category: cat.idCategory },
      subcategories: cat.subcategories?.map((sub: any) => this.mapCategory(sub))
    };
  }
}
