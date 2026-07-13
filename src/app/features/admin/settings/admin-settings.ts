import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { StoreConfigService, StoreConfiguration } from '../../../shared/services/store-config.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonComponent],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private storeConfigService = inject(StoreConfigService);

  saving = signal(false);

  content = {
    title: 'Configuración de la Tienda',
    subtitle: 'Administra los ajustes generales y de contacto',
    generalSection: {
      title: 'Información de la Tienda',
      labels: {
        companyName: 'Nombre de la Empresa (Razón Social)',
        taxId: 'RUC / Tax ID',
        address: 'Dirección Fiscal',
        supportEmail: 'Email de Soporte',
        supportPhone: 'Teléfono de Soporte',
        igvPercentage: 'Porcentaje de IGV (%)',
        freeShippingThreshold: 'Monto Envío Gratis (S/)',
        orderExpirationMinutes: 'Tiempo Expiración Reserva (Minutos)'
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
    companyName: ['', Validators.required],
    taxId: ['', Validators.required],
    address: ['', Validators.required],
    supportEmail: ['', [Validators.required, Validators.email]],
    supportPhone: ['', Validators.required],
    igvPercentage: [18, [Validators.required, Validators.min(0), Validators.max(100)]],
    freeShippingThreshold: [0, [Validators.required, Validators.min(0)]],
    orderExpirationMinutes: [30, [Validators.required, Validators.min(5)]]
  });

  ngOnInit() {
    this.loadConfiguration();
  }

  loadConfiguration() {
    this.storeConfigService.getConfiguration().subscribe({
      next: (config) => {
        this.form.patchValue(config);
      },
      error: () => this.alertService.error('Error al cargar la configuración de la tienda.')
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

    const configData = this.form.value as Partial<StoreConfiguration>;
    
    this.storeConfigService.updateConfiguration(configData).subscribe({
      next: () => {
        this.saving.set(false);
        this.alertService.success(this.content.alerts.success);
      },
      error: (err: any) => {
        this.saving.set(false);
        this.alertService.error(err?.error?.message || this.content.alerts.error);
      }
    });
  }
}
