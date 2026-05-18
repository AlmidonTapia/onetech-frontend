import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

interface PromoCard {
  customClass: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  icon: string;
  button: {
    variant: 'accent' | 'outline' | 'primary';
    label: string;
    route: string;
    queryParams?: Record<string, string>;
  };
}

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.css'
})
export class PromoBannerComponent {

  promoCards: PromoCard[] = [
    {
      customClass: 'promo-main',
      tag: '⚡ Ofertas del mes',
      titleLine1: 'Hasta 30% OFF',
      titleLine2: 'en laptops gaming',
      description: 'Aprovecha los mejores precios de la temporada.',
      icon: 'pi pi-desktop',
      button: {
        variant: 'accent',
        label: 'Ver ofertas',
        route: '/catalog',
        queryParams: { category: 'gaming' }
      }
    },
    {
      customClass: 'promo-secondary',
      tag: '💳 Financiamiento',
      titleLine1: 'Hasta 12 cuotas',
      titleLine2: 'sin intereses',
      description: 'Con todas las tarjetas de crédito Visa y Mastercard.',
      icon: 'pi pi-credit-card',
      button: {
        variant: 'outline',
        label: 'Más información',
        route: '/catalog'
      }
    }
  ];
}
