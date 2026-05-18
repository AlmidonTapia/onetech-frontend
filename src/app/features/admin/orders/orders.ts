import { Component, OnInit, inject, signal } from '@angular/core';
import { OrdersTableComponent } from './components/orders-table/orders-table';
import { OrderStatusFormComponent } from './components/order-status-form/order-status-form';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersTableComponent, OrderStatusFormComponent, CardComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);

  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  statusVisible = signal(false);
  editingOrder = signal<Order | null>(null);

  apiConfig = {
    pageSize: 10
  };
  content = {
    title: 'Órdenes',
    countSuffix: 'órdenes en total',
    cardPadding: 'none',
    alerts: {
      updateSuccess: 'Estado actualizado correctamente',
      updateError: 'Error al actualizar estado'
    }
  } as const; 

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.orderService.getAll(page, this.apiConfig.pageSize).subscribe({
      next: r => {
        this.orders.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openStatus(o: Order) {
    this.editingOrder.set(o);
    this.statusVisible.set(true);
  }

  onStatusSave(newStatus: OrderStatus) {
    if (!this.editingOrder()) return;
    this.saving.set(true);

    this.orderService.updateStatus(this.editingOrder()!.idOrder, newStatus).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.updateSuccess);
        this.statusVisible.set(false);
        this.saving.set(false);
        this.loadOrders();
      },
      error: () => {
        this.alertService.error(this.content.alerts.updateError);
        this.saving.set(false);
      }
    });
  }
}
