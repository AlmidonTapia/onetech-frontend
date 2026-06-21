import { Component } from '@angular/core';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [],
  templateUrl: './who-we-are.html',
  styleUrl: '../static-page.css'
})
export class WhoWeAreComponent {
  content = {
    title: 'Quiénes Somos',
    subtitle: 'Pasión por la tecnología y el servicio al cliente.',
    sections: [
      {
        title: 'Nuestra Historia',
        body: 'OneTech nació con el propósito de acercar la mejor tecnología a todo el Perú. Desde nuestros inicios, nos hemos enfocado en ofrecer equipos de alto rendimiento para gamers, profesionales creativos y empresas. Somos apasionados por el hardware y buscamos que cada cliente encuentre exactamente lo que necesita.'
      },
      {
        title: 'Misión',
        body: 'Ofrecer la mayor variedad de componentes, laptops y accesorios tecnológicos de vanguardia, garantizando un servicio excepcional, envíos rápidos y precios competitivos en todo el mercado peruano.'
      },
      {
        title: 'Visión',
        body: 'Convertirnos en la tienda tecnológica líder y de mayor confianza en el Perú, reconocida por su innovación en comercio electrónico y su compromiso inquebrantable con la satisfacción del cliente.'
      },
      {
        title: '¿Por qué elegirnos?',
        body: 'A diferencia de las grandes cadenas, en OneTech te asesoramos de forma personalizada. Nuestro equipo está compuesto por entusiastas tecnológicos que entienden tus requerimientos. Además, todos nuestros productos son 100% nuevos, originales y cuentan con garantía oficial. ¡Confiamos tanto en nuestros procesos que tu satisfacción está asegurada!'
      }
    ]
  };
}
