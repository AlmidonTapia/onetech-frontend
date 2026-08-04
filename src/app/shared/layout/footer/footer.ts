import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StoreConfigService } from '../../../shared/services/store-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html'
})
export class FooterComponent implements OnInit {
  private storeConfigService = inject(StoreConfigService);
  private destroyRef = inject(DestroyRef);  
  readonly year = new Date().getFullYear();

  readonly categories = [
    { label: 'Laptops & PCs', route: '/catalog', queryParams: { category: 'laptops' } },
    { label: 'Componentes', route: '/catalog', queryParams: { category: 'componentes' } },
    { label: 'Gaming', route: '/catalog', queryParams: { category: 'gaming' } },
    { label: 'Monitores', route: '/catalog', queryParams: { category: 'monitores' } },
    { label: 'Celulares', route: '/catalog', queryParams: { category: 'celulares' } },
    { label: 'Accesorios', route: '/catalog', queryParams: { category: 'accesorios' } },
  ];

  readonly payments = ['Visa', 'Mastercard', 'Yape', 'Plin', 'BCP', 'Interbank'];

  get helpLinks() {
    return [
      { label: 'Quiénes somos', route: '/quienes-somos' },
      { label: 'Preguntas frecuentes', route: '/preguntas-frecuentes' },
      { label: 'Términos y condiciones', route: '/terminos' },
      { label: 'Políticas de privacidad', route: '/privacidad' },
      { label: 'Contacto', route: '/contacto' },
    ];
  }

  readonly social = [
    { icon: 'pi-instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'pi-facebook', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'pi-twitter', href: 'https://twitter.com', label: 'Twitter / X' },
    { icon: 'pi-youtube', href: 'https://youtube.com', label: 'YouTube' },
  ];

  contactInfo = signal([
    { icon: 'pi-map-marker', text: '...', link: undefined as string | undefined },
    { icon: 'pi-phone', text: '...', link: undefined as string | undefined },
    { icon: 'pi-envelope', text: '...', link: undefined as string | undefined },
    { icon: 'pi-clock', text: '...', link: undefined as string | undefined }
  ]);


  email = signal('');
  subscribed = signal(false);

  subscribe() {
    if (this.email() && this.email().includes('@')) {
      this.subscribed.set(true);
      setTimeout(() => {
        this.subscribed.set(false);
        this.email.set('');
      }, 3000);
    }
  }

  ngOnInit() {
    this.storeConfigService.getConfiguration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        this.contactInfo.set([
          { icon: 'pi-map-marker', text: config.address || 'No disponible', link: undefined },
          { icon: 'pi-phone', text: config.supportPhone || 'No disponible', link: `tel:${config.supportPhone}` },
          { icon: 'pi-envelope', text: config.supportEmail || 'No disponible', link: `mailto:${config.supportEmail}` },
          { icon: 'pi-clock', text: 'Lunes a Sábado: 9:00 AM - 6:00 PM', link: undefined }
        ]);
      },
      error: () => {}
    });
  }
}
