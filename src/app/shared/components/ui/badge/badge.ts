import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'gray' | 'blue';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<BadgeVariant>('gray');
  dot = input<boolean>(false);
  pill = input<boolean>(true);
}