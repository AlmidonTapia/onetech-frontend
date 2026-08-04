import { Component, input, output, EventEmitter } from '@angular/core';
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
  templateUrl: './invoices-table.html'
})
export class InvoicesTableComponent {
  invoices = input.required<Invoice[]>();
  totalRecords = input<number>(0);
  loading = input<boolean>(false);
  content = input.required<any>();
  
  lazyLoad = output<any>();
  onDownload = output<Invoice>();
  onSendEmail = output<Invoice>();
  onAnnul = output<Invoice>();

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '900px',
    colspanEmpty: 7
  } as const;


  getStatusLabel(status: string): string {
    switch(status) {
      case 'EMITIDO': return this.content().status.issued;
      case 'ANULADO': return this.content().status.annulled;
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
