import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/domains/contact/services/contact.service';
import { ContactMessage } from '../../../core/domains/contact/models/contact.model';
import { InboxTableComponent } from './components/inbox-table/inbox-table';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule,  InboxTableComponent],
  templateUrl: './inbox.html'
})
export class InboxComponent implements OnInit {
  private contactService = inject(ContactService);
  private alertService = inject(AlertService);  private destroyRef = inject(DestroyRef);
  messages = signal<ContactMessage[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  unreadCount = signal<number>(0);

  get content() {
    return {
      title: 'Bandeja de Entrada',
      subtitle: 'Gestiona los mensajes de contacto',
      badgeSuffix: ' mensajes',
      table: {
        quickSearchTitle: 'Búsqueda Rápida',
        searchPlaceholder: 'Buscar mensaje...',
        emptyMessage: 'No hay mensajes.',
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
          view: 'Ver',
          reply: 'Responder',
          delete: 'Eliminar'
        },
        actions: {
          markRead: 'Marcar como leído',
          markUnread: 'Marcar como no leído',
          markReplied: 'Marcar como respondido',
          delete: 'Eliminar'
        },
        confirmDelete: {
          title: '¿Eliminar mensaje?',
          message: 'El mensaje será eliminado permanentemente.',
          acceptLabel: 'Sí, eliminar',
          rejectLabel: 'Cancelar'
        }
      }
    };
  }

  ngOnInit() {
    this.loadMessages({ first: 0, rows: 10 });
  }

  loadMessages(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;
    const search = event.globalFilter || '';

    this.contactService.getAll(page, size, search).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.messages.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al cargar mensajes');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string) {
    this.loadMessages({ first: 0, rows: 10, globalFilter: term });
  }

  onStatusChange(event: { id: string, status: 'UNREAD' | 'READ' | 'REPLIED' }) {
    this.contactService.updateStatus(event.id, event.status).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loadMessages({ first: 0, rows: 10 });
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al cambiar estado');
      }
    });
  }

  onDelete(id: string) {
    this.contactService.deleteMessage(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Mensaje eliminado');
        this.loadMessages({ first: 0, rows: 10 });
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al eliminar');
      }
    });
  }
}
