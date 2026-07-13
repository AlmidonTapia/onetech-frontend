import { Component, OnInit, inject, signal } from '@angular/core';
import { Order } from '../../../core/domains/checkout/models/order.model';
import { DashboardStatsComponent, StatCard } from './components/dashboard-stats/dashboard-stats';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart';
import { DashboardRecentOrdersComponent } from './components/dashboard-recent-orders/dashboard-recent-orders';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { DashboardService } from '../../../core/domains/shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardStatsComponent, DashboardChartComponent,
    DashboardRecentOrdersComponent, SpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentOrders = signal<Order[]>([]);
  chartData = signal<any>(null);

  content = {
    title: 'Dashboard',
    subtitle: 'Resumen general del negocio',
    loadingLabel: 'Cargando datos...',

    statsLabels: {
      products: { title: 'Productos', icon: 'pi-box', color: 'blue' as const, suffix: 'registrados' },
      orders: { title: 'Órdenes', icon: 'pi-receipt', color: 'orange' as const, suffix: 'en total' },
      users: { title: 'Usuarios', icon: 'pi-users', color: 'green' as const, suffix: 'registrados' },
      pending: { title: 'Pendientes', icon: 'pi-clock', color: 'purple' as const, suffix: 'por procesar' }
    },

    chart: {
      labels: ['Pendiente', 'Pagado', 'Enviado', 'Completado', 'Cancelado'],
      colors: ['#d97706', '#0284c7', '#0047cc', '#16a34a', '#dc2626'],
      borderWidth: 0
    }
  } as const;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set([
          { label: this.content.statsLabels.products.title, value: data.totalProducts, icon: this.content.statsLabels.products.icon, color: this.content.statsLabels.products.color, suffix: this.content.statsLabels.products.suffix },
          { label: this.content.statsLabels.orders.title, value: data.totalOrders, icon: this.content.statsLabels.orders.icon, color: this.content.statsLabels.orders.color, suffix: this.content.statsLabels.orders.suffix },
          { label: this.content.statsLabels.users.title, value: data.totalUsers, icon: this.content.statsLabels.users.icon, color: this.content.statsLabels.users.color, suffix: this.content.statsLabels.users.suffix },
          { label: this.content.statsLabels.pending.title, value: data.pendingOrders, icon: this.content.statsLabels.pending.icon, color: this.content.statsLabels.pending.color, suffix: this.content.statsLabels.pending.suffix },
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
      labels: this.content.chart.labels,
      datasets: [{
        data: data,
        backgroundColor: this.content.chart.colors,
        borderWidth: this.content.chart.borderWidth,
      }]
    });
  }
}
