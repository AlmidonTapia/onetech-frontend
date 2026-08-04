import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.html'
})
export class TermsComponent {
  get content() {
    return {
      sections: [
        {
          title: 'Condiciones de Uso',
          body: 'Al utilizar nuestros servicios, usted acepta estos términos y condiciones...'
        }
      ]
    };
  }
}
