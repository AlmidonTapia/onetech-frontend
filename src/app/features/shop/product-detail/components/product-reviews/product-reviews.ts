import { Component, Input, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../../../../shared/components/ui/star-rating/star-rating';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { AuthService } from '../../../../../core/domains/identity/services/auth.service';
import { ReviewService } from '../../../../../core/domains/catalog/services/review.service';
import { Review } from '../../../../../core/domains/catalog/models/review.model';
import { InputTextModule } from 'primeng/inputtext';
import { SpinnerComponent } from '../../../../../shared/components/ui/spinner/spinner';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StarRatingComponent, ButtonComponent, DatePipe, DecimalPipe, InputTextModule, SpinnerComponent],
  templateUrl: './product-reviews.html'
})
export class ProductReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);
  authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  @Input() productId!: string;

  reviews = signal<Review[]>([]);
  loading = signal(false);
  sending = signal(false);
  showForm = signal(false);

  newRating = 0;
  newTitle = '';
  newComment = '';

  averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return sum / revs.length;
  });

  ratingCounts = computed(() => {
    const revs = this.reviews();
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    revs.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating as keyof typeof counts]++;
      }
    });
    return [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars as keyof typeof counts],
      percentage: revs.length > 0 ? (counts[stars as keyof typeof counts] / revs.length) * 100 : 0
    }));
  });

  content = {
    mainTitle: 'Reseñas de clientes',
    writeBtnLabel: 'Escribir reseña',
    writeBtnIcon: 'pi-pencil',
    formTitle: 'Tu reseña',
    ratingLabel: 'Puntuación',
    titleLabel: 'Título de la reseña',
    titlePlaceholder: 'Ej. ¡Excelente producto!',
    commentLabel: 'Comentario',
    commentPlaceholder: 'Cuéntanos tu experiencia completa...',
    loadingLabel: 'Cargando reseñas...',
    emptyTitle: 'Aún no hay reseñas. ¡Sé el primero en opinar!',
    defaultAvatarLetter: 'U',
    dateFormat: 'dd/MM/yyyy',
    totalReviewsLabel: 'reseñas en total',
    actions: {
      cancelLabel: 'Cancelar',
      submitLabel: 'Publicar reseña'
    },
    alerts: {
      warnTitle: 'Faltan datos',
      warnMsg: 'Completa la puntuación, el título y el comentario.',
      successMsg: 'Reseña enviada',
      errorMsg: 'Error al enviar reseña'
    }
  };

  ngOnInit() { this.loadReviews(); }

  loadReviews() {
    this.loading.set(true);
    this.reviewService.getByProduct(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: r => { this.reviews.set(r.content); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  onSubmit() {
    if (this.newRating === 0 || !this.newTitle.trim() || !this.newComment.trim()) {
      this.alertService.warn(this.content.alerts.warnTitle, this.content.alerts.warnMsg);
      return;
    }
    this.sending.set(true);
    this.reviewService.create({ 
      idProduct: this.productId, 
      rating: this.newRating, 
      title: this.newTitle, 
      comment: this.newComment 
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.success(this.content.alerts.successMsg);
          this.newRating = 0;
          this.newTitle = '';
          this.newComment = '';
          this.showForm.set(false);
          this.sending.set(false);
          this.loadReviews();
        },
        error: (err) => {
          const msg = err.error?.message || this.content.alerts.errorMsg;
          this.alertService.error(msg);
          this.sending.set(false);
        }
      });
  }
}
