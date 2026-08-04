import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { authInterceptor } from './core/domains/shared/interceptors/auth.interceptor';
import { apiResponseInterceptor } from './core/domains/shared/interceptors/api-response.interceptor';
import { idempotencyInterceptor } from './core/domains/shared/interceptors/idempotency.interceptor';
import { errorInterceptor } from './core/domains/shared/interceptors/error.interceptor';

function initializeTheme() {
  return () => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, apiResponseInterceptor, idempotencyInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      multi: true
    }
  ]
};
