import { Component, OnInit, inject, signal } from '@angular/core';
import { OrdersTableComponent } from './components/orders-table/orders-table';
import { OrderStatusFormComponent } from './components/order-status-form/order-status-form';
import { AlertService } from '../../../shared/services/alert.service';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersTableComponent, OrderStatusFormComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);

  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);
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

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadOrders({ first: 0, rows: this.apiConfig.pageSize });
  }

  onFilterStatus(status: string) {
    this.filterStatus.set(status === 'ALL' ? undefined : status);
    this.loadOrders({ first: 0, rows: this.apiConfig.pageSize });
  }

  loadOrders(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);

    this.orderService.getAll(page, this.apiConfig.pageSize, this.searchTerm(), this.filterStatus()).subscribe({
      next: (data) => {
        this.orders.set(data.content);
        this.totalRecords.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openStatus(o: Order) {
    this.editingOrder.set(o);
    this.statusVisible.set(true);
  }

  openDetail(o: Order) {
    this.alertService.info('Próximamente', 'La vista de detalle de la orden estará disponible en una futura versión.');
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
