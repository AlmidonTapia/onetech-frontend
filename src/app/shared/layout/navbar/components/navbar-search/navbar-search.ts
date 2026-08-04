import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';
import { Product } from '../../../../../core/domains/catalog/models/product.model';
import { Popover } from 'primeng/popover';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navbar-search',
  standalone: true,
  imports: [FormsModule, Popover, CurrencyPenPipe, NgOptimizedImage],
  templateUrl: './navbar-search.html'
})
export class NavbarSearchComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);

  query = '';
  searchSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  results = signal<Product[]>([]);
  loading = signal(false);
  search() {
    const q = this.query.trim();
    if (q) {
      this.router.navigate(['/catalog'], {
        queryParams: { search: q }
      });
    }
  }

  ngOnInit() {
    this.searchSubject.pipe(
      takeUntilDestroyed(this.destroyRef),
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

}
