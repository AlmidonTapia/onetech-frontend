import { Component, OnInit, inject, signal } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { OrdersListComponent } from './components/orders-list/orders-list';
import { OrderDetailComponent } from './components/order-detail/order-detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Order } from '../../../core/domains/checkout/models/order.model';
import { TranslationService } from '../../../core/services/translation.service';

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
  private alertService = inject(AlertService);

  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  page = signal(0);

  rows = 5;

  detailVisible = signal(false);
  selectedOrder = signal<Order | null>(null);

  ts = inject(TranslationService);
  t = this.ts.t;

  breadcrumb: BreadcrumbItem[] = [{ label: this.t().orders.breadcrumbLabel }];

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
      error: () => {
        this.loading.set(false);
        this.alertService.error(this.t().orders.errorLoadingTitle, this.t().orders.errorLoadingMsg);
      },
    });
  }

  openDetail(order: Order) {
    this.selectedOrder.set(order);
    this.detailVisible.set(true);
  }
}
