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

  chartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } }
    },
    cutout: '65%',
  };

  ngOnChanges() {
    // PrimeNG Chart re-renders when data input changes
  }
}