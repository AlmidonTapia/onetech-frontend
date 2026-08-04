import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { OrdersTableComponent } from './components/orders-table/orders-table';
import { OrderStatusFormComponent } from './components/order-status-form/order-status-form';
import { AlertService } from '../../../shared/services/alert.service';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
import { Order, OrderStatus } from '../../../core/domains/checkout/models/order.model';
import { ShipmentService } from '../../../core/domains/shipping/services/shipment.service';
import { InvoiceService } from '../../../core/domains/checkout/services/invoice.service';
import { OrderDetailsModalComponent } from '../../shop/profile/components/profile-orders/components/order-details-modal/order-details-modal';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersTableComponent, OrderStatusFormComponent, OrderDetailsModalComponent],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);
  private shipmentService = inject(ShipmentService);
  private invoiceService = inject(InvoiceService);
  private destroyRef = inject(DestroyRef);
  orders = signal<Order[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  searchSubject = new Subject<string>();
  filterStatus = signal<string | undefined>(undefined);
  saving = signal(false);
  statusVisible = signal(false);
  editingOrder = signal<Order | null>(null);
  
  selectedOrder = signal<Order | null>(null);
  selectedShipment = signal<any>(null);
  selectedInvoice = signal<any>(null);
  showDetailsModal = signal(false);

  apiConfig = {
    pageSize: 10
  };

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadOrders({ first: 0, rows: this.apiConfig.pageSize });
    });
    this.loadOrders();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onFilterStatus(status: string) {
    this.filterStatus.set(status === 'ALL' ? undefined : status);
    this.loadOrders({ first: 0, rows: this.apiConfig.pageSize });
  }

  loadOrders(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);

    this.orderService.getAll(page, this.apiConfig.pageSize, this.searchTerm(), this.filterStatus()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.selectedOrder.set(o);
    this.selectedShipment.set(null);
    this.selectedInvoice.set(null);
    this.showDetailsModal.set(true);

    this.shipmentService.getByOrder(o.idOrder).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (shipment) => this.selectedShipment.set(shipment),
      error: () => {}
    });

    this.invoiceService.getByOrder(o.idOrder).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (invoice) => this.selectedInvoice.set(invoice),
      error: () => {}
    });
  }

  downloadInvoice(idInvoice: string) {
    if (this.selectedInvoice()?.pdfUrl) {
      window.open(this.selectedInvoice().pdfUrl, '_blank');
    } else {
      window.location.href = this.invoiceService.downloadInvoiceUrl(idInvoice);
    }
  }

  generateInvoice() {
    const order = this.selectedOrder();
    if (!order) return;
    
    this.loading.set(true);
    this.invoiceService.generateInvoice(order.idOrder).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Boleta generada exitosamente');
        // Refresh invoice data
        this.invoiceService.getByOrder(order.idOrder).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (invoice) => {
            this.selectedInvoice.set(invoice);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al generar la boleta');
        this.loading.set(false);
      }
    });
  }

  onStatusSave(newStatus: OrderStatus) {
    if (!this.editingOrder()) return;
    this.saving.set(true);

    this.orderService.updateStatus(this.editingOrder()!.idOrder, newStatus).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Estado actualizado correctamente');
        this.statusVisible.set(false);
        this.saving.set(false);
        this.loadOrders();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al actualizar estado';
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }
}
