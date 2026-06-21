import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../../../core/services/review.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-product-review-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RatingModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './product-review-form.html',
  styleUrl: './product-review-form.css'
})
export class ProductReviewFormComponent {
  @Input({ required: true }) productId!: string;
  @Output() reviewAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);

  loading = signal(false);

  content = {
    title: 'Escribe una Reseña',
    subtitle: '¿Qué te pareció este producto? Tu opinión ayuda a otros compradores.',
    fields: {
      rating: 'Calificación general',
      reviewTitle: 'Título de tu reseña',
      comment: '¿Qué es lo que más te gustó o no te gustó?'
    },
    submitLabel: 'Enviar Reseña',
    errors: {
      required: 'Este campo es obligatorio',
      ratingRequired: 'Selecciona al menos 1 estrella'
    }
  };

  form = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    title: ['', Validators.required],
    comment: ['', Validators.required]
  });

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value = this.form.value;

    this.reviewService.create({
      idProduct: this.productId,
      rating: value.rating as number,
      title: value.title as string,
      comment: value.comment as string
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset({ rating: 0, title: '', comment: '' });
        this.alertService.success('Reseña Publicada', 'Gracias por compartir tu opinión.');
        this.reviewAdded.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.alertService.error('Error', err.error?.message || 'No se pudo publicar la reseña.');
      }
    });
  }
}
