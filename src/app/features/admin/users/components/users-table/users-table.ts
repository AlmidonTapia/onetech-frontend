import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, TitleCasePipe],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css'
})
export class UsersTableComponent {
  @Input() users: User[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
}
