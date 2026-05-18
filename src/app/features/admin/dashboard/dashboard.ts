import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { DashboardStatsComponent, StatCard } from './components/dashboard-stats/dashboard-stats';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart';
import { DashboardRecentOrdersComponent } from './components/dashboard-recent-orders/dashboard-recent-orders';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardStatsComponent, DashboardChartComponent,
    DashboardRecentOrdersComponent, SpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentOrders = signal<Order[]>([]);
  chartData = signal<any>(null);

  apiConfig = {
    firstPage: 0,
    minSize: 1,
    ordersFetchSize: 10,
    recentOrdersLimit: 5
  };

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

    forkJoin({
      products: this.productService.getAll({ page: this.apiConfig.firstPage, size: this.apiConfig.minSize }),
      orders: this.orderService.getAll(this.apiConfig.firstPage, this.apiConfig.ordersFetchSize),
      users: this.userService.getAllUsers(this.apiConfig.firstPage, this.apiConfig.minSize),
    }).subscribe({
      next: ({ products, orders, users }) => {
        const pending = orders.content.filter(o => o.orderStatus === 'PENDIENTE').length;

        this.stats.set([
          { label: this.content.statsLabels.products.title, value: products.totalElements, icon: this.content.statsLabels.products.icon, color: this.content.statsLabels.products.color, suffix: this.content.statsLabels.products.suffix },
          { label: this.content.statsLabels.orders.title, value: orders.totalElements, icon: this.content.statsLabels.orders.icon, color: this.content.statsLabels.orders.color, suffix: this.content.statsLabels.orders.suffix },
          { label: this.content.statsLabels.users.title, value: users.totalElements, icon: this.content.statsLabels.users.icon, color: this.content.statsLabels.users.color, suffix: this.content.statsLabels.users.suffix },
          { label: this.content.statsLabels.pending.title, value: pending, icon: this.content.statsLabels.pending.icon, color: this.content.statsLabels.pending.color, suffix: this.content.statsLabels.pending.suffix },
        ]);

        this.recentOrders.set(orders.content.slice(0, this.apiConfig.recentOrdersLimit));
        this.buildChartData(orders.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private buildChartData(orders: Order[]) {
    const count: Record<string, number> = {
      PENDIENTE: 0, PAGADO: 0, ENVIADO: 0,
      COMPLETADO: 0, CANCELADO: 0
    };
    orders.forEach(o => { if (count[o.orderStatus] !== undefined) count[o.orderStatus]++; });

    this.chartData.set({
      labels: this.content.chart.labels,
      datasets: [{
        data: Object.values(count),
        backgroundColor: this.content.chart.colors,
        borderWidth: this.content.chart.borderWidth,
      }]
    });
  }
}
