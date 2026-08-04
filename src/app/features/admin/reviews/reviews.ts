import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReviewsTableComponent } from './components/reviews-table/reviews-table';
import { ReviewService } from '../../../core/domains/catalog/services/review.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Review } from '../../../core/domains/catalog/models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReviewsTableComponent],
  templateUrl: './reviews.html'
})
export class ReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  reviews = signal<Review[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  filterRating = signal<number | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  get content() {
    return {
      title: 'Reseñas',
      subtitle: 'Gestiona las reseñas de productos',
      countSuffix: 'reseñas en total',
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
      emptyMessage: 'No hay reseñas registradas.',
      searchPlaceholder: 'Buscar reseña...',
      actions: {
        approve: 'Aprobar',
        reject: 'Rechazar',
        restore: 'Restaurar'
      },
      filters: {
        allRatings: 'Todas las calificaciones',
        stars: 'Estrellas',
        star: 'Estrella',
        allStatuses: 'Todos los estados',
        approved: 'Aprobado',
        pending: 'Pendiente',
        rejected: 'Rechazado'
      },
      status: {
        approved: 'Aprobado',
        pending: 'Pendiente',
        rejected: 'Rechazado'
      }
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
    this.reviewService.getAllReviews(page, event.rows, this.searchTerm(), this.filterRating(), this.filterStatus()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: any) => {
        this.reviews.set(data.content);
        this.totalRecords.set(data.totalElements);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error('Error al cargar las reseñas');
        this.loading.set(false);
      }
    });
  }

  onApprove(idReview: string) {
    this.reviewService.updateStatus(idReview, 'APPROVED').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Reseña aprobada con éxito');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error('Error al aprobar la reseña')
    });
  }

  onReject(idReview: string) {
    this.reviewService.updateStatus(idReview, 'REJECTED').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Reseña rechazada con éxito');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error(err?.error?.message || 'Error al rechazar la reseña')
    });
  }

  onDelete(idReview: string) {
    this.reviewService.delete(idReview).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Reseña eliminada con éxito');
        this.loadReviews({ first: 0, rows: 10 });
      },
      error: (err: any) => this.alertService.error('Error al eliminar la reseña')
    });
  }
}
