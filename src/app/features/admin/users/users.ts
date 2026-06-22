import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { UsersTableComponent } from './components/users-table/users-table';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UsersTableComponent],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  users = signal<User[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  searchSubject = new Subject<string>();
  filterRole = signal<string | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  apiConfig = {
    pageSize: 10
  };

  content = {
    title: 'Usuarios',
    countSuffix: 'usuarios registrados',
    cardPadding: 'none',
    quickSearchTitle: 'Búsqueda Rápida',
    searchPlaceholder: 'Nombre, email, DNI...'
  } as const; 

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadUsers({ first: 0, rows: this.apiConfig.pageSize });
    });
    this.loadUsers();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onFilterChange(filters: { role: string, status: string }) {
    this.filterRole.set(filters.role === 'ALL' ? undefined : filters.role);
    this.filterStatus.set(filters.status === 'ALL' ? undefined : filters.status);
    this.loadUsers({ first: 0, rows: this.apiConfig.pageSize });
  }

  loadUsers(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);

    this.userService.getAllUsers(page, this.apiConfig.pageSize, this.searchTerm(), this.filterRole(), this.filterStatus()).subscribe({
      next: r => {
        this.users.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
