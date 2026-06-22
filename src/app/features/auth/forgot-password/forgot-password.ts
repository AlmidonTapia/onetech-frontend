import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    InputTextModule,
    ButtonComponent, AlertComponent,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: '../login/login.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  brandData = {
    title: 'Recupera tu acceso',
    description: 'No te preocupes, a todos nos pasa. Ingresa tu correo y te ayudaremos a restablecer tu contraseña para que sigas disfrutando de OneTech.'
  };

  formData = {
    title: 'Olvidé mi contraseña',
    description: 'Ingresa el correo electrónico asociado a tu cuenta.',
    submitButtonLabel: 'Enviar enlace de recuperación',
    backText: 'Volver al inicio de sesión',
    backRoute: '/auth/login',
    errors: {
      required: 'Campo requerido',
      email: 'Ingresa un correo válido'
    }
  };

  fields = [
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@correo.com', icon: 'pi pi-envelope' }
  ];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    const email = this.form.value.email!;
    
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('Hemos enviado un enlace de recuperación a tu correo electrónico.');
        this.alertService.success('Correo enviado', 'Revisa tu bandeja de entrada o spam.');
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('No pudimos procesar tu solicitud. Verifica si el correo es correcto.');
      }
    });
  }
}
