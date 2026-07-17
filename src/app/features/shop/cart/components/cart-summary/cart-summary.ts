import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CurrencyPenPipe],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css'
})
export class CartSummaryComponent {
  @Input() totalAmount = 0;
  @Input() itemCount = 0;
  @Input() paymentMethods: any[] = [];
  @Output() checkout = new EventEmitter<void>();

  ts = inject(TranslationService);
  t = this.ts.t;
}
