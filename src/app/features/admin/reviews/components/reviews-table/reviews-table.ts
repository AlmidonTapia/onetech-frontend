import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Review } from '../../../../../core/domains/catalog/models/review.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-reviews-table',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, RatingModule, FormsModule, CommonModule, TooltipModule, InputTextModule, SelectModule, ButtonComponent],
  templateUrl: './reviews-table.html'
})
export class ReviewsTableComponent {
  reviews = input.required<Review[]>();
  totalRecords = input<number>(0);
  loading = input<boolean>(false);
  content = input.required<any>();

  lazyLoad = output<any>();
  onApprove = output<string>();
  onReject = output<string>();
  onDelete = output<string>();
  search = output<string>();
  filterChange = output<{ rating: number | undefined, status: string | undefined }>();

  get ratingOptions() {
    return [
      { label: this.content().filters.allRatings, value: 'ALL' },
      { label: this.content().filters.stars.replace('{count}', '5'), value: 5 },
      { label: this.content().filters.stars.replace('{count}', '4'), value: 4 },
      { label: this.content().filters.stars.replace('{count}', '3'), value: 3 },
      { label: this.content().filters.stars.replace('{count}', '2'), value: 2 },
      { label: this.content().filters.star, value: 1 }
    ];
  }

  get statusOptions() {
    return [
      { label: this.content().filters.allStatuses, value: 'ALL' },
      { label: this.content().filters.approved, value: 'APPROVED' },
      { label: this.content().filters.pending, value: 'PENDING' },
      { label: this.content().filters.rejected, value: 'REJECTED' }
    ];
  }

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
      case 'APPROVED': return this.content().status.approved;
      case 'PENDING': return this.content().status.pending;
      case 'REJECTED': return this.content().status.rejected;
      default: return status;
    }
  }
}
