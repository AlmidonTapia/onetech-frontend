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
      tag: '⚡ Promociones Especiales',
      titleLine1: 'Descubre descuentos',
      titleLine2: 'en productos seleccionados',
      description: 'Renueva tu tecnología hoy mismo.',
      icon: 'pi pi-desktop',
      button: {
        variant: 'accent',
        label: 'Ver ofertas',
        route: '/catalog',
        queryParams: { category: 'ofertas' }
      }
    },
    {
      customClass: 'promo-secondary',
      tag: '💳 Opciones de Pago',
      titleLine1: 'Diversos métodos',
      titleLine2: 'de pago disponibles',
      description: 'Elige la opción que mejor se adapte a tu comodidad y seguridad.',
      icon: 'pi pi-credit-card',
      button: {
        variant: 'outline',
        label: 'Más información',
        route: '/catalog'
      }
    }
  ];
}
