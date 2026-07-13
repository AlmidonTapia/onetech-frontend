import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  type = input<AlertType>('info');
  title = input<string>('');
  closeable = input<boolean>(false);
  
  closed = output<void>();

  dismissed = signal(false);

  content = {
    closeAriaLabel: 'Cerrar'
  };

  readonly icons: Record<AlertType, string> = {
    success: 'pi-check-circle',
    error: 'pi-times-circle',
    warning: 'pi-exclamation-triangle',
    info: 'pi-info-circle',
  };

  icon = computed(() => this.icons[this.type()] || this.icons.info);

  constructor() {
    effect(() => {
      this.title();
      this.type();
      this.dismissed.set(false);
    }, { allowSignalWrites: true });
  }

  dismiss(): void {
    this.dismissed.set(true);
    this.closed.emit();
  }
}
