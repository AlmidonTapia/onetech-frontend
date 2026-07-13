import { Component, Output, EventEmitter, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { UbigeoService } from '../../../../../core/domains/shipping/services/ubigeo.service';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CurrencyPenPipe],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.css'
})
export class CheckoutShippingComponent implements OnChanges {
  @Input() ubigeoCode?: string;
  @Output() selected = new EventEmitter<ShipmentMethod>();

  private ubigeoService = inject(UbigeoService);

  methods = signal<ShipmentMethod[]>([]);
  selectedId = signal<string | null>(null);

  content = {
    title: 'Método de envío',
    titleIcon: 'pi pi-truck',
    noAvailable: 'No hay métodos de envío disponibles para esta zona.'
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ubigeoCode'] && this.ubigeoCode) {
      this.loadRates(this.ubigeoCode);
    }
  }

  loadRates(ubigeoCode: string) {
    this.ubigeoService.getRates(ubigeoCode).subscribe(rates => {
      const availableRates = rates.filter(r => r.isAvailable);
      const mappedMethods: ShipmentMethod[] = availableRates.map(r => ({
        idShipmentMethod: r.idShipmentMethod,
        methodName: r.methodName,
        basePrice: r.finalCost
      }));

      this.methods.set(mappedMethods);
      if (mappedMethods.length) {
        this.selectedId.set(mappedMethods[0].idShipmentMethod);
        this.selected.emit(mappedMethods[0]);
      } else {
        this.selectedId.set(null);
        this.selected.emit(undefined as any);
      }
    });
  }

  select(method: ShipmentMethod) {
    this.selectedId.set(method.idShipmentMethod);
    this.selected.emit(method);
  }
}
