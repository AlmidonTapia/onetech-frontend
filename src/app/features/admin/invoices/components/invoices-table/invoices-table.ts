import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Invoice } from '../../../../../core/domains/checkout/services/invoice.service';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [TableModule, TagModule, TooltipModule, CurrencyPenPipe, DatePipe, ButtonComponent],
  templateUrl: './invoices-table.html',
  styleUrl: './invoices-table.css'
})
export class InvoicesTableComponent {
  @Input() invoices: Invoice[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() onDownload = new EventEmitter<Invoice>();
  @Output() onSendEmail = new EventEmitter<Invoice>();
  @Output() onAnnul = new EventEmitter<Invoice>();

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '900px',
    colspanEmpty: 7
  } as const;

  content = {
    emptyMessage: 'No hay comprobantes registrados.',
    headers: {
      invoiceNumber: 'Nro Comprobante',
      orderId: 'ID Orden',
      client: 'Cliente / Correo',
      date: 'Fecha de Emisión',
      total: 'Monto Total',
      status: 'Estado',
      actions: 'Acciones'
    },
    tooltips: {
      download: 'Descargar PDF',
      sendEmail: 'Reenviar Correo',
      annul: 'Anular Boleta'
    },
    icons: {
      download: 'pi pi-download',
      sendEmail: 'pi pi-envelope',
      annul: 'pi pi-times-circle'
    }
  };

  getStatusLabel(status: string): string {
    switch(status) {
      case 'EMITIDO': return 'Emitido';
      case 'ANULADO': return 'Anulado';
      default: return status;
    }
  }

  getStatusSeverity(status: string): SeverityType {
    switch(status) {
      case 'EMITIDO': return 'success';
      case 'ANULADO': return 'danger';
      default: return 'info';
    }
  }
}
