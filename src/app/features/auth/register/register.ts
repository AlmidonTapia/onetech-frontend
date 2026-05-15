import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputTextModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  loading = signal(false);

  fields = [
    { name: 'firstName', label: 'Nombres', type: 'text', placeholder: 'Ej: Juan' },
    { name: 'lastName', label: 'Apellidos', type: 'text', placeholder: 'Ej: Pérez' },
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@correo.com' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Crea una contraseña (min. 6)' }
  ];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.authService.register(this.form.value as any).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.alertService.success('Cuenta creada', 'Por favor, inicia sesión para continuar.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading.set(false);
        this.alertService.error('Error', 'No se pudo crear la cuenta. Verifica tus datos.');
      }
    });
  }
}
