import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // <- Añadido RouterLink si se requiere en el botón dinámico
import { CartItemsComponent } from './components/cart-items/cart-items';
import { CartSummaryComponent } from './components/cart-summary/cart-summary';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { AlertService } from '../../../shared/services/alert.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink, 
    CartItemsComponent,
    CartSummaryComponent,
    ButtonComponent,
    SpinnerComponent,
    BreadcrumbComponent
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  loading = false;

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
    this.cartService.getCart().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  onUpdateQty({ id, qty }: { id: string; qty: number }) {
    if (qty <= 0) { this.onRemove(id); return; }
    // Ejemplo con alertas dinámicas  (por implementar)
    // this.cartService.updateItem(id, qty).subscribe({
    //   error: () => this.alertService.error(this.content.alertUpdateError)
    // });
  }

  onRemove(id: string) {
    this.cartService.removeItem(id).subscribe({
      next: () => this.alertService.info(this.content.alertRemoved),
      error: () => this.alertService.error(this.content.alertRemoveError)
    });
  }

  goCheckout() {
    this.router.navigate([this.routes.checkout]);
  }
}
