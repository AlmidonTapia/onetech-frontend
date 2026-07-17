import { Component, input, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { TranslationService } from '../../../../../../../core/services/translation.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Order, OrderStatus } from '../../../../../../../core/domains/checkout/models/order.model';
import { Shipment, ShipmentStatus } from '../../../../../../../core/domains/shipping/models/shipment.model';
import { BadgeComponent, BadgeVariant } from '../../../../../../../shared/components/ui/badge/badge';
import { SpinnerComponent } from '../../../../../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, DatePipe, BadgeComponent, SpinnerComponent],
  templateUrl: './order-status.html',
  styleUrl: './order-status.css'
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  order = input.required<Order>();
  shipment = input<Shipment | null>(null);
  loadingShipment = input<boolean>(false);
  content = input.required<any>();

  ts = inject(TranslationService);
  t = this.ts.t;

  get statusMap(): Record<OrderStatus, { label: string; variant: BadgeVariant }> {
    return {
      PENDIENTE: { label: this.t().orders.status.PENDIENTE, variant: 'warning' },
      PAGADO: { label: this.t().orders.status.PAGADO, variant: 'info' },
      ENVIADO: { label: this.t().orders.status.ENVIADO, variant: 'blue' },
      COMPLETADO: { label: this.t().orders.status.COMPLETADO, variant: 'success' },
      CANCELADO: { label: this.t().orders.status.CANCELADO, variant: 'error' },
      EXPIRADO: { label: this.t().orders.status.EXPIRADO, variant: 'gray' }
    };
  }

  get shipmentSteps(): { status: ShipmentStatus; label: string; icon: string }[] {
    return [
      { status: 'EN_PREPARACION', label: this.t().orders.shipmentSteps.EN_PREPARACION, icon: 'pi pi-box' },
      { status: 'EN_CAMINO', label: this.t().orders.shipmentSteps.EN_CAMINO, icon: 'pi pi-truck' },
      { status: 'ENTREGADO', label: this.t().orders.shipmentSteps.ENTREGADO, icon: 'pi pi-check-circle' }
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
          this.timeLeft.set(this.t().orders.status.expiredLabel);
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
