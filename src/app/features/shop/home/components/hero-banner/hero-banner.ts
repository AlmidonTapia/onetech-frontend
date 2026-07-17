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
    badgeText: 'Descubre nuestros nuevos ingresos',

    titleNormal: 'La tecnología que ',
    titleAccent: 'necesitas',

    freeShippingThreshold: '',
    subTextPre: 'Los mejores productos tecnológicos. Compra en línea con total seguridad.',
    subTextPost: '',

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
    { value: 'Miles', label: 'De productos' },
    { value: 'Despacho', label: 'Rápido y seguro' },
    { value: 'Pagos', label: '100% confiables' }
  ];

  visualIcons = [
    { icon: 'pi pi-desktop', class: 'icon-bubble' },
    { icon: 'pi pi-mobile', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-server', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-tablet', class: 'icon-bubble' }
  ];
}
