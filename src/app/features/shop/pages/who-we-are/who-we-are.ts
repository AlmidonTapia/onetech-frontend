import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [],
  templateUrl: './who-we-are.html'
})
export class WhoWeAreComponent {
  get content() {
    return {
      sections: [
        {
          title: 'Nuestra Historia',
          body: 'OneTech comenzó con la visión de llevar tecnología a todos...'
        }
      ]
    };
  }
}
