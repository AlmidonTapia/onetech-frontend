import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() messages: ContactMessage[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() content: any;
  
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
        label: 'Marcar como Leído',
        icon: 'pi pi-eye',
        visible: message.status !== 'READ',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'READ' })
      },
      {
        label: 'Marcar como No Leído',
        icon: 'pi pi-eye-slash',
        visible: message.status === 'READ',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'UNREAD' })
      },
      {
        label: 'Marcar como Respondido',
        icon: 'pi pi-reply',
        visible: message.status !== 'REPLIED',
        command: () => this.statusChange.emit({ id: message.idContactMessage, status: 'REPLIED' })
      },
      {
        separator: true
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.confirmDelete(message)
      }
    ];
  }

  confirmDelete(message: ContactMessage) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el mensaje de ${message.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.delete.emit(message.idContactMessage);
      }
    });
  }
}
