import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [FormsModule, RatingModule],
  templateUrl: './star-rating.html'
})
export class StarRatingComponent implements OnChanges {
  @Input() value = 0;
  @Input() readonly = true;
  @Input() count?: number;
  @Input() showCount = true;
  @Output() valueChange = new EventEmitter<number>();

  rating = 0;

  content = {
    reviewsSuffix: 'reseñas'
  };

  ngOnChanges() {
    this.rating = this.value;
  }

  onRate(val: number) {
    if (!this.readonly) {
      this.valueChange.emit(val);
    }
  }
}
