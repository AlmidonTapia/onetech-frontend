import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { InvoiceService, Invoice } from '../../../core/domains/checkout/services/invoice.service';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, InvoicesTableComponent],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  ts = inject(TranslationService);
  t = this.ts.t;

  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  totalRecords = signal(0);
  
  apiConfig = { pageSize: 10 };

  get content() {
    return {
      title: this.t().adminInvoices.title,
      badgeSuffix: this.t().adminInvoices.badgeSuffix,
    };
  }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);

    this.invoiceService.getAll(page, this.apiConfig.pageSize).subscribe({
      next: (data) => {
        this.invoices.set(data.content || []);
        this.totalRecords.set(data.totalElements || 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onDownload(invoice: Invoice) {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    } else {
      this.alertService.error(this.t().adminInvoices.alerts.pdfError);
    }
  }

  onSendEmail(invoice: Invoice) {
    this.modalService.open({
      title: this.t().adminInvoices.actions.sendEmail.title,
      message: this.t().adminInvoices.actions.sendEmail.message.replace('{invoiceNumber}', invoice.invoiceNumber),
      severity: 'info',
      confirmLabel: this.t().adminInvoices.actions.sendEmail.confirmLabel,
      onConfirm: () => {
        this.invoiceService.sendEmail(invoice.idInvoice).subscribe({
          next: () => {
            this.alertService.success(this.t().adminInvoices.alerts.emailSuccess);
          },
          error: (err: any) => {
            this.alertService.error(err?.error?.message || this.t().adminInvoices.alerts.emailError);
          }
        });
      }
    });
  }

  onAnnul(invoice: Invoice) {
    this.modalService.open({
      title: this.t().adminInvoices.actions.annul.title,
      message: this.t().adminInvoices.actions.annul.message.replace('{invoiceNumber}', invoice.invoiceNumber),
      severity: 'danger',
      confirmLabel: this.t().adminInvoices.actions.annul.confirmLabel,
      onConfirm: () => {
        this.invoiceService.annul(invoice.idInvoice).subscribe({
          next: () => {
            this.alertService.success(this.t().adminInvoices.alerts.annulSuccess);
            this.loadInvoices();
          },
          error: (err: any) => {
            this.alertService.error(err?.error?.message || this.t().adminInvoices.alerts.annulError);
          }
        });
      }
    });
  }
}
