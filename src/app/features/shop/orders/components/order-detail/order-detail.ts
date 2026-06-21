import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Order } from '../../../../../core/models/order.model';
import { ShipmentService } from '../../../../../core/services/shipment.service';
import { Shipment } from '../../../../../core/models/shipment.model';
import { OrderStatusComponent } from './components/order-status/order-status';
import { OrderItemsComponent } from './components/order-items/order-items';
import { OrderSummaryComponent } from './components/order-summary/order-summary';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DialogModule, ButtonComponent, CommonModule, OrderStatusComponent, OrderItemsComponent, OrderSummaryComponent],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetailComponent implements OnChanges {
  @Input() visible = false;
  @Input() order: Order | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  private shipmentService = inject(ShipmentService);
  shipment = signal<Shipment | null>(null);
  loadingShipment = signal<boolean>(false);

  content = {
    headerPrefix: 'Pedido #',
    dialogWidth: '600px',
    dateFormat: 'dd MMMM yyyy, HH:mm',
    sections: {
      productsTitle: 'Productos',
      infoTitle: 'Información del pedido',
      shipmentTitle: 'Seguimiento de envío'
    },
    totals: {
      subtotalLabel: 'Subtotal',
      grandTotalLabel: 'Total pagado',
      unitSuffix: ' c/u'
    },
    labels: {
      client: 'Cliente',
      orderId: 'ID de orden',
      trackingNumber: 'Código de seguimiento',
      estimatedArrival: 'Fecha estimada de entrega',
      noShipment: 'El envío se encuentra en preparación. El código de seguimiento estará disponible pronto.',
      loadingShipment: 'Cargando información de envío...',
      discount: 'Descuento',
      shipping: 'Envío'
    },
    actions: {
      closeLabel: 'Cerrar'
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      this.fetchShipment();
    }
  }

  fetchShipment(): void {
    if (!this.order) return;

    if (this.order.orderStatus === 'PENDIENTE' || this.order.orderStatus === 'CANCELADO') {
      this.shipment.set(null);
      this.loadingShipment.set(false);
      return;
    }

    this.loadingShipment.set(true);
    this.shipment.set(null);

    this.shipmentService.getByOrder(this.order.idOrder).subscribe({
      next: (data) => {
        this.shipment.set(data);
        this.loadingShipment.set(false);
      },
      error: () => {
        this.shipment.set(null);
        this.loadingShipment.set(false);
      }
    });
  }

  close() { this.visibleChange.emit(false); }
}
