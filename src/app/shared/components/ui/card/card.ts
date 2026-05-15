import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  @Input() hoverable = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
}