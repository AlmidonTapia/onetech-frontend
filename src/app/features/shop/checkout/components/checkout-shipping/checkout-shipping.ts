import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ShipmentService } from '../../../../../core/services/shipment.service';
import { ShipmentMethod } from '../../../../../core/models/shipment.model';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CurrencyPenPipe],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.css'
})
export class CheckoutShippingComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  @Output() selected = new EventEmitter<ShipmentMethod>();

  methods = signal<ShipmentMethod[]>([]);
  selectedId = signal<string | null>(null);

  content = {
    title: 'Método de envío',
    titleIcon: 'pi pi-truck'
  };

  ngOnInit() {
    this.shipmentService.getMethods(true).subscribe(methods => {
      this.methods.set(methods);

      if (methods.length) {
        const currentSelection = methods.find(m => m.idShipmentMethod === this.selectedId()) ?? methods[0];
        this.selectedId.set(currentSelection.idShipmentMethod);
        this.selected.emit(currentSelection);
      }
    });
  }

  select(method: ShipmentMethod) {
    this.selectedId.set(method.idShipmentMethod);
    this.selected.emit(method);
  }
}
