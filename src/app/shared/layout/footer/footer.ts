import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly categories = [
    { label: 'Laptops & PCs', route: '/catalog', queryParams: { category: 'laptops' } },
    { label: 'Componentes', route: '/catalog', queryParams: { category: 'componentes' } },
    { label: 'Gaming', route: '/catalog', queryParams: { category: 'gaming' } },
    { label: 'Monitores', route: '/catalog', queryParams: { category: 'monitores' } },
    { label: 'Celulares', route: '/catalog', queryParams: { category: 'celulares' } },
    { label: 'Accesorios', route: '/catalog', queryParams: { category: 'accesorios' } },
  ];

  readonly helpLinks = [
    { label: 'Centro de ayuda', route: '/help' },
    { label: 'Devoluciones', route: '/returns' },
    { label: 'Seguimiento de envío', route: '/tracking' },
    { label: 'Garantías', route: '/warranty' },
    { label: 'Preguntas frecuentes', route: '/faq' },
  ];

  readonly social = [
    { icon: 'pi-instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'pi-facebook', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'pi-twitter', href: 'https://twitter.com', label: 'Twitter / X' },
    { icon: 'pi-youtube', href: 'https://youtube.com', label: 'YouTube' },
  ];

  readonly contactInfo = [
    { icon: 'pi-map-marker', text: 'Av. Javier Prado 1234, San Isidro, Lima' },
    { icon: 'pi-phone', text: '+51 (01) 234-5678', link: 'tel:+5101234567' },
    { icon: 'pi-envelope', text: 'soporte@onetech.pe', link: 'mailto:soporte@onetech.pe' },
    { icon: 'pi-clock', text: 'Lun–Sab 9:00am – 6:00pm' }
  ];

  readonly payments = ['Visa', 'Mastercard', 'Yape', 'Plin', 'BCP', 'Interbank'];
}