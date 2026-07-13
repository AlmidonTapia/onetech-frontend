import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: `
    @if (show()) {
      <button class="scroll-top-btn" [attr.aria-label]="content.ariaLabel" (click)="scrollToTop()">
        <i class="pi pi-arrow-up"></i>
      </button>
    }
  `,
  styles: [`
    .scroll-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-color: var(--ot-primary);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 999;
    }
    .scroll-top-btn:hover {
      background-color: var(--ot-primary-dark);
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class ScrollToTopComponent {
  show = signal(false);

  content = {
    ariaLabel: 'Volver arriba'
  };

  @HostListener('window:scroll')
  onWindowScroll() {
    this.show.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
