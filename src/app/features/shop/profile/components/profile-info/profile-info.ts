import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { UserService } from '../../../../../core/services/user.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { User, UpdateProfileRequest } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, ButtonComponent],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css'
})
export class ProfileInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  authService = inject(AuthService);

  saving = signal(false);
  loading = signal(true);

  content = {
    title: 'Información personal',
    subtitle: 'Actualiza tus datos de contacto e identificación.',
    labels: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      documentType: 'Tipo de documento',
      documentNumber: 'Número de documento',
      phone: 'Teléfono / Celular'
    },
    hints: {
      emailImmutable: 'El correo no puede modificarse.'
    },
    placeholders: {
      docTypeSelect: 'Seleccionar',
      docNumber: '12345678',
      phone: '987654321'
    },
    errors: {
      phonePattern: 'Ingresa un número de 9 dígitos.'
    },
    actions: {
      saveLabel: 'Guardar cambios',
      saveIcon: 'pi-check'
    },
    alerts: {
      success: 'Perfil actualizado correctamente',
      error: 'Error al actualizar el perfil'
    },
    styles: {
      selectWidth: '100%'
    }
  };

  readonly docTypes = [
    { label: 'DNI', value: 'DNI' },
    { label: 'Pasaporte', value: 'PASAPORTE' },
    { label: 'CE', value: 'CE' },
  ];

  form = this.fb.group({
    firstName: [{ value: '', disabled: true }],
    lastName: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
    documentType: [''],
    documentNumber: [''],
    phone: ['', [Validators.pattern(/^\d{9}$/)]],
  });

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          documentType: user.documentType ?? '',
          documentNumber: user.documentNumber ?? '',
          phone: user.phone ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
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

    const requestData: UpdateProfileRequest = {
      documentType: this.form.value.documentType ?? '',
      documentNumber: this.form.value.documentNumber ?? '',
      phone: this.form.value.phone ?? '',
    };

    this.userService.updateProfileDetails(requestData).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.success);
        this.saving.set(false);
      },
      error: () => {
        this.alertService.error(this.content.alerts.error);
        this.saving.set(false);
      },
    });
  }
}
