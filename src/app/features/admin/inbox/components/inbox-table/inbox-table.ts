import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ContactMessage } from '../../../../../core/domains/contact/models/contact.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-inbox-table',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, MenuModule, DatePipe, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './inbox-table.html',
  styleUrl: './inbox-table.css'
})
export class InboxTableComponent {
  messages = input.required<ContactMessage[]>();
  totalRecords = input<number>(0);
  loading = input<boolean>(false);
  content = input.required<any>();
  
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{id: string, status: 'UNREAD' | 'READ' | 'REPLIED'}>();
  @Output() delete = new EventEmitter<string>();

  constructor(private confirmationService: ConfirmationService) {}

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.search.emit(term);
  }

  getMenuItems(message: ContactMessage): MenuItem[] {
    return [
      {
        label: this.content().actions.markRead,
        icon: this.content().icons.view,
        visible: message.status !== 'READ',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'READ' })
      },
      {
        label: this.content().actions.markUnread,
        icon: 'pi pi-eye-slash',
        visible: message.status === 'READ',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'UNREAD' })
      },
      {
        label: this.content().actions.markReplied,
        icon: this.content().icons.reply,
        visible: message.status !== 'REPLIED',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'REPLIED' })
      },
      {
        separator: true
      },
      {
        label: this.content().actions.delete,
        icon: this.content().icons.delete,
        styleClass: 'text-red-500',
        command: () => this.confirmDelete(message)
      }
    ];
  }

  confirmDelete(message: ContactMessage) {
    this.confirmationService.confirm({
      message: this.content().confirmDelete.message.replace('{name}', message.name),
      header: this.content().confirmDelete.title,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.content().confirmDelete.acceptLabel,
      rejectLabel: this.content().confirmDelete.rejectLabel,
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.delete.emit(message.idContactMessage);
      }
    });
  }
}
