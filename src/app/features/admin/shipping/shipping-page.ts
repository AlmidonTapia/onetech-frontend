import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { AgenciesTableComponent } from './components/agencies-table/agencies-table';
import { RatesTableComponent } from './components/rates-table/rates-table';
import { LocationsTableComponent } from './components/locations-table/locations-table';

@Component({
  selector: 'app-shipping-page',
  standalone: true,
  imports: [CommonModule, TabsModule, AgenciesTableComponent, RatesTableComponent, LocationsTableComponent],
  templateUrl: './shipping-page.html'
})
export class ShippingPageComponent {}

