import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { RegisterFormComponent } from './components/register-form/register-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, RegisterFormComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  errorMsg = signal('');
  success = signal(false);
  returnUrl = signal<string | null>(null);

  ngOnInit() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || null);
  }

  brandData = {
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

  // ── CONFIGURACIÓN DINÁMICA DE CAMPOS ──
  fields = [
    { name: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Juan' },
    { name: 'lastName', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@correo.com', icon: 'pi pi-envelope' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres', feedback: true },
    { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', placeholder: 'Repite tu contraseña', feedback: false }
  ];

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  }, { validators: this.matchPasswords });

  get f() { return this.form.controls; }

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
    }).subscribe({
      next: () => {
        this.alertService.success('Cuenta creada', 'Iniciando sesión automáticamente...');
        this.authService.login({
          email: this.f['email'].value!,
          password: this.f['password'].value!,
        }).subscribe({
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
        const status = err?.status;
        const msg = status === 409
          ? 'Este correo ya está registrado. Intenta iniciar sesión.'
          : 'Error al crear la cuenta. Intenta de nuevo.';

        this.errorMsg.set(msg);
        this.alertService.error('Error', msg);
      }
    });
  }
}
