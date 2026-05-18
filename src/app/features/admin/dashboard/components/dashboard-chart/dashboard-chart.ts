import { Component, Input, OnChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './dashboard-chart.html',
  styleUrl: './dashboard-chart.css'
})
export class DashboardChartComponent implements OnChanges {
  @Input() data: any = null;

  content = {
    title: 'Órdenes por estado',
    subtitle: 'últimas 10 órdenes',
    emptyMessage: 'Sin datos disponibles',
    chartType: 'doughnut',
    chartHeight: '240'
  } as const;

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { padding: 16, font: { size: 12 } }
      }
    },
    cutout: '65%',
  };

  ngOnChanges() {
    // El gráfico de PrimeNG se vuelve a renderizar automáticamente al mutar el @Input data
  }
}
