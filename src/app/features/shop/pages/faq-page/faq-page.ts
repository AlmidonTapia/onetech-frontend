import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [],
  templateUrl: './faq-page.html',
  styleUrl: '../static-page.css'
})
export class FaqPageComponent {
  content = {
    title: 'Preguntas Frecuentes',
    subtitle: 'Resolvemos tus dudas rápidamente.',
    categories: [
      {
        title: 'Envíos y Entregas',
        faqs: [
          {
            question: '¿Hacen envíos a todo el Perú?',
            answer: 'Sí, realizamos envíos a nivel nacional. Los productos se despachan a través de couriers confiables y el tiempo de entrega depende de la ciudad destino (generalmente 1 a 3 días hábiles).'
          },
          {
            question: '¿Cómo puedo hacer seguimiento de mi pedido?',
            answer: 'Una vez confirmado tu pedido, recibirás una notificación con el código de seguimiento del courier. También puedes revisar el estado de tu pedido directamente en tu cuenta de OneTech.'
          }
        ]
      },
      {
        title: 'Garantías y Devoluciones',
        faqs: [
          {
            question: '¿Los productos son originales y nuevos?',
            answer: 'Todos nuestros productos son nuevos, sellados y 100% originales, con garantía oficial del fabricante. Solo trabajamos con marcas reconocidas en el mercado.'
          },
          {
            question: '¿Cuál es la política de garantía?',
            answer: 'Todos nuestros productos cuentan con garantía oficial del fabricante. El período varía según el producto y la marca. Si tienes algún inconveniente, contáctanos y gestionaremos la garantía por ti.'
          },
          {
            question: '¿Puedo cambiar o devolver un producto?',
            answer: 'Aceptamos cambios y devoluciones dentro de los 7 días calendario desde la recepción del producto, siempre que esté en perfectas condiciones, sin uso y en su empaque original.'
          }
        ]
      },
      {
        title: 'Pagos y Facturación',
        faqs: [
          {
            question: '¿Cuáles son los métodos de pago?',
            answer: 'Aceptamos tarjetas de crédito y débito, transferencias bancarias, Yape/Plin y pagos en efectivo a través de agencias.'
          },
          {
            question: '¿Emiten boleta o factura?',
            answer: 'Sí, emitimos comprobante de pago (boleta o factura) por cada compra realizada en nuestra tienda, de manera electrónica. Solo debes indicar tus datos de facturación al momento del checkout.'
          }
        ]
      }
    ]
  };
}
