import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
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
        
        <p class="success-desc">{{ content.description }}</p>
        
        <div class="success-actions">
          <app-button variant="outline" [label]="content.trackBtn" [routerLink]="['/orders']" />
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
      margin-bottom: 2rem;
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
export class CheckoutSuccessComponent {
  private route = inject(ActivatedRoute);

  orderId = this.route.snapshot.paramMap.get('id') || 'N/A';

  content = {
    title: '¡Gracias por tu compra!',
    subtitle: 'Tu pedido ha sido procesado exitosamente.',
    orderLabel: 'Número de orden',
    description: 'Hemos enviado un correo electrónico con los detalles de tu compra. Te notificaremos cuando tu pedido esté en camino.',
    trackBtn: 'Ver mis pedidos',
    continueBtn: 'Seguir comprando'
  };
}
