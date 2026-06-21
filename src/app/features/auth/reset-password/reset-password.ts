import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    PasswordModule,
    ButtonComponent, AlertComponent,
  ],
  templateUrl: './reset-password.html',
  styleUrl: '../login/login.css' // Reutilizamos estilos del login
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  errorMsg = signal('');
  token = signal<string | null>(null);

  ngOnInit() {
    this.token.set(this.route.snapshot.queryParams['token'] || null);
    if (!this.token()) {
      this.errorMsg.set('El enlace de recuperación es inválido o ha expirado.');
    }
  }

  brandData = {
    title: 'Nueva Contraseña',
    description: 'Estás a un paso de recuperar tu cuenta. Crea una contraseña segura para mantener tu información protegida.'
  };

  formData = {
    title: 'Crear nueva contraseña',
    description: 'Ingresa tu nueva contraseña a continuación.',
    submitButtonLabel: 'Restablecer contraseña',
    backText: 'Volver al inicio de sesión',
    backRoute: '/auth/login',
    mismatchErrorMsg: 'Las contraseñas no coinciden',
    errors: {
      required: 'Campo requerido',
      minLengthPre: 'Mínimo',
      minLengthPost: 'caracteres'
    },
    passwordFeedback: {
      prompt: 'Escribe una contraseña',
      weak: 'Débil',
      medium: 'Media',
      strong: 'Segura'
    }
  };

  fields = [
    { name: 'password', label: 'Nueva Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres', feedback: true },
    { name: 'confirmPassword', label: 'Confirmar Contraseña', type: 'password', placeholder: 'Repite tu contraseña', feedback: false }
  ];

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPasswords });

  matchPasswords(ctrl: AbstractControl) {
    const pw = ctrl.get('password')?.value;
    const cpw = ctrl.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  onSubmit() {
    if (this.form.invalid || !this.token()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const newPassword = this.form.value.password!;
    
    this.authService.resetPassword(this.token()!, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.alertService.success('Contraseña actualizada', 'Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('No se pudo restablecer la contraseña. El enlace puede haber expirado.');
      }
    });
  }
}
