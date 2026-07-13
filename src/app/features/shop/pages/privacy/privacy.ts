import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.html',
  styleUrl: '../static-page.css'
})
export class PrivacyComponent {
  content = {
    title: 'Políticas de Privacidad',
    lastUpdated: 'Última actualización: Mayo 2026',
    sections: [
      {
        title: '1. Recopilación de Información',
        body: 'Recopilamos información personal que nos proporcionas directamente al registrarte, realizar una compra o contactarnos. Esto incluye nombre, correo electrónico, dirección de envío y número de teléfono.'
      },
      {
        title: '2. Uso de la Información',
        body: 'Utilizamos tu información para procesar tus pedidos, comunicarnos contigo sobre tu compra, mejorar nuestros servicios y, si has dado tu consentimiento, enviarte ofertas promocionales relevantes. Tu información de pago es procesada de forma segura por MercadoPago y no almacenamos datos de tarjetas de crédito.'
      },
      {
        title: '3. Protección de Datos',
        body: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Cumplimos con la Ley de Protección de Datos Personales del Perú (Ley N° 29733).'
      },
      {
        title: '4. Cookies',
        body: 'Utilizamos cookies para mejorar tu experiencia de navegación, recordar los productos en tu carrito y analizar el tráfico de nuestro sitio web. Puedes configurar tu navegador para rechazar las cookies, pero esto podría afectar el funcionamiento de algunas áreas de la tienda.'
      },
      {
        title: '5. Derechos del Usuario',
        body: 'Tienes derecho a acceder, rectificar, cancelar u oponerte al uso de tus datos personales. Para ejercer estos derechos (Derechos ARCO), puedes contactarnos directamente a través de nuestra página de soporte.'
      }
    ]
  };
}
