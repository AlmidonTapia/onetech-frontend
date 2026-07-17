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
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

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



  ts = inject(AppTranslationService);
  t = this.ts.t;

  get roleOptions() {
    return [
      { label: this.t().adminUsers.table.roles.all, value: 'ALL' },
      { label: this.t().adminUsers.table.roles.admin, value: UserRole.ADMIN },
      { label: this.t().adminUsers.table.roles.client, value: UserRole.CLIENT }
    ];
  }

  get statusOptions() {
    return [
      { label: this.t().adminUsers.table.statuses.all, value: 'ALL' },
      { label: this.t().adminUsers.table.statuses.enabled, value: UserStatus.HABILITADO },
      { label: this.t().adminUsers.table.statuses.disabled, value: UserStatus.DESHABILITADO }
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
        fullName: this.t().adminUsers.table.headers.fullName,
        email: this.t().adminUsers.table.headers.email,
        role: this.t().adminUsers.table.headers.role,
        status: this.t().adminUsers.table.headers.status,
        phone: this.t().adminUsers.table.headers.phone,
        regDate: this.t().adminUsers.table.headers.regDate
      },
      quickSearchTitle: this.t().adminUsers.table.quickSearchTitle,
      searchPlaceholder: this.t().adminUsers.table.searchPlaceholder,
      notRegisteredLabel: this.t().adminUsers.table.notRegisteredLabel,
      emptyMessage: this.t().adminUsers.table.emptyMessage,
      dateFormat: 'mediumDate'
    };
  }
}
