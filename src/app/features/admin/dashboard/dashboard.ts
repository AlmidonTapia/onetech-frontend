import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { Order } from '../../../core/domains/checkout/models/order.model';
import { DashboardStatsComponent, StatCard } from './components/dashboard-stats/dashboard-stats';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart';
import { DashboardRecentOrdersComponent } from './components/dashboard-recent-orders/dashboard-recent-orders';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { DashboardService } from '../../../core/domains/shared/services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardStatsComponent, DashboardChartComponent,
    DashboardRecentOrdersComponent, SpinnerComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);
  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentOrders = signal<Order[]>([]);
  chartData = signal<any>(null);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);

    this.dashboardService.getStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.stats.set([
          { label: 'Productos', value: data.totalProducts, icon: 'pi-box', color: 'blue', suffix: 'registrados' },
          { label: 'Órdenes', value: data.totalOrders, icon: 'pi-receipt', color: 'orange', suffix: 'en total' },
          { label: 'Usuarios', value: data.totalUsers, icon: 'pi-users', color: 'green', suffix: 'registrados' },
          { label: 'Pendientes', value: data.pendingOrders, icon: 'pi-clock', color: 'purple', suffix: 'por procesar' },
        ]);

        this.recentOrders.set(data.recentOrders);
        this.buildChartData(data.ordersByStatus);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private buildChartData(ordersByStatus: Record<string, number>) {
    const data = [
      ordersByStatus['PENDIENTE'] || 0,
      ordersByStatus['PAGADO'] || 0,
      ordersByStatus['ENVIADO'] || 0,
      ordersByStatus['COMPLETADO'] || 0,
      ordersByStatus['CANCELADO'] || 0
    ];

    this.chartData.set({
      labels: [
        'Pendiente',
        'Pagado',
        'Enviado',
        'Completado',
        'Cancelado'
      ],
      datasets: [{
        data: data,
        backgroundColor: ['#d97706', '#0284c7', '#0047cc', '#16a34a', '#dc2626'],
        borderWidth: 0,
      }]
    });
  }
}
