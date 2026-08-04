import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartItemsComponent } from './components/cart-items/cart-items';
import { CartSummaryComponent } from './components/cart-summary/cart-summary';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { AlertService } from '../../../shared/services/alert.service';
import { CartStore } from '../../../core/domains/shopping/store/cart.store';
import { ProductService } from '../../../core/domains/catalog/services/product.service';
import { Product } from '../../../core/domains/catalog/models/product.model';
import { RelatedProductsComponent } from '../product-detail/components/related-products/related-products';
import { PaymentService } from '../../../core/domains/checkout/services/payment.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink, 
    CartItemsComponent,
    CartSummaryComponent,
    ButtonComponent,
    SpinnerComponent,
    BreadcrumbComponent,
    RelatedProductsComponent
  ],
  templateUrl: './cart.html',
  host: { 'class': 'block bg-white dark:bg-slate-900 transition-colors duration-300' }
})
export class CartComponent implements OnInit {
  cartStore = inject(CartStore);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  loading = false;
  relatedProducts: Product[] = [];

  routes = {
    checkout: '/checkout',
    catalog: '/catalog'
  };
  breadcrumb: BreadcrumbItem[] = [{ label: 'Carrito de compras' }];

  private paymentService = inject(PaymentService);
  paymentMethods: any[] = [];
  
  ngOnInit() {
    this.loading = true;
    
    this.paymentService.getMethods().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (methods) => {
        this.paymentMethods = methods.filter(m => m.status === 'ACTIVO' || m.status === 'HABILITADO');
      }
    });
    
    this.cartStore.getCart().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cart) => {
        this.loading = false;
        this.loadRelatedProducts(cart);
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadRelatedProducts(cart: any) {
    if (!cart || cart.items.length === 0) return;
    const firstItem = cart.items[0];
    this.productService.getAll({ size: 4, sort: 'createdAt,desc' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.relatedProducts = res.content.filter((p: Product) => p.idProduct !== firstItem.idProduct);
        this.cd.detectChanges();
      }
    });
  }

  onUpdateQty({ id, qty }: { id: string; qty: number }) {
    if (qty <= 0) { this.onRemove(id); return; }
    this.cartStore.updateQuantity(id, qty).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al actualizar cantidad');
        this.cd.detectChanges();
      }
    });
  }


  onRemove(id: string) {
    this.cartStore.removeItem(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.alertService.info('Producto eliminado del carrito');
          this.cd.detectChanges();
        },
        error: (err: any) => {
          this.alertService.error(err?.error?.message || 'Error al eliminar');
          this.cd.detectChanges();
        }
    });
  }

  goCheckout() {
    this.router.navigate([this.routes.checkout]);
  }
}
