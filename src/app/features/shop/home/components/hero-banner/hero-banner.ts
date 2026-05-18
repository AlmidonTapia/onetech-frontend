import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css'
})
export class HeroBannerComponent {

  content = {
    badgeIcon: 'pi pi-bolt',
    badgeText: 'Nuevo: Laptops RTX 4070 en stock',

    titleNormal: 'La tecnología que ',
    titleAccent: 'necesitas',

    freeShippingThreshold: 'S/ 199',
    subTextPre: 'Los mejores precios en laptops, celulares y componentes. Envío gratis desde ',
    subTextPost: ' a todo Lima.',

    primaryBtn: {
      label: 'Explorar catálogo',
      icon: 'pi-arrow-right',
      route: '/catalog'
    },
    secondaryBtn: {
      label: 'Ver ofertas',
      route: '/catalog',
      queryParams: { category: 'ofertas' }
    }
  };

  stats = [
    { value: '+5,000', label: 'Productos' },
    { value: '24h', label: 'Despacho Lima' },
    { value: '12', label: 'Cuotas sin interés' }
  ];

  visualIcons = [
    { icon: 'pi pi-desktop', class: 'icon-bubble' },
    { icon: 'pi pi-mobile', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-server', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-tablet', class: 'icon-bubble' }
  ];
}
