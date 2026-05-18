import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class AlertComponent implements OnChanges {
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

  get icon(): string {
    return this.icons[this.type] || this.icons.info;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title'] || changes['type']) {
      this.dismissed = false;
    }
  }

  dismiss(): void {
    this.dismissed = true;
    this.closed.emit();
  }
}
