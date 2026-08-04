import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './hero-banner.html'
})
export class HeroBannerComponent {
  visualIcons = [
    { icon: 'pi pi-desktop', class: 'icon-bubble' },
    { icon: 'pi pi-mobile', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-server', class: 'icon-bubble icon-bubble--sm' },
    { icon: 'pi pi-tablet', class: 'icon-bubble' }
  ];
}
