import { Component, OnInit, inject, signal } from '@angular/core';
import { ReviewsTableComponent } from './components/reviews-table/reviews-table';
import { ReviewService } from '../../../core/domains/catalog/services/review.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Review } from '../../../core/domains/catalog/models/review.model';

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

  reviews = signal<Review[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  filterRating = signal<number | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  content = {
    title: 'Moderación de Reseñas',
    subtitle: 'Administra, aprueba o elimina las opiniones dejadas por los clientes en los productos.',
    quickSearchTitle: 'Búsqueda Rápida',
    headers: {
      date: 'Fecha',
      product: 'Producto',
      client: 'Cliente',
      rating: 'Calificación',
      comment: 'Comentario',
      status: 'Estado',
      actions: 'Acciones'
    },
    emptyMessage: 'No hay reseñas registradas aún.',
    searchPlaceholder: 'Comentario o título...'
  };

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
        this.alertService.error(err?.error?.message || 'Error al cargar reseñas');
        this.loading.set(false);
      }
    });
  }

  onApprove(idReview: string) {
    this.reviewService.updateStatus(idReview, 'APPROVED').subscribe({
      next: () => {
        this.alertService.success('Reseña aprobada');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || 'Error al aprobar reseña')
    });
  }

  onReject(idReview: string) {
    this.reviewService.updateStatus(idReview, 'REJECTED').subscribe({
      next: () => {
        this.alertService.success('Reseña rechazada');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || 'Error al rechazar reseña')
    });
  }

  onDelete(idReview: string) {
    this.reviewService.delete(idReview).subscribe({
      next: () => {
        this.alertService.success('Reseña eliminada');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || 'Error al eliminar reseña')
    });
  }
}
