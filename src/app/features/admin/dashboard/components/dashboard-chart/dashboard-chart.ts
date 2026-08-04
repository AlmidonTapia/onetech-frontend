import { Component, Input, OnChanges, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './dashboard-chart.html'
})
export class DashboardChartComponent implements OnChanges {
  @Input() data: any = null;
  get content() {
    return {
      title: 'Órdenes por estado',
      subtitle: 'últimas 10 órdenes',
      emptyMessage: 'Sin datos disponibles',
      chartType: 'doughnut' as const,
      chartHeight: '240'
    };
  }

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
  }
}
