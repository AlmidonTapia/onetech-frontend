import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/domains/contact/services/contact.service';
import { ContactMessage } from '../../../core/domains/contact/models/contact.model';
import { InboxTableComponent } from './components/inbox-table/inbox-table';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule,  InboxTableComponent],
  templateUrl: './inbox.html'
})
export class InboxComponent implements OnInit {
  private contactService = inject(ContactService);
  private alertService = inject(AlertService);
  ts = inject(TranslationService);
  t = this.ts.t;

  messages = signal<ContactMessage[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  unreadCount = signal<number>(0);

  get content() {
    return {
      title: this.t().adminInbox.title,
      subtitle: this.t().adminInbox.subtitle,
      badgeSuffix: this.t().adminInbox.badgeSuffix,
      table: {
        quickSearchTitle: this.t().adminInbox.table.quickSearchTitle,
        searchPlaceholder: this.t().adminInbox.table.searchPlaceholder,
        emptyMessage: this.t().adminInbox.table.emptyMessage,
        headers: {
          date: this.t().adminInbox.table.headers.date,
          name: this.t().adminInbox.table.headers.name,
          email: this.t().adminInbox.table.headers.email,
          subject: this.t().adminInbox.table.headers.subject,
          status: this.t().adminInbox.table.headers.status,
          actions: this.t().adminInbox.table.headers.actions
        },
        statusLabels: {
          unread: this.t().adminInbox.table.statusLabels.unread,
          read: this.t().adminInbox.table.statusLabels.read,
          replied: this.t().adminInbox.table.statusLabels.replied
        },
        icons: {
          view: this.t().adminInbox.table.icons.view,
          reply: this.t().adminInbox.table.icons.reply,
          delete: this.t().adminInbox.table.icons.delete
        },
        actions: {
          markRead: this.t().adminInbox.table.actions.markRead,
          markUnread: this.t().adminInbox.table.actions.markUnread,
          markReplied: this.t().adminInbox.table.actions.markReplied,
          delete: this.t().adminInbox.table.actions.delete
        },
        confirmDelete: {
          title: this.t().adminInbox.table.confirmDelete.title,
          message: this.t().adminInbox.table.confirmDelete.message,
          acceptLabel: this.t().adminInbox.table.confirmDelete.acceptLabel,
          rejectLabel: this.t().adminInbox.table.confirmDelete.rejectLabel
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

    this.contactService.getAll(page, size, search).subscribe({
      next: (response) => {
        this.messages.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminInbox.alerts.loadError);
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string) {
    this.loadMessages({ first: 0, rows: 10, globalFilter: term });
  }

  onStatusChange(event: { id: string, status: 'UNREAD' | 'READ' | 'REPLIED' }) {
    this.contactService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        this.loadMessages({ first: 0, rows: 10 });
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminInbox.alerts.statusError);
      }
    });
  }

  onDelete(id: string) {
    this.contactService.deleteMessage(id).subscribe({
      next: () => {
        this.alertService.success(this.t().adminInbox.alerts.deleteSuccess);
        this.loadMessages({ first: 0, rows: 10 });
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminInbox.alerts.deleteError);
      }
    });
  }
}
