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

  ngOnInit() { this.loadDashboard(); }

  loadDashboard() {
    this.loading.set(true);

    forkJoin({
      products: this.productService.getAll({ page: 0, size: 1 }),
      orders: this.orderService.getAll(0, 10),
      users: this.userService.getAllUsers(0, 1),
    }).subscribe({
      next: ({ products, orders, users }) => {
        const pending = orders.content.filter(o => o.status === 'PENDIENTE').length;

        this.stats.set([
          { label: 'Productos', value: products.totalElements, icon: 'pi-box', color: 'blue', suffix: 'registrados' },
          { label: 'Órdenes', value: orders.totalElements, icon: 'pi-receipt', color: 'orange', suffix: 'en total' },
          { label: 'Usuarios', value: users.totalElements, icon: 'pi-users', color: 'green', suffix: 'registrados' },
          { label: 'Pendientes', value: pending, icon: 'pi-clock', color: 'purple', suffix: 'por procesar' },
        ]);

        this.recentOrders.set(orders.content.slice(0, 5));
        this.buildChartData(orders.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private buildChartData(orders: Order[]) {
    const count: Record<string, number> = {
      PENDIENTE: 0, PAGADO: 0, EN_PROCESO: 0,
      ENVIADO: 0, ENTREGADO: 0, CANCELADO: 0
    };
    orders.forEach(o => { if (count[o.status] !== undefined) count[o.status]++; });

    this.chartData.set({
      labels: ['Pendiente', 'Pagado', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'],
      datasets: [{
        data: Object.values(count),
        backgroundColor: ['#d97706', '#0284c7', '#4d88ff', '#0047cc', '#16a34a', '#dc2626'],
        borderWidth: 0,
      }]
    });
  }
}