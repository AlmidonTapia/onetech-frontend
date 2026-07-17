import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button';
import { OrderService } from '../../../../core/domains/checkout/services/order.service';
import { Order } from '../../../../core/domains/checkout/models/order.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [ButtonComponent, RouterLink, CurrencyPipe, DatePipe, SpinnerComponent],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="icon-wrapper">
          <i class="pi pi-check-circle"></i>
        </div>
        <h1 class="success-title">{{ content.title }}</h1>
        <p class="success-subtitle">{{ content.subtitle }}</p>
        
        <div class="order-info">
          <span class="order-label">{{ content.orderLabel }}</span>
          <span class="order-id">#{{ orderId }}</span>
        </div>

        @if (isLoading()) {
          <div class="skeleton-wrapper">
            <app-spinner label="Cargando detalles de tu compra..." />
          </div>
        } @else if (orderData()) {
          <div class="order-details-card">
            <div class="detail-row">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">{{ orderData()!.createdAt | date:'medium' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total pagado:</span>
              <span class="detail-value total-highlight">{{ orderData()!.totalAmount | currency:'PEN':'symbol':'1.2-2' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Método de envío:</span>
              <span class="detail-value">{{ orderData()!.snapShipmentMethodName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Destino:</span>
              <span class="detail-value">
                {{ orderData()!.snapDepartmentName }}, {{ orderData()!.snapProvinceName }}<br>
                <small>{{ orderData()!.snapDistrictName }}</small>
              </span>
            </div>
          </div>
        }
        
        <p class="success-desc">{{ content.description }}</p>
        
        <div class="success-actions">
          <app-button variant="outline" [label]="content.trackBtn" [routerLink]="['/profile/orders']" />
          <app-button variant="primary" [label]="content.continueBtn" [routerLink]="['/catalog']" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .success-card {
      background: var(--ot-bg-surface);
      border: 1px solid var(--ot-border-color);
      border-radius: var(--ot-radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .icon-wrapper {
      color: #4ade80;
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }
    .success-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--ot-text-main);
      margin: 0 0 0.5rem 0;
    }
    .success-subtitle {
      color: var(--ot-text-muted);
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .order-info {
      background: var(--ot-bg-body);
      padding: 1rem;
      border-radius: var(--ot-radius-md);
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border: 1px dashed var(--ot-border-color);
    }
    .order-label {
      font-size: 0.875rem;
      color: var(--ot-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .order-id {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ot-primary);
    }
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--ot-text-muted);
      padding: 1rem 0;
      margin-bottom: 1.5rem;
    }
    .order-details-card {
      text-align: left;
      background: var(--ot-bg-body);
      border-radius: var(--ot-radius-md);
      padding: 1.25rem;
      margin-bottom: 2rem;
      border: 1px solid var(--ot-border-color);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--ot-border-color);
      padding-bottom: 0.5rem;
    }
    .detail-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .detail-label {
      color: var(--ot-text-muted);
      font-size: 0.9rem;
    }
    .detail-value {
      color: var(--ot-text-main);
      font-weight: 500;
      text-align: right;
    }
    .total-highlight {
      color: var(--ot-primary);
      font-weight: 700;
      font-size: 1.1rem;
    }
    .success-desc {
      color: var(--ot-text-main);
      line-height: 1.5;
      margin-bottom: 2rem;
    }
    .success-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  orderId = this.route.snapshot.paramMap.get('id') || 'N/A';
  
  isLoading = signal<boolean>(false);
  orderData = signal<Order | null>(null);

  content = {
    title: '¡Gracias por tu compra!',
    subtitle: 'Tu pedido ha sido procesado exitosamente.',
    orderLabel: 'Número de orden',
    description: 'Hemos enviado un correo electrónico con los detalles de tu compra. Te notificaremos cuando tu pedido esté en camino.',
    trackBtn: 'Ver mis pedidos',
    continueBtn: 'Seguir comprando'
  };

  ngOnInit() {
    if (this.orderId && this.orderId !== 'N/A') {
      this.isLoading.set(true);
      this.orderService.getById(this.orderId).subscribe({
        next: (order) => {
          this.orderData.set(order);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }
}
