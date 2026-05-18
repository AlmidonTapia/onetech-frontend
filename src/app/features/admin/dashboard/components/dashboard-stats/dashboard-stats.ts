import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  suffix: string;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css'
})
export class DashboardStatsComponent {
  @Input() stats: StatCard[] = [];

  content = {
    iconBaseClass: 'pi',
    iconColorPrefix: 'stat-icon--'
  } as const;
}
