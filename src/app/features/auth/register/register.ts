import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { RegisterFormComponent } from './components/register-form/register-form';
import { AuthLayoutComponent } from '../../../shared/layout/auth-layout/auth-layout';
import { handleFormError } from '../../../shared/utils/form-error.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RegisterFormComponent, AuthLayoutComponent
  ],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);
  errorMsg = signal('');
  success = signal(false);
  returnUrl = signal<string | null>(null);

  ngOnInit() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || null);
  }

  brandData = {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
    title: 'Únete a OneTech',
    description: 'Crea tu cuenta y empieza a disfrutar de los mejores precios en tecnología para Lima.',
    stats: [
      { value: '+15,000', label: 'clientes felices' },
      { value: '+5,000', label: 'productos' },
      { value: '4.8★', label: 'valoración' }
    ],
    perks: [
      'Historial de compras y seguimiento',
      'Direcciones guardadas para pagar más rápido',
      'Lista de favoritos sincronizada',
      'Ofertas exclusivas para miembros',
      'Soporte prioritario por correo'
    ]
  };

  formData = {
    title: 'Crear cuenta',
    loginText: '¿Ya tienes cuenta?',
    loginLinkText: 'Inicia sesión aquí',
    loginRoute: '/auth/login',
    backToShopText: 'Volver a la tienda sin registrarme',
    submitButtonLabel: 'Crear mi cuenta',
    googleButtonLabel: 'Continuar con Google',
    dividerText: 'O continuar con',
    termsText: 'Acepto los',
    termsLink: 'Términos y condiciones',
    privacyText: 'y la',
    privacyLink: 'Política de privacidad',
    termsErrorMsg: 'Debes aceptar los términos para continuar',
    mismatchErrorMsg: 'Las contraseñas no coinciden',
    errors: {
      required: 'Campo requerido',
      email: 'Correo inválido',
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
    { name: 'firstName', label: 'Nombre *', type: 'text', placeholder: 'Juan' },
    { name: 'lastName', label: 'Apellido *', type: 'text', placeholder: 'Pérez' },
    { name: 'email', label: 'Correo electrónico *', type: 'email', placeholder: 'tu@correo.com', icon: 'pi pi-envelope' },
    { name: 'password', label: 'Contraseña *', type: 'password', placeholder: 'Mínimo 8 caracteres', feedback: true }
  ];

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue]
  });

  get f() { return this.form.controls; }

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

    this.authService.register({
      firstName: this.f['firstName'].value!,
      lastName: this.f['lastName'].value!,
      email: this.f['email'].value!,
      password: this.f['password'].value!,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Cuenta creada', 'Iniciando sesión automáticamente...');
        this.authService.login({
          email: this.f['email'].value!,
          password: this.f['password'].value!,
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            const targetUrl = this.returnUrl() || '/';
            this.router.navigate([targetUrl]);
          },
          error: () => {
            const targetUrl = this.returnUrl() || '/';
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: targetUrl } });
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = handleFormError(err, this.form);
        if (errorMsg) {
          this.errorMsg.set(errorMsg);
          this.alertService.error('Error', errorMsg);
        }
      }
    });
  }
}
