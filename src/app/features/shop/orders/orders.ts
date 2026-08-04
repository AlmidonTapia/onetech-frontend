import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorModule } from 'primeng/paginator';
import { OrdersListComponent } from './components/orders-list/orders-list';
import { OrderDetailComponent } from './components/order-detail/order-detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Order } from '../../../core/domains/checkout/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    PaginatorModule,
    OrdersListComponent,
    OrderDetailComponent,
    BreadcrumbComponent
  ],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  page = signal(0);

  rows = 5;

  detailVisible = signal(false);
  selectedOrder = signal<Order | null>(null);
  breadcrumb: BreadcrumbItem[] = [{ label: 'Mis pedidos' }];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(event?: any) {
    const p = event ? event.page : 0;
    this.page.set(p);
    this.loading.set(true);

    this.orderService.getMyOrders(p, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: r => {
          this.orders.set(r.content);
          this.totalRecords.set(r.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.alertService.error('Error al cargar pedidos', 'No se pudieron obtener tus pedidos. Verifica tu conexión e intenta de nuevo.');
        },
      });
  }

  openDetail(order: Order) {
    this.selectedOrder.set(order);
    this.detailVisible.set(true);
  }
}
