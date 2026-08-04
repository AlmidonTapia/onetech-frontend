import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ShipmentMethod } from '../../../../../../../core/domains/shipping/models/shipment.model';
import { CurrencyPenPipe } from '../../../../../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-shipments-method-table',
  standalone: true,
  imports: [CommonModule, TableModule, CurrencyPenPipe, InputTextModule, ButtonComponent],
  templateUrl: './shipments-method-table.html'
})
export class ShipmentsMethodTableComponent {
  methods = input.required<ShipmentMethod[]>();
  loading = input<boolean>(false);
  content = input.required<any>();
  
  onEdit = output<ShipmentMethod>();
  onDelete = output<ShipmentMethod>();
  search = output<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  edit(method: ShipmentMethod) {
    this.onEdit.emit(method);
  }

  remove(method: ShipmentMethod) {
    this.onDelete.emit(method);
  }
}
