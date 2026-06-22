import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  imports: [],
  template: `
    <a [href]="waLink()" target="_blank" rel="noopener noreferrer"
       class="wa-btn" [attr.aria-label]="ariaLabel">
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a13.09 13.09 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
      <span class="wa-label">Consultar</span>
    </a>
  `,
  styles: [`
    .wa-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #25d366;
      color: #fff;
      padding: 12px 18px;
      border-radius: var(--ot-radius-full, 999px);
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: waPulse 2.5s ease-in-out infinite;
    }
    .wa-btn:hover {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 8px 28px rgba(37, 211, 102, 0.5);
      animation: none;
    }
    .wa-label { white-space: nowrap; }
    @keyframes waPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,.4); }
      50%       { box-shadow: 0 4px 32px rgba(37,211,102,.7); }
    }
    @media (max-width: 480px) {
      .wa-btn { bottom: 20px; right: 16px; padding: 12px 14px; }
      .wa-label { display: none; }
    }
  `]
})
export class WhatsappBtnComponent {
  @Input() productName?: string;
  @Input() productUrl?: string;
  @Input() phone = '51999999999';

  readonly ariaLabel = 'Consultar por WhatsApp';

  waLink = computed(() => {
    const name = this.productName ?? 'un producto';
    const url  = this.productUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
    const msg  = encodeURIComponent(`Hola, estoy interesado en el producto: ${name} ${url}`);
    return `https://wa.me/${this.phone}?text=${msg}`;
  });
}
