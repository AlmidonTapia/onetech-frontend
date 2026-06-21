import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, TitleCasePipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css'
})
export class UsersTableComponent {
  @Input() users: User[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ role: string, status: string }>();

  roleOptions = [
    { label: 'Todos los roles', value: 'ALL' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Cliente', value: 'CLIENT' }
  ];

  statusOptions = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  selectedRole = 'ALL';
  selectedStatus = 'ALL';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilter() {
    this.filterChange.emit({ role: this.selectedRole, status: this.selectedStatus });
  }

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    colspanEmpty: 5,
    adminRoleKey: 'ADMIN'
  } as const;

  content = {
    headers: {
      fullName: 'Nombre Completo',
      email: 'Email',
      role: 'Rol',
      phone: 'Teléfono',
      regDate: 'Fecha Registro'
    },
    quickSearchTitle: 'Búsqueda Rápida',
    searchPlaceholder: 'Buscar usuarios...',
    notRegisteredLabel: 'No registrado',
    emptyMessage: 'No hay usuarios registrados.',
    dateFormat: 'mediumDate'
  };
}
