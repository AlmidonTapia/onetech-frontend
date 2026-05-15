import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { CategoryService } from '../../../../../core/services/category.service';

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
  imports: [RouterLink, NgClass],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.css'
})
export class NavbarMenuComponent implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories = signal<NavCategory[]>([]);

  ngOnInit() {
    this.categoryService.getTree().subscribe({
      next: (res) => {
        const mapped: NavCategory[] = res.map(cat => this.mapCategory(cat));
        
        // Add "All" at the beginning
        mapped.unshift({ label: 'Todas las categorías', route: '/catalog', queryParams: {} });

        // Add a static "Offers" item at the end if desired
        mapped.push({ label: '⚡ Ofertas', route: '/catalog', queryParams: { search: 'oferta' }, accent: true });
        
        this.categories.set(mapped);
      }
    });
  }

  private mapCategory(cat: any): NavCategory {
    return {
      label: cat.categoryName,
      route: '/catalog',
      queryParams: { idCategory: cat.idCategory },
      subcategories: cat.subcategories?.map((sub: any) => this.mapCategory(sub))
    };
  }
}