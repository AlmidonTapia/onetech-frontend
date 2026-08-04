import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-payment-methods-table',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, ButtonComponent],
  templateUrl: './payment-methods-table.html'
})
export class PaymentMethodsTableComponent {
  methods = input.required<PaymentMethod[]>();
  loading = input<boolean>(false);
  content = input.required<any>();
  
  onEdit = output<PaymentMethod>();
  onDelete = output<PaymentMethod>();
  search = output<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  edit(method: PaymentMethod) {
    this.onEdit.emit(method);
  }

  remove(method: PaymentMethod) {
    this.onDelete.emit(method);
  }
}
