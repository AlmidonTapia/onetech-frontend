import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { BadgeComponent, BadgeVariant } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Order, OrderStatus } from '../../../../../core/models/order.model';
import { ShipmentService } from '../../../../../core/services/shipment.service';
import { Shipment, ShipmentStatus } from '../../../../../core/models/shipment.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DialogModule, TagModule, CurrencyPenPipe, BadgeComponent, ButtonComponent, DatePipe, CommonModule],
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
      noShipment: 'El envío se encuentra en preparación. El código de seguimiento estará disponible pronto.'
    },
    actions: {
      closeLabel: 'Cerrar'
    }
  };

  readonly statusMap: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    PENDIENTE: { label: 'Pendiente', variant: 'warning' },
    PAGADO: { label: 'Pagado', variant: 'info' },
    ENVIADO: { label: 'Enviado', variant: 'blue' },
    COMPLETADO: { label: 'Completado', variant: 'success' },
    CANCELADO: { label: 'Cancelado', variant: 'error' }
  };

  readonly shipmentSteps: { status: ShipmentStatus; label: string; icon: string }[] = [
    { status: 'EN_PREPARACION', label: 'Preparación', icon: 'pi pi-box' },
    { status: 'EN_CAMINO', label: 'En camino', icon: 'pi pi-truck' },
    { status: 'ENTREGADO', label: 'Entregado', icon: 'pi pi-check-circle' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      this.fetchShipment();
    }
  }

  fetchShipment(): void {
    if (!this.order) return;
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

  getStepIndex(status: ShipmentStatus | undefined): number {
    if (!status) return 0;
    if (status === 'DEVUELTO') return 0;
    return this.shipmentSteps.findIndex(s => s.status === status);
  }

  close() { this.visibleChange.emit(false); }
}
