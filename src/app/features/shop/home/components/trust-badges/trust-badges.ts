import { Component, inject, computed } from '@angular/core';

interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [],
  templateUrl: './trust-badges.html'
})
export class TrustBadgesComponent {
  trustItems = computed((): TrustItem[] => [
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
  ]);
}
