import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../../../../core/domains/catalog/services/category.service';
import { TranslationService } from '../../../../../core/services/translation.service';

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
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.css'
})
export class NavbarMenuComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<NavCategory[]>([]);
  openMenuIndex = signal<number | null>(null);

  ts = inject(TranslationService);
  t = this.ts.t;

  ngOnInit() {
    this.categoryService.getTree().subscribe({
      next: (res) => {
        const mapped: NavCategory[] = res.map(cat => this.mapCategory(cat));

        mapped.unshift({
          label: this.t().navbar.menu.allCategoriesLabel,
          route: '/catalog',
          queryParams: {}
        });

        mapped.push({
          label: this.t().navbar.menu.offersLabel,
          route: '/catalog',
          queryParams: { search: 'oferta' },
          accent: true
        });

        mapped.push({
          label: this.t().navbar.menu.aboutLabel,
          route: '/quienes-somos',
          queryParams: {},
          subcategories: [
            { label: this.t().navbar.menu.aboutItems.whoWeAre, route: '/quienes-somos', queryParams: {} },
            { label: this.t().navbar.menu.aboutItems.faq, route: '/preguntas-frecuentes', queryParams: {} },
            { label: this.t().navbar.menu.aboutItems.terms, route: '/terminos', queryParams: {} },
            { label: this.t().navbar.menu.aboutItems.privacy, route: '/privacidad', queryParams: {} },
            { label: this.t().navbar.menu.aboutItems.contact, route: '/contacto', queryParams: {} }
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
    this.openMenuIndex.set(index);
  }

  onMenuLeave(): void {
    this.openMenuIndex.set(null);
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
