import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/domains/identity/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private hasView = false;
  private requiredRole: string = '';

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const isAuth = this.authService.isAuthenticated();
      const hasRole = isAuth && user?.role === this.requiredRole;

      if (hasRole && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasRole && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  @Input() set appHasRole(role: string) {
    this.requiredRole = role;
  }
}
