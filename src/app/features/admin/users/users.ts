import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersTableComponent } from './components/users-table/users-table';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users', standalone: true,
  imports: [UsersTableComponent, CardComponent],
  templateUrl: './users.html', styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  ngOnInit() { this.loadUsers(); }

  loadUsers(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.userService.getAllUsers(page, 10).subscribe({
      next: r => { this.users.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
