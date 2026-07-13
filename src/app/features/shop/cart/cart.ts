import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  cartStore = inject(CartStore);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  loading = false;
  relatedProducts: Product[] = [];

  routes = {
    checkout: '/checkout',
    catalog: '/catalog'
  };

  content = {
    title: 'Mi carrito',
    breadcrumbLabel: 'Carrito de compras',
    loadingLabel: 'Cargando carrito...',
    emptyTitle: 'Tu carrito está vacío',
    emptyDescription: 'Agrega productos para empezar tu compra.',
    exploreBtnLabel: 'Explorar productos',
    alertRemoved: 'Producto eliminado del carrito',
    alertRemoveError: 'Error al eliminar',
    alertUpdateError: 'Error al actualizar cantidad'
  };

  breadcrumb: BreadcrumbItem[] = [{ label: this.content.breadcrumbLabel }];

  ngOnInit() {
    this.loading = true;
    this.cartStore.getCart().subscribe({
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
    this.productService.getAll({ size: 4, sort: 'createdAt,desc' }).subscribe({
      next: (res) => {
        this.relatedProducts = res.content.filter((p: Product) => p.idProduct !== firstItem.idProduct);
        this.cd.detectChanges();
      }
    });
  }

  onUpdateQty({ id, qty }: { id: string; qty: number }) {
    if (qty <= 0) { this.onRemove(id); return; }
    this.cartStore.updateQuantity(id, qty).subscribe({
      next: () => {
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.content.alertUpdateError);
        this.cd.detectChanges();
      }
    });
  }


  onRemove(id: string) {
    this.cartStore.removeItem(id).subscribe({
        next: () => {
          this.alertService.info(this.content.alertRemoved);
          this.cd.detectChanges();
        },
        error: (err: any) => {
          this.alertService.error(err?.error?.message || this.content.alertRemoveError);
          this.cd.detectChanges();
        }
    });
  }

  goCheckout() {
    this.router.navigate([this.routes.checkout]);
  }
}
