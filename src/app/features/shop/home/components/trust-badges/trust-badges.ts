import { Component } from '@angular/core';

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [],
  templateUrl: './trust-badges.html',
  styleUrl: './trust-badges.css'
})
export class TrustBadgesComponent {
  trustItems = [
    {
      icon: 'pi-truck',
      title: 'Envíos rápidos',
      description: 'Recibe tus productos en el menor tiempo posible, a nivel nacional.'
    },
    {
      icon: 'pi-shield',
      title: 'Compra segura',
      description: 'Pagos verificados y soporte personalizado para cada cliente.'
    },
    {
      icon: 'pi-verified',
      title: 'Calidad garantizada',
      description: 'Solo trabajamos con marcas reconocidas y productos 100% nuevos.'
    },
    {
      icon: 'pi-headphones',
      title: 'Soporte 24/7',
      description: 'Estamos aquí para ayudarte en cada etapa de tu compra.'
    }
  ];
}
