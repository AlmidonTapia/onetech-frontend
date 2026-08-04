import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [],
  templateUrl: './faq-page.html'
})
export class FaqPageComponent {
  get content() {
    return {
      categories: [
        {
          title: 'Envíos y Entregas',
          faqs: [
            { question: '¿Cuánto tiempo tarda el envío?', answer: 'Los envíos toman entre 2 y 5 días hábiles dependiendo de su ubicación.' }
          ]
        },
        {
          title: 'Pagos y Facturación',
          faqs: [
            { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito, débito y transferencias.' }
          ]
        }
      ]
    };
  }
}
