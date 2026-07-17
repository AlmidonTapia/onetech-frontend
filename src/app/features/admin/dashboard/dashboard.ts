import { Component, OnInit, inject, signal } from '@angular/core';
import { Order } from '../../../core/domains/checkout/models/order.model';
import { DashboardStatsComponent, StatCard } from './components/dashboard-stats/dashboard-stats';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart';
import { DashboardRecentOrdersComponent } from './components/dashboard-recent-orders/dashboard-recent-orders';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { DashboardService } from '../../../core/domains/shared/services/dashboard.service';
import { TranslationService } from '../../../core/services/translation.service';

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
  ts = inject(TranslationService);
  t = this.ts.t;

  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentOrders = signal<Order[]>([]);
  chartData = signal<any>(null);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set([
          { label: this.t().adminDashboard.stats.productsTitle, value: data.totalProducts, icon: 'pi-box', color: 'blue', suffix: this.t().adminDashboard.stats.productsSuffix },
          { label: this.t().adminDashboard.stats.ordersTitle, value: data.totalOrders, icon: 'pi-receipt', color: 'orange', suffix: this.t().adminDashboard.stats.ordersSuffix },
          { label: this.t().adminDashboard.stats.usersTitle, value: data.totalUsers, icon: 'pi-users', color: 'green', suffix: this.t().adminDashboard.stats.usersSuffix },
          { label: this.t().adminDashboard.stats.pendingTitle, value: data.pendingOrders, icon: 'pi-clock', color: 'purple', suffix: this.t().adminDashboard.stats.pendingSuffix },
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
        this.t().adminDashboard.chart.labels.pending,
        this.t().adminDashboard.chart.labels.paid,
        this.t().adminDashboard.chart.labels.shipped,
        this.t().adminDashboard.chart.labels.completed,
        this.t().adminDashboard.chart.labels.cancelled
      ],
      datasets: [{
        data: data,
        backgroundColor: ['#d97706', '#0284c7', '#0047cc', '#16a34a', '#dc2626'],
        borderWidth: 0,
      }]
    });
  }
}
