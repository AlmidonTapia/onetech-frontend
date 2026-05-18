import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-profile-security',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonComponent],
  templateUrl: './profile-security.html',
  styleUrl: './profile-security.css'
})
export class ProfileSecurityComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  saving = signal(false);

  content = {
    title: 'Cambiar contraseña',
    subtitle: 'Usa una contraseña segura de al menos 8 caracteres.',
    apiEndpoint: `${environment.apiUrl}/users/profile/password`,
    labels: {
      currentPassword: 'Contraseña actual *',
      newPassword: 'Nueva contraseña *',
      confirmPassword: 'Confirmar nueva contraseña *'
    },
    placeholders: {
      currentPassword: 'Tu contraseña actual',
      newPassword: 'Mínimo 8 caracteres',
      confirmPassword: 'Repite la nueva contraseña'
    },
    errors: {
      required: 'Campo requerido',
      minlength: 'Mínimo 8 caracteres',
      mismatch: 'Las contraseñas no coinciden'
    },
    actions: {
      submitLabel: 'Actualizar contraseña',
      submitIcon: 'pi-lock'
    },
    alerts: {
      successTitle: 'Contraseña actualizada correctamente',
      errorTitle: 'Error al cambiar contraseña',
      errorMsg: 'Verifica tu contraseña actual.'
    }
  };

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordsMatch });

  passwordsMatch(ctrl: AbstractControl) {
    const np = ctrl.get('newPassword')?.value;
    const cp = ctrl.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.http.post(this.content.apiEndpoint, {
      currentPassword: this.form.get('currentPassword')?.value,
      newPassword: this.form.get('newPassword')?.value,
    }).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.successTitle);
        this.form.reset();
        this.saving.set(false);
      },
      error: () => {
        this.alertService.error(this.content.alerts.errorTitle, this.content.alerts.errorMsg);
        this.saving.set(false);
      },
    });
  }
}
