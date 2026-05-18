import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { AlertComponent } from '../../../shared/components/ui/alert/alert';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    InputTextModule, PasswordModule, CheckboxModule,
    ButtonComponent, AlertComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  loading = signal(false);
  errorMsg = signal('');

  brandData = {
    title: 'Bienvenido de vuelta',
    description: 'Accede a tu cuenta y sigue comprando la tecnología que necesitas.',
    benefits: [
      { icon: 'pi pi-truck', title: 'Envío rápido', desc: 'Despacho en 24h a todo Lima' },
      { icon: 'pi pi-shield', title: 'Compra segura', desc: 'Pagos encriptados y protegidos' },
      { icon: 'pi pi-refresh', title: 'Devoluciones fáciles', desc: '30 días para cambios o reembolsos' },
      { icon: 'pi pi-star', title: '+5,000 productos', desc: 'Las mejores marcas del mercado' }
    ]
  };

  
  formData = {
    title: 'Iniciar sesión',
    registerText: '¿Aún no tienes cuenta?',
    registerLinkText: 'Regístrate aquí',
    registerRoute: '/auth/register',
    submitButtonLabel: 'Ingresar'
  };

  fields = [
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@correo.com', icon: 'pi pi-envelope' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Ingresa tu contraseña' }
  ];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
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

    this.authService.login(this.form.value as any).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.alertService.success('Bienvenido', `Hola de nuevo, ${res.firstName}`);
        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        const status = err?.status;
        this.errorMsg.set(
          status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Ocurrió un error. Intenta de nuevo.'
        );
        this.loading.set(false);
      }
    });
  }
}
