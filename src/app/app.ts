import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { AuthService } from './core/domains/identity/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { CookieConsentComponent } from './shared/components/ui/cookie-consent/cookie-consent';
import { ScrollToTopComponent } from './shared/components/ui/scroll-to-top/scroll-to-top';
import { WhatsappBtnComponent } from './shared/components/ui/whatsapp-btn/whatsapp-btn';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, CookieConsentComponent, ScrollToTopComponent, WhatsappBtnComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('onetech-frontend');

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.handleOAuthCallback(params['token']);
      }
    });
  }
}
