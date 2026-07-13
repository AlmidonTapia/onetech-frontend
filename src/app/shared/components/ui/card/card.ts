import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  hoverable = input<boolean>(false);
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
}