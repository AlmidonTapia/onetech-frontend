import { Component, signal, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { OrderService } from '../../../../../core/domains/checkout/services/order.service';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { InvoiceService } from '../../../../../core/domains/checkout/services/invoice.service';
import { Order } from '../../../../../core/domains/checkout/models/order.model';
import { OrderDetailsModalComponent } from './components/order-details-modal/order-details-modal';
import { SpinnerComponent } from '../../../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-profile-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPenPipe, BadgeComponent, ButtonComponent, OrderDetailsModalComponent, SpinnerComponent],
  templateUrl: './profile-orders.html'
})
export class ProfileOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private shipmentService = inject(ShipmentService);
  private invoiceService = inject(InvoiceService);
  private destroyRef = inject(DestroyRef);

  orders = signal<Order[]>([]);
  loading = signal(true);
  
  selectedOrder = signal<Order | null>(null);
  selectedShipment = signal<any>(null);
  selectedInvoice = signal<any>(null);
  showDetailsModal = signal(false);

  ngOnInit() {
    this.orderService.getMyOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.orders.set(res.content || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  getStatusBadgeVariant(status: string): any {
    switch(status) {
      case 'COMPLETADO': return 'success';
      case 'ENVIADO': return 'info';
      case 'PAGADO': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADO': return 'danger';
      case 'EXPIRADO': return 'gray';
      default: return 'gray';
    }
  }

  viewDetails(order: Order) {
    this.selectedOrder.set(order);
    this.selectedShipment.set(null);
    this.selectedInvoice.set(null);
    this.showDetailsModal.set(true);

    this.shipmentService.getByOrder(order.idOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (shipment) => this.selectedShipment.set(shipment),
        error: () => {}
      });

    this.invoiceService.getByOrder(order.idOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
}
