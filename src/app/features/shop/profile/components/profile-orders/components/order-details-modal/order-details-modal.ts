import { Component, input, output, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CurrencyPenPipe } from '../../../../../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, DatePipe, CurrencyPenPipe, ButtonComponent],
  templateUrl: './order-details-modal.html'
})
export class OrderDetailsModalComponent {
  visible = input.required<boolean>();
  order = input<any>(null);
  shipment = input<any>(null);
  invoice = input<any>(null);
  isAdmin = input<boolean>(false);

  onClose = output<void>();
  onDownloadInvoice = output<string>();
  onGenerateInvoice = output<void>();

  closeModal() {
    this.onClose.emit();
  }

  downloadInvoice(idInvoice: string) {
    this.onDownloadInvoice.emit(idInvoice);
  }

  getShipmentStatusLabel(status: string): string {
    switch(status) {
      case 'PENDING': return 'Pendiente';
      case 'DISPATCHED': return 'Despachado';
      case 'IN_TRANSIT': return 'En tránsito';
      case 'DELIVERED': return 'Entregado';
      case 'RETURNED': return 'Devuelto';
      default: return status;
    }
  }
}
