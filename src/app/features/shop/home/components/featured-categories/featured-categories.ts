import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';

interface CategoryTile {
  label: string;
  iconClass: string; 
  route: string;
  queryParams: Record<string, string>;
}

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured-categories.html',
  styleUrl: './featured-categories.css'
})
export class FeaturedCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<CategoryTile[]>([]);

  content = {
    title: 'Comprar por categoría',
    viewAllText: 'Ver todo →',
    viewAllRoute: '/catalog',
    defaultIcon: 'pi pi-box' 
  };

  // ── DICCIONARIO DINÁMICO DE PRIMEICONS ── (por ahora falta revisar e implemenatr logica en el back)
  private iconMap: Record<string, string> = {
    'Laptops & PCs': 'pi pi-desktop',
    'Laptops': 'pi pi-desktop',
    'Gaming': 'pi pi-discord',
    'Celulares': 'pi pi-mobile',
    'Monitores': 'pi pi-image', 
    'Componentes': 'pi pi-cog',
    'Periféricos': 'pi pi-database', 
    'Impresoras': 'pi pi-print',
    'Accesorios': 'pi pi-paperclip'
  };

  ngOnInit() {
    this.categoryService.getTree().subscribe({
      next: (res) => {
        const mapped: CategoryTile[] = res.map((cat: any) => ({
          label: cat.categoryName,
          iconClass: this.iconMap[cat.categoryName] || this.content.defaultIcon,
          route: '/catalog',
          queryParams: { idCategory: cat.idCategory }
        }));

        this.categories.set(mapped);
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }
}
