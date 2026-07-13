import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';
import { Product } from '../../../../../core/domains/catalog/models/product.model';
import { Popover } from 'primeng/popover';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navbar-search',
  standalone: true,
  imports: [FormsModule, Popover, CurrencyPenPipe, NgOptimizedImage],
  templateUrl: './navbar-search.html',
  styleUrl: './navbar-search.css'
})
export class NavbarSearchComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private productService = inject(ProductService);

  query = '';
  searchSubject = new Subject<string>();
  private sub?: Subscription;

  results = signal<Product[]>([]);
  loading = signal(false);

  content = {
    catalogRoute: '/catalog',
    searchParamKey: 'search',
    placeholderText: 'Buscar laptops, celulares, componentes...',
    ariaLabels: {
      input: 'Buscar productos',
      button: 'Buscar'
    },
    searchIcon: 'pi pi-search'
  };

  search() {
    const q = this.query.trim();
    if (q) {
      this.router.navigate([this.content.catalogRoute], {
        queryParams: { [this.content.searchParamKey]: q }
      });
    }
  }

  ngOnInit() {
    this.sub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) {
          this.results.set([]);
          return of({ content: [] });
        }
        this.loading.set(true);
        return this.productService.getAll({ search: q.trim(), size: 5 }).pipe(
          catchError(() => of({ content: [] }))
        );
      })
    ).subscribe((res: any) => {
      this.results.set(res.content || []);
      this.loading.set(false);
    });
  }

  onInput(event: any, overlay: any, target: any) {
    const q = event.target.value;
    this.searchSubject.next(q);
    if (q.trim()) {
      overlay.show(event, target);
    } else {
      overlay.hide();
    }
  }

  goToProduct(id: string, overlay: any) {
    overlay.hide();
    this.router.navigate(['/product', id]);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
