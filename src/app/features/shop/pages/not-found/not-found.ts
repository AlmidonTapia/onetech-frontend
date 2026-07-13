import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../.././shared/components/ui/button/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>{{ content.title }}</h2>
        <p>{{ content.description }}</p>
        <app-button variant="primary" [label]="content.buttonLabel" routerLink="/" />
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      text-align: center;
      padding: 2rem;
    }
    .not-found-content h1 {
      font-size: 6rem;
      font-weight: 800;
      color: var(--ot-primary);
      margin: 0;
      line-height: 1;
    }
    .not-found-content h2 {
      font-size: 2rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: var(--ot-text-main);
    }
    .not-found-content p {
      color: var(--ot-text-muted);
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  `]
})
export class NotFoundComponent {
  content = {
    title: 'Página no encontrada',
    description: 'Lo sentimos, la página que buscas no existe, ha sido movida o está temporalmente inactiva.',
    buttonLabel: 'Volver al Inicio'
  };
}
