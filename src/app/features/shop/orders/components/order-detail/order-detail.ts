import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Order } from '../../../../../core/domains/checkout/models/order.model';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { Shipment } from '../../../../../core/domains/shipping/models/shipment.model';
import { OrderStatusComponent } from './components/order-status/order-status';
import { OrderItemsComponent } from './components/order-items/order-items';
import { OrderSummaryComponent } from './components/order-summary/order-summary';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DialogModule, ButtonComponent, CommonModule, OrderStatusComponent, OrderItemsComponent, OrderSummaryComponent],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent implements OnChanges {
  @Input() visible = false;
  @Input() order: Order | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  private shipmentService = inject(ShipmentService);
  private destroyRef = inject(DestroyRef);
  shipment = signal<Shipment | null>(null);
  loadingShipment = signal<boolean>(false);
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

    this.shipmentService.getByOrder(this.order.idOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
