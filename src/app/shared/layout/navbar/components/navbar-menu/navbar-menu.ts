import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.css'
})
export class NavbarMenuComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<NavCategory[]>([]);

  content = {
    ariaLabelNav: 'Navegación por categorías',
    baseCatalogRoute: '/catalog',
    fixedItems: {
      allCategoriesLabel: 'Todas las categorías',
      offersLabel: '⚡ Ofertas',
      offersSearchValue: 'oferta'
    }
  };

  ngOnInit() {
    this.categoryService.getTree().subscribe({
      next: (res) => {
        const mapped: NavCategory[] = res.map(cat => this.mapCategory(cat));

        mapped.unshift({
          label: this.content.fixedItems.allCategoriesLabel,
          route: this.content.baseCatalogRoute,
          queryParams: {}
        });

        mapped.push({
          label: this.content.fixedItems.offersLabel,
          route: this.content.baseCatalogRoute,
          queryParams: { search: this.content.fixedItems.offersSearchValue },
          accent: true
        });

        this.categories.set(mapped);
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  private mapCategory(cat: any): NavCategory {
    return {
      label: cat.categoryName,
      route: this.content.baseCatalogRoute,
      queryParams: { idCategory: cat.idCategory },
      subcategories: cat.subcategories?.map((sub: any) => this.mapCategory(sub))
    };
  }
}
