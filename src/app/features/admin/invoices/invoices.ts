import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { InvoiceService, Invoice } from '../../../core/domains/checkout/services/invoice.service';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, InvoicesTableComponent],
  templateUrl: './invoices.html'
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);  private destroyRef = inject(DestroyRef);
  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  totalRecords = signal(0);
  
  apiConfig = { pageSize: 10 };

  get content() {
    return {
      title: 'Comprobantes de Pago',
      badgeSuffix: ' boletas en total',
      table: {
        headers: {
          invoiceNumber: 'Nro Comprobante',
          orderId: 'ID Orden',
          client: 'Cliente / Correo',
          date: 'Fecha de Emisión',
          total: 'Monto Total',
          status: 'Estado',
          actions: 'Acciones'
        },
        emptyMessage: 'No hay comprobantes registrados.'
      },
      actions: {
        sendEmail: {
          title: '¿Reenviar comprobante por correo?',
          message: 'Se reenviará la boleta {invoiceNumber} al correo registrado.',
          confirmLabel: 'Sí, enviar'
        },
        annul: {
          title: '¿Anular comprobante de pago?',
          message: 'La boleta {invoiceNumber} será anulada permanentemente.',
          confirmLabel: 'Sí, anular'
        }
      }
    };
  }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);

    this.invoiceService.getAll(page, this.apiConfig.pageSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
      this.alertService.error('El enlace al PDF no está disponible.');
    }
  }

  onSendEmail(invoice: Invoice) {
    this.modalService.open({
      title: '¿Reenviar comprobante por correo?',
      message: `Se reenviará la boleta ${invoice.invoiceNumber} al correo registrado.`,
      severity: 'info',
      confirmLabel: 'Sí, enviar',
      onConfirm: () => {
        this.invoiceService.sendEmail(invoice.idInvoice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.alertService.success('Correo enviado exitosamente.');
          },
          error: (err: any) => {
            this.alertService.error(err?.error?.message || 'Error al enviar correo.');
          }
        });
      }
    });
  }

  onAnnul(invoice: Invoice) {
    this.modalService.open({
      title: '¿Anular comprobante de pago?',
      message: `La boleta ${invoice.invoiceNumber} será anulada permanentemente.`,
      severity: 'danger',
      confirmLabel: 'Sí, anular',
      onConfirm: () => {
        this.invoiceService.annul(invoice.idInvoice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.alertService.success('Comprobante anulado exitosamente.');
            this.loadInvoices();
          },
          error: (err: any) => {
            this.alertService.error(err?.error?.message || 'Error al anular comprobante.');
          }
        });
      }
    });
  }
}
