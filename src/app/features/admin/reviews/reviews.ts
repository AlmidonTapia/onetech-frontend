import { Component, OnInit, inject, signal } from '@angular/core';
import { ReviewsTableComponent } from './components/reviews-table/reviews-table';
import { ReviewService } from '../../../core/domains/catalog/services/review.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Review } from '../../../core/domains/catalog/models/review.model';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReviewsTableComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);
  ts = inject(TranslationService);
  t = this.ts.t;

  reviews = signal<Review[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  filterRating = signal<number | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  get content() {
    return {
      title: this.t().adminReviews.title,
      subtitle: this.t().adminReviews.subtitle,
      quickSearchTitle: this.t().adminReviews.quickSearchTitle,
      headers: {
        date: this.t().adminReviews.headers.date,
        product: this.t().adminReviews.headers.product,
        client: this.t().adminReviews.headers.client,
        rating: this.t().adminReviews.headers.rating,
        comment: this.t().adminReviews.headers.comment,
        status: this.t().adminReviews.headers.status,
        actions: this.t().adminReviews.headers.actions
      },
      emptyMessage: this.t().adminReviews.emptyMessage,
      searchPlaceholder: this.t().adminReviews.searchPlaceholder
    };
  }

  ngOnInit() {
    this.loadReviews({ first: 0, rows: 10 });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadReviews({ first: 0, rows: 10 });
  }

  onFilterChange(filters: { rating: number | undefined, status: string | undefined }) {
    this.filterRating.set(filters.rating);
    this.filterStatus.set(filters.status);
    this.loadReviews({ first: 0, rows: 10 });
  }

  loadReviews(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    this.reviewService.getAllReviews(page, event.rows, this.searchTerm(), this.filterRating(), this.filterStatus()).subscribe({
      next: (data: any) => {
        this.reviews.set(data.content);
        this.totalRecords.set(data.totalElements);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminReviews.alerts.loadError);
        this.loading.set(false);
      }
    });
  }

  onApprove(idReview: string) {
    this.reviewService.updateStatus(idReview, 'APPROVED').subscribe({
      next: () => {
        this.alertService.success(this.t().adminReviews.alerts.approveSuccess);
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || this.t().adminReviews.alerts.approveError)
    });
  }

  onReject(idReview: string) {
    this.reviewService.updateStatus(idReview, 'REJECTED').subscribe({
      next: () => {
        this.alertService.success(this.t().adminReviews.alerts.rejectSuccess);
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || this.t().adminReviews.alerts.rejectError)
    });
  }

  onDelete(idReview: string) {
    this.reviewService.delete(idReview).subscribe({
      next: () => {
        this.alertService.success(this.t().adminReviews.alerts.deleteSuccess);
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || this.t().adminReviews.alerts.deleteError)
    });
  }
}
