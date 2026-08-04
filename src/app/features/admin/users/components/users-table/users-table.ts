import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { User } from '../../../../../core/domains/identity/models/user.model';
import { UserRole } from '../../../../../core/domains/identity/enums/user-role.enum';
import { UserStatus } from '../../../../../core/domains/identity/enums/user-status.enum';
import { inject } from '@angular/core';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, TitleCasePipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './users-table.html'
})
export class UsersTableComponent {
  @Input() users: User[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  @Output() filterChange = new EventEmitter<{role: string, status: string}>();
  get roleOptions() {
    return [
      { label: 'Todos los roles', value: 'ALL' },
      { label: 'Admin', value: UserRole.ADMIN },
      { label: 'Cliente', value: UserRole.CLIENT }
    ];
  }

  get statusOptions() {
    return [
      { label: 'Todos los estados', value: 'ALL' },
      { label: 'Habilitado', value: UserStatus.HABILITADO },
      { label: 'Deshabilitado', value: UserStatus.DESHABILITADO }
    ];
  }

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
    colspanEmpty: 6,
    adminRoleKey: UserRole.ADMIN
  } as const;

  get content() {
    return {
      headers: {
        fullName: 'Nombre Completo',
        email: 'Email',
        role: 'Rol',
        status: 'Estado',
        phone: 'Teléfono',
        regDate: 'Fecha Registro'
      },
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Nombre, email, DNI...',
      notRegisteredLabel: 'No registrado',
      emptyMessage: 'No hay usuarios registrados.',
      dateFormat: 'mediumDate'
    };
  }
}
