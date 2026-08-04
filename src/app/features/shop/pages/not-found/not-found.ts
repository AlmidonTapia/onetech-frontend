import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../.././shared/components/ui/button/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="flex items-center justify-center min-h-[70vh] text-center p-8">
      <div>
        <h1 class="text-[6rem] font-extrabold text-blue-600 dark:text-blue-500 m-0 leading-none">404</h1>
        <h2 class="text-3xl font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">Página no encontrada</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-[400px] mx-auto m-0">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <app-button variant="primary" label="Volver al inicio" routerLink="/" />
      </div>
    </div>
  `
})
export class NotFoundComponent {}
