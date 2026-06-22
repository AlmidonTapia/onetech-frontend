import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonComponent],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  saving = signal(false);

  content = {
    title: 'Configuración de la Tienda',
    subtitle: 'Administra los ajustes generales y de contacto',
    generalSection: {
      title: 'Ajustes Generales',
      labels: {
        storeName: 'Nombre de la Tienda',
        contactEmail: 'Email de Contacto',
        supportPhone: 'Teléfono de Soporte'
      },
      placeholders: {
        storeName: 'OneTech Store',
        contactEmail: 'contacto@onetech.com',
        supportPhone: '+51 987654321'
      },
      saveLabel: 'Guardar ajustes',
      saveIcon: 'pi-save'
    },
    alerts: {
      success: 'Configuración actualizada',
      error: 'Error al actualizar configuración'
    }
  } as const;

  form = this.fb.group({
    storeName: ['OneTech', Validators.required],
    contactEmail: ['soporte@onetech.com', [Validators.required, Validators.email]],
    supportPhone: ['+51 900 000 000', Validators.required]
  });

  ngOnInit() {
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

    setTimeout(() => {
      this.saving.set(false);
      this.alertService.success(this.content.alerts.success);
    }, 800);
  }
}
