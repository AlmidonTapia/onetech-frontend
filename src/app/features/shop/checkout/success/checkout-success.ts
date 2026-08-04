import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    <div class="flex items-center justify-center min-h-[60vh] p-8">
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-8 py-12 text-center w-full max-w-[500px] shadow-sm">
        <div class="text-[#4ade80] text-[5rem] mb-6">
          <i class="pi pi-check-circle"></i>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0 mb-2">{{ content.title }}</h1>
        <p class="text-slate-500 dark:text-slate-400 text-lg mb-8 m-0">{{ content.subtitle }}</p>
        
        <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-6 flex flex-col gap-2 border border-dashed border-slate-200 dark:border-slate-700">
          <span class="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ content.orderLabel }}</span>
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">#{{ orderId }}</span>
        </div>

        @if (isLoading()) {
          <div class="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 py-4 mb-6">
            <app-spinner label="Cargando detalles de tu compra..." />
          </div>
        } @else if (orderData()) {
          <div class="text-left bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 mb-8 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-2">
              <span class="text-[0.9rem] text-slate-500 dark:text-slate-400">Fecha:</span>
              <span class="text-slate-900 dark:text-slate-100 font-medium text-right">{{ orderData()!.createdAt | date:'medium' }}</span>
            </div>
            <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-2">
              <span class="text-[0.9rem] text-slate-500 dark:text-slate-400">Total pagado:</span>
              <span class="text-blue-600 dark:text-blue-400 font-bold text-lg text-right">{{ orderData()!.totalAmount | currency:'PEN':'symbol':'1.2-2' }}</span>
            </div>
            <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-2">
              <span class="text-[0.9rem] text-slate-500 dark:text-slate-400">Método de envío:</span>
              <span class="text-slate-900 dark:text-slate-100 font-medium text-right">{{ orderData()!.snapShipmentMethodName }}</span>
            </div>
            <div class="flex justify-between items-start">
              <span class="text-[0.9rem] text-slate-500 dark:text-slate-400">Destino:</span>
              <span class="text-slate-900 dark:text-slate-100 font-medium text-right">
                {{ orderData()!.snapDepartmentName }}, {{ orderData()!.snapProvinceName }}<br>
                <small>{{ orderData()!.snapDistrictName }}</small>
              </span>
            </div>
          </div>
        }
        
        <p class="text-slate-900 dark:text-slate-100 leading-relaxed mb-8 m-0">{{ content.description }}</p>
        
        <div class="flex gap-4 justify-center flex-wrap">
          <app-button variant="outline" [label]="content.trackBtn" [routerLink]="['/profile/orders']" />
          <app-button variant="primary" [label]="content.continueBtn" [routerLink]="['/catalog']" />
        </div>
      </div>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);

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
      this.orderService.getById(this.orderId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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
