import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'gray' | 'blue';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.html',
  styleUrl: './badge.css'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'gray';
  @Input() dot = false;
  @Input() pill = true;
}