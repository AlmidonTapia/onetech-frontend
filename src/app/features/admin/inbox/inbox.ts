import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage } from '../../../core/models/contact.model';
import { InboxTableComponent } from './components/inbox-table/inbox-table';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule,  InboxTableComponent],
  templateUrl: './inbox.html'
})
export class InboxComponent implements OnInit {
  private contactService = inject(ContactService);

  messages = signal<ContactMessage[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  unreadCount = signal<number>(0);

  content = {
    title: 'Bandeja de Entrada',
    subtitle: 'Gestiona los mensajes enviados por los clientes desde el formulario de contacto.',
    badgeSuffix: ' no leídos',
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Nombre, email o asunto...',
      emptyMessage: 'No hay mensajes en la bandeja de entrada.',
      headers: {
        date: 'Fecha',
        name: 'Nombre',
        email: 'Email',
        subject: 'Asunto',
        status: 'Estado',
        actions: 'Acciones'
      },
      statusLabels: {
        unread: 'No Leído',
        read: 'Leído',
        replied: 'Respondido'
      },
      icons: {
        view: 'pi pi-eye',
        reply: 'pi pi-reply',
        delete: 'pi pi-trash'
      }
    }
  } as const;

  ngOnInit() {
    this.loadMessages({ first: 0, rows: 10 });
  }

  loadMessages(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;
    const search = event.globalFilter || '';

    this.contactService.getAll(page, size, search).subscribe({
      next: (response) => {
        this.messages.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(term: string) {
    this.loadMessages({ first: 0, rows: 10, globalFilter: term });
  }

  onStatusChange(event: { id: string, status: 'UNREAD' | 'READ' | 'REPLIED' }) {
    this.contactService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        this.loadMessages({ first: 0, rows: 10 });
      }
    });
  }

  onDelete(id: string) {
    this.contactService.deleteMessage(id).subscribe({
      next: () => {
        this.loadMessages({ first: 0, rows: 10 });
      }
    });
  }
}
