import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.html'
})
export class PrivacyComponent {
  get content() {
    return {
      sections: [
        {
          title: 'Uso de sus datos',
          body: 'Toda su información es tratada de manera confidencial y encriptada...'
        }
      ]
    };
  }
}
