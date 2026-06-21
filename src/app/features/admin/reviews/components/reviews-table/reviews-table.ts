import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Review } from '../../../../../core/models/review.model';

@Component({
  selector: 'app-reviews-table',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, RatingModule, FormsModule, CommonModule, TooltipModule, InputTextModule, SelectModule],
  templateUrl: './reviews-table.html'
})
export class ReviewsTableComponent {
  
  @Input() reviews: Review[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() content: any;

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() onApprove = new EventEmitter<string>();
  @Output() onReject = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ rating: number | undefined, status: string | undefined }>();

  ratingOptions = [
    { label: 'Todas las calif.', value: 'ALL' },
    { label: '5 Estrellas', value: 5 },
    { label: '4 Estrellas', value: 4 },
    { label: '3 Estrellas', value: 3 },
    { label: '2 Estrellas', value: 2 },
    { label: '1 Estrella', value: 1 }
  ];

  statusOptions = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Aprobado', value: 'APPROVED' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Rechazado', value: 'REJECTED' }
  ];

  selectedRating: any = 'ALL';
  selectedStatus = 'ALL';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilter() {
    this.filterChange.emit({
      rating: this.selectedRating === 'ALL' ? undefined : this.selectedRating,
      status: this.selectedStatus === 'ALL' ? undefined : this.selectedStatus
    });
  }

  approveClick(id: string) {
    this.onApprove.emit(id);
  }

  rejectClick(id: string) {
    this.onReject.emit(id);
  }

  deleteClick(id: string) {
    this.onDelete.emit(id);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warn';
      case 'REJECTED': return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'APPROVED': return 'Aprobado';
      case 'PENDING': return 'Pendiente';
      case 'REJECTED': return 'Rechazado';
      default: return status;
    }
  }
}
