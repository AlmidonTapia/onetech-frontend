import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { AgenciesTableComponent } from './components/agencies-table/agencies-table';
import { RatesTableComponent } from './components/rates-table/rates-table';
import { LocationsTableComponent } from './components/locations-table/locations-table';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-shipping-page',
  standalone: true,
  imports: [CommonModule, TabsModule, AgenciesTableComponent, RatesTableComponent, LocationsTableComponent],
  templateUrl: './shipping-page.html',
  styleUrl: './shipping-page.css'
})
export class ShippingPageComponent {
  ts = inject(TranslationService);
  t = this.ts.t;
}

