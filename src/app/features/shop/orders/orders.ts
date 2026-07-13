import { Component, OnInit, inject, signal } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { OrdersListComponent } from './components/orders-list/orders-list';
import { OrderDetailComponent } from './components/order-detail/order-detail';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
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
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  page = signal(0);

  rows = 5;

  detailVisible = signal(false);
  selectedOrder = signal<Order | null>(null);

  content = {
    title: 'Mis pedidos',
    subtitle: 'Historial completo de tus compras en OneTech.',
    breadcrumbLabel: 'Mis pedidos',
    loadingLabel: 'Cargando pedidos...'
  };

  breadcrumb: BreadcrumbItem[] = [{ label: this.content.breadcrumbLabel }];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(event?: any) {
    const p = event ? event.page : 0;
    this.page.set(p);
    this.loading.set(true);

    this.orderService.getMyOrders(p, this.rows).subscribe({
      next: r => {
        this.orders.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openDetail(order: Order) {
    this.selectedOrder.set(order);
    this.detailVisible.set(true);
  }
}
