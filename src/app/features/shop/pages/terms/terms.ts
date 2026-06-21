import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.html',
  styleUrl: '../static-page.css'
})
export class TermsComponent {
  content = {
    title: 'Términos y Condiciones',
    lastUpdated: 'Última actualización: Mayo 2026',
    sections: [
      {
        title: '1. Introducción',
        body: 'Bienvenido a OneTech. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de realizar cualquier compra.'
      },
      {
        title: '2. Precios y Disponibilidad',
        body: 'Todos los precios mostrados en el sitio están en Soles (S/) e incluyen IGV. La disponibilidad de los productos está sujeta al stock indicado en el momento de la compra. En caso de no contar con un producto después de confirmado el pedido, nos comunicaremos para ofrecerte un cambio o el reembolso inmediato.'
      },
      {
        title: '3. Políticas de Envío',
        body: 'Realizamos envíos a todo el Perú a través de agencias asociadas. Los plazos de entrega varían según el destino, generalmente entre 1 y 3 días hábiles para Lima, y hasta 5 días hábiles para provincias. El costo de envío se calcula al momento del pago según la dirección ingresada.'
      },
      {
        title: '4. Cambios y Devoluciones',
        body: 'Aceptamos cambios y devoluciones dentro de los 7 días calendario posteriores a la recepción de tu pedido, siempre y cuando el producto se encuentre en su empaque original, sellado y sin señales de uso. Para solicitar un cambio, comunícate a nuestro soporte técnico con tu comprobante de compra.'
      },
      {
        title: '5. Garantía de Productos',
        body: 'Todos los productos electrónicos vendidos en OneTech cuentan con garantía oficial de sus respectivos fabricantes. Si un producto presenta fallas de fábrica, te apoyaremos gestionando la garantía con la marca correspondiente. Daños físicos o uso indebido invalidan la garantía.'
      }
    ]
  };
}
