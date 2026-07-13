import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  content = {
    brandRoute: '/',
    ariaLabelLogo: 'OneTech',
    tagline: 'Tu tienda de tecnología de confianza en Lima, Perú. Los mejores precios en laptops, celulares y componentes.',
    headings: {
      categories: 'Categorías',
      help: 'Ayuda',
      contact: 'Contacto'
    },
    copyPre: '© ',
    copyPost: ' OneTech. Todos los derechos reservados.',
    newsletter: {
      title: 'Suscríbete a nuestro boletín',
      subtitle: 'Recibe las mejores ofertas y novedades de tecnología.',
      placeholder: 'Tu correo electrónico',
      button: 'Suscribirse',
      successMessage: '¡Gracias por suscribirte!'
    }
  };

  readonly categories = [
    { label: 'Laptops & PCs', route: '/catalog', queryParams: { category: 'laptops' } },
    { label: 'Componentes', route: '/catalog', queryParams: { category: 'componentes' } },
    { label: 'Gaming', route: '/catalog', queryParams: { category: 'gaming' } },
    { label: 'Monitores', route: '/catalog', queryParams: { category: 'monitores' } },
    { label: 'Celulares', route: '/catalog', queryParams: { category: 'celulares' } },
    { label: 'Accesorios', route: '/catalog', queryParams: { category: 'accesorios' } },
  ];

  readonly helpLinks = [
    { label: 'Quiénes somos', route: '/quienes-somos' },
    { label: 'Preguntas frecuentes', route: '/preguntas-frecuentes' },
    { label: 'Términos y condiciones', route: '/terminos' },
    { label: 'Políticas de privacidad', route: '/privacidad' },
    { label: 'Contacto', route: '/contacto' },
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
}
