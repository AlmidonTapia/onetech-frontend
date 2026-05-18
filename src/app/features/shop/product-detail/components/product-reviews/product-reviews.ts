import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StarRatingComponent } from '../../../../../shared/components/ui/star-rating/star-rating';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { QualificationService } from '../../../../../core/services/qualification.service';
import { Qualification } from '../../../../../core/models/qualification.model';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [FormsModule, StarRatingComponent, ButtonComponent, DatePipe],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css'
})
export class ProductReviewsComponent implements OnInit {
  private qualService = inject(QualificationService);
  private alertService = inject(AlertService);
  authService = inject(AuthService);

  @Input() productId!: string;

  reviews = signal<Qualification[]>([]);
  loading = signal(false);
  sending = signal(false);
  showForm = signal(false);

  newRating = 0;
  newComment = '';

  content = {
    mainTitle: 'Reseñas de clientes',
    writeBtnLabel: 'Escribir reseña',
    writeBtnIcon: 'pi-pencil',
    formTitle: 'Tu reseña',
    ratingLabel: 'Puntuación',
    commentLabel: 'Comentario',
    commentPlaceholder: 'Cuéntanos tu experiencia...',
    loadingLabel: 'Cargando reseñas...',
    emptyTitle: 'Aún no hay reseñas. ¡Sé el primero en opinar!',
    defaultAvatarLetter: 'U',
    dateFormat: 'dd/MM/yyyy',
    actions: {
      cancelLabel: 'Cancelar',
      submitLabel: 'Publicar reseña'
    },
    alerts: {
      warnTitle: 'Completa la reseña',
      warnMsg: 'Selecciona una puntuación y escribe tu comentario.',
      successMsg: 'Reseña enviada',
      errorMsg: 'Error al enviar reseña'
    }
  };

  ngOnInit() { this.loadReviews(); }

  loadReviews() {
    this.loading.set(true);
    this.qualService.getByProduct(this.productId).subscribe({
      next: r => { this.reviews.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSubmit() {
    if (this.newRating === 0 || !this.newComment.trim()) {
      this.alertService.warn(this.content.alerts.warnTitle, this.content.alerts.warnMsg);
      return;
    }
    this.sending.set(true);
    this.qualService.create({ idProduct: this.productId, rating: this.newRating, commentText: this.newComment }).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.successMsg);
        this.newRating = 0;
        this.newComment = '';
        this.showForm.set(false);
        this.sending.set(false);
        this.loadReviews();
      },
      error: () => {
        this.alertService.error(this.content.alerts.errorMsg);
        this.sending.set(false);
      }
    });
  }
}
