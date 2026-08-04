import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, ButtonComponent],
  templateUrl: './alert.html',
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

  baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full transition-all duration-300 font-medium border backdrop-blur-md';

  typeClasses = computed(() => {
    switch (this.type()) {
      case 'success':
        return 'bg-green-100/85 text-green-700 border-green-600/30 dark:bg-green-600/15 dark:text-green-500';
      case 'error':
        return 'bg-red-100/85 text-red-700 border-red-600/30 dark:bg-red-600/15 dark:text-red-500';
      case 'warning':
        return 'bg-amber-100/85 text-amber-700 border-amber-600/30 dark:bg-amber-600/15 dark:text-amber-500';
      case 'info':
      default:
        return 'bg-sky-100/85 text-sky-700 border-sky-600/30 dark:bg-sky-600/15 dark:text-sky-500';
    }
  });

  computedClasses = computed(() => {
    return `${this.baseClasses} ${this.typeClasses()}`;
  });

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
