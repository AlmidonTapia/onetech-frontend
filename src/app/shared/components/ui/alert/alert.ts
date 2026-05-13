import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
  @Input() closeable = false;
  @Output() closed = new EventEmitter<void>();

  dismissed = false;

  readonly icons: Record<AlertType, string> = {
    success: 'pi-check-circle',
    error: 'pi-times-circle',
    warning: 'pi-exclamation-triangle',
    info: 'pi-info-circle',
  };

  get icon() { return this.icons[this.type]; }

  dismiss() {
    this.dismissed = true;
    this.closed.emit();
  }
}