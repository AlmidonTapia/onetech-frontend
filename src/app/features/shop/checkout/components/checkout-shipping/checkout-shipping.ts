import { Component, Output, EventEmitter, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { UbigeoService } from '../../../../../core/domains/shipping/services/ubigeo.service';
import { SpinnerComponent } from '../../../../../shared/components/ui/spinner/spinner';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CurrencyPenPipe, SpinnerComponent],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.css'
})
export class CheckoutShippingComponent implements OnChanges {
  @Input() ubigeoCode?: string;
  @Output() selected = new EventEmitter<ShipmentMethod | null>();

  private ubigeoService = inject(UbigeoService);

  methods = signal<ShipmentMethod[]>([]);
  selectedId = signal<string | null>(null);
  loading = signal(false);

  ts = inject(TranslationService);
  t = this.ts.t;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ubigeoCode'] && this.ubigeoCode) {
      this.loadRates(this.ubigeoCode);
    }
  }

  loadRates(ubigeoCode: string) {
    this.loading.set(true);
    this.methods.set([]);
    this.ubigeoService.getRates(ubigeoCode).subscribe(rates => {
      const availableRates = rates.filter(r => r.isAvailable);
      const mappedMethods: ShipmentMethod[] = availableRates.map(r => ({
        idShipmentMethod: r.idShipmentMethod,
        methodName: r.methodName,
        basePrice: r.finalCost
      }));

      this.methods.set(mappedMethods);
      this.loading.set(false);
      if (mappedMethods.length) {
        this.selectedId.set(mappedMethods[0].idShipmentMethod);
        this.selected.emit(mappedMethods[0]);
      } else {
        this.selectedId.set(null);
        this.selected.emit(null);
      }
    });
  }

  select(method: ShipmentMethod) {
    this.selectedId.set(method.idShipmentMethod);
    this.selected.emit(method);
  }
}
