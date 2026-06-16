import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ProductCardComponent, ButtonComponent, SpinnerComponent, BreadcrumbComponent, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  products = signal<Product[]>([]);
  loading = signal(false);
  count = this.wishlistService.count;

  content = {
    title: 'Mis favoritos',
    breadcrumbLabel: 'Mis favoritos',
    emptyListLabel: 'Tu lista de favoritos está vacía',
    singularSuffix: 'producto guardado',
    pluralSuffix: 'productos guardados',
    clearBtnText: 'Vaciar lista',
    loadingLabel: 'Cargando favoritos...',
    emptyState: {
      title: 'Sin favoritos todavía',
      description: 'Guarda los productos que más te gusten tocando el corazón en cualquier tarjeta de producto.',
      exploreBtnLabel: 'Explorar catálogo',
      exploreBtnIcon: 'pi-arrow-right',
      exploreRoute: '/catalog'
    },
    actions: {
      removeText: 'Quitar',
      removeTitle: 'Quitar de favoritos'
    },
    alerts: {
      removedTitle: 'Quitado de favoritos',
      clearedTitle: 'Lista de favoritos vaciada'
    }
  };

  breadcrumb: BreadcrumbItem[] = [{ label: this.content.breadcrumbLabel }];

  constructor() {
    effect(() => {
      const ids = this.wishlistService.ids();
      if (ids.length === 0) {
        this.products.set([]);
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      forkJoin(
        ids.map(id =>
          this.productService.getById(id).pipe(catchError(() => of(null)))
        )
      ).subscribe(results => {
        this.products.set(results.filter((p): p is Product => p !== null));
        this.loading.set(false);
      });
    }, { allowSignalWrites: true });
  }

  removeProduct(product: Product) {
    this.wishlistService.remove(product.idProduct);
    this.products.update(list => list.filter(p => p.idProduct !== product.idProduct));
    this.alertService.info(this.content.alerts.removedTitle, product.productName);
  }

  clearAll() {
    this.wishlistService.clear();
    this.products.set([]);
    this.alertService.info(this.content.alerts.clearedTitle);
  }
}
