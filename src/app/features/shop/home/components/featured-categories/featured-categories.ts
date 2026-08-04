import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../../core/domains/catalog/services/category.service';

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
  templateUrl: './featured-categories.html'
})
export class FeaturedCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);  private destroyRef = inject(DestroyRef);
  categories = signal<CategoryTile[]>([]);

  defaultIcon = 'pi pi-box';

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
    this.categoryService.getTree().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const mapped: CategoryTile[] = res.map((cat: any) => ({
          label: cat.categoryName,
          iconClass: this.iconMap[cat.categoryName] || this.defaultIcon,
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
