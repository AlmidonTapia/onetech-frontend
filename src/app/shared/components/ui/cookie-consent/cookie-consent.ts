import { Component, signal, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    @if (show()) {
      <div class="cookie-banner">
        <div class="cookie-content">
          <p>{{ content.message }}</p>
          <div class="cookie-actions">
            <app-button variant="outline" size="sm" [label]="content.decline" (clicked)="accept(false)" />
            <app-button variant="primary" size="sm" [label]="content.accept" (clicked)="accept(true)" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 48px);
      max-width: 900px;
      background-color: var(--ot-bg-surface);
      border: 1px solid var(--ot-border-color);
      border-radius: var(--ot-radius-xl);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      padding: 1.25rem 2rem;
    }
    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      text-align: center;
    }
    .cookie-content p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--ot-text-main);
    }
    .cookie-actions {
      display: flex;
      gap: 0.5rem;
    }
    @media (min-width: 768px) {
      .cookie-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  show = signal(false);
  
  content = {
    message: 'Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido. Al continuar navegando, acepta nuestro uso de cookies.',
    accept: 'Aceptar',
    decline: 'Solo esenciales'
  };

  ngOnInit() {
    const consent = localStorage.getItem('ot_cookie_consent');
    if (!consent) {
      this.show.set(true);
    }
  }

  accept(all: boolean) {
    localStorage.setItem('ot_cookie_consent', all ? 'all' : 'essential');
    this.show.set(false);
  }
}
