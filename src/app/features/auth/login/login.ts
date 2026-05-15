import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  loading = signal(false);

  fields = [
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@correo.com' },
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
      error: () => {
        this.loading.set(false);
        this.alertService.error('Error', 'Credenciales incorrectas');
      }
    });
  }
}
