import { Component, Input, OnChanges, inject } from '@angular/core';
import { TranslationService } from '../../../../../core/services/translation.service';
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

  ts = inject(TranslationService);
  t = this.ts.t;

  get content() {
    return {
      title: this.t().adminDashboard.chart.title,
      subtitle: this.t().adminDashboard.chart.subtitle,
      emptyMessage: this.t().adminDashboard.chart.emptyMessage,
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
