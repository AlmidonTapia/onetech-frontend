import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal, OnInit, inject } from '@angular/core';
import { StoreConfigService } from '../../../shared/services/store-config.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent implements OnInit {
  private storeConfigService = inject(StoreConfigService);
  ts = inject(TranslationService);
  t = this.ts.t;
  
  readonly year = new Date().getFullYear();

  get helpLinks() {
    return [
      { label: this.t().navbar.menu.aboutItems.whoWeAre, route: '/quienes-somos' },
      { label: this.t().navbar.menu.aboutItems.faq, route: '/preguntas-frecuentes' },
      { label: this.t().navbar.menu.aboutItems.terms, route: '/terminos' },
      { label: this.t().navbar.menu.aboutItems.privacy, route: '/privacidad' },
      { label: this.t().navbar.menu.aboutItems.contact, route: '/contacto' },
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
    this.storeConfigService.getConfiguration().subscribe({
      next: (config) => {
        this.contactInfo.set([
          { icon: 'pi-map-marker', text: config.address || this.t().footer.contact.unavailable, link: undefined },
          { icon: 'pi-phone', text: config.supportPhone || this.t().footer.contact.unavailable, link: `tel:${config.supportPhone}` },
          { icon: 'pi-envelope', text: config.supportEmail || this.t().footer.contact.unavailable, link: `mailto:${config.supportEmail}` },
          { icon: 'pi-clock', text: this.t().footer.contact.hours, link: undefined }
        ]);
      },
      error: () => {}
    });
  }
}
