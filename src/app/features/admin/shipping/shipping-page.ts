import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { AgenciesTableComponent } from './components/agencies-table/agencies-table';
import { RatesTableComponent } from './components/rates-table/rates-table';

@Component({
  selector: 'app-shipping-page',
  standalone: true,
  imports: [CommonModule, TabsModule, AgenciesTableComponent, RatesTableComponent],
  templateUrl: './shipping-page.html',
  styleUrl: './shipping-page.css'
})
export class ShippingPageComponent {
  content = {
    title: 'Logística y Envíos',
    description: 'Gestiona las agencias de envío disponibles y configura las tarifas o cobertura por Ubigeo.',
    tabs: {
      agencies: 'Agencias / Métodos',
      rates: 'Cobertura y Tarifas'
    }
  } as const;
}
