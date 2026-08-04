import { Component, input, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Order, OrderStatus } from '../../../../../../../core/domains/checkout/models/order.model';
import { Shipment, ShipmentStatus } from '../../../../../../../core/domains/shipping/models/shipment.model';
import { BadgeComponent, BadgeVariant } from '../../../../../../../shared/components/ui/badge/badge';
import { SpinnerComponent } from '../../../../../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, DatePipe, BadgeComponent, SpinnerComponent],
  templateUrl: './order-status.html'
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  order = input.required<Order>();
  shipment = input<Shipment | null>(null);
  loadingShipment = input<boolean>(false);
  content = input.required<any>();
  get statusMap(): Record<OrderStatus, { label: string; variant: BadgeVariant }> {
    return {
      PENDIENTE: { label: 'Pendiente', variant: 'warning' },
      PAGADO: { label: 'Pagado', variant: 'info' },
      ENVIADO: { label: 'Enviado', variant: 'blue' },
      COMPLETADO: { label: 'Completado', variant: 'success' },
      CANCELADO: { label: 'Cancelado', variant: 'error' },
      EXPIRADO: { label: 'Expirado', variant: 'gray' }
    };
  }

  get shipmentSteps(): { status: ShipmentStatus; label: string; icon: string }[] {
    return [
      { status: 'EN_PREPARACION', label: 'Preparación', icon: 'pi pi-box' },
      { status: 'EN_CAMINO', label: 'En camino', icon: 'pi pi-truck' },
      { status: 'ENTREGADO', label: 'Entregado', icon: 'pi pi-check-circle' }
    ];
  }

  getStepIndex(status: ShipmentStatus | undefined): number {
    if (!status || status === 'DEVUELTO') return 0;
    return this.shipmentSteps.findIndex(s => s.status === status);
  }

  timeLeft = signal<string | null>(null);
  private timer: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  startTimer() {
    if (this.order().orderStatus === 'PENDIENTE') {
      const createdAt = new Date(this.order().createdAt).getTime();
      const expiresAt = createdAt + 15 * 60 * 1000;
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = expiresAt - now;

        if (diff <= 0) {
          this.timeLeft.set('Expirado');
          clearInterval(this.timer);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          this.timeLeft.set(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      };

      updateTimer();
      this.timer = setInterval(updateTimer, 1000);
    }
  }
}
