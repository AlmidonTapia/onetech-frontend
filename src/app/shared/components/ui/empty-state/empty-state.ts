import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.html'
})
export class EmptyStateComponent {
  @Input() icon: string = 'pi-inbox';
  @Input() title: string = 'Sin resultados';
  @Input() description: string = 'No hay datos para mostrar en este momento.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() action = new EventEmitter<void>();
}
