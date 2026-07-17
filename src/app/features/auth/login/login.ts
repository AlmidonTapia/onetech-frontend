import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { AlertComponent } from '../../../shared/components/ui/alert/alert';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthLayoutComponent } from '../../../shared/layout/auth-layout/auth-layout';
import { handleFormError } from '../../../shared/utils/form-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    InputTextModule, PasswordModule, CheckboxModule,
    ButtonComponent, AlertComponent, AuthLayoutComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  errorMsg = signal('');
  returnUrl = signal<string | null>(null);

  ngOnInit() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || null);
  }

  brandData = {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
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
    submitButtonLabel: 'Ingresar',
    googleButtonLabel: 'Continuar con Google',
    dividerText: 'O continuar con',
    forgotPasswordText: '¿Olvidaste tu contraseña?',
    forgotPasswordRoute: '/auth/forgot-password',
    errors: {
      required: 'Campo requerido',
      email: 'Ingresa un correo válido'
    }
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
        const targetUrl = this.returnUrl() || '/';
        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate([targetUrl]);
        }
      },
      error: err => {
        this.loading.set(false);
        const errorMsg = handleFormError(err, this.form);
        if (errorMsg) {
          this.errorMsg.set(errorMsg);
        }
      }
    });
  }

  loginWithGoogle() {
    if (this.returnUrl()) {
      sessionStorage.setItem('returnUrl', this.returnUrl()!);
    }
    this.authService.loginWithGoogle();
  }
}
