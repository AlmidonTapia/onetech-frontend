import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { StoreConfigService, StoreConfiguration } from '../../../shared/services/store-config.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, SelectModule, ButtonComponent],
  templateUrl: './admin-settings.html'
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private storeConfigService = inject(StoreConfigService);
  private destroyRef = inject(DestroyRef);
  saving = signal(false);
  
  expirationOptions = [
    { label: '5 Minutos', value: 5 },
    { label: '10 Minutos', value: 10 },
    { label: '15 Minutos', value: 15 }
  ];

  get content() {
    return {"title":"Configuración de la Tienda","subtitle":"Administra los ajustes generales y de contacto","generalSection":{"title":"Información de la Tienda","labels":{"companyName":"Nombre de la Empresa (Razón Social)","taxId":"RUC / Tax ID","address":"Dirección Fiscal","supportEmail":"Email de Soporte","supportPhone":"Teléfono de Soporte","logoUrl":"URL del Logo","freeShippingThreshold":"Monto Envío Gratis (S/)","orderExpirationMinutes":"Tiempo Expiración Reserva (Minutos)"},"saveLabel":"Guardar ajustes"},"alerts":{"success":"Configuración actualizada","error":"Error al actualizar configuración","loadError":"Error al cargar la configuración de la tienda."}};
  }

  form = this.fb.group({
    companyName: ['', Validators.required],
    taxId: ['', Validators.required],
    address: ['', Validators.required],
    supportEmail: ['', [Validators.required, Validators.email]],
    supportPhone: ['', Validators.required],
    logoUrl: [''],
    freeShippingThreshold: [0, [Validators.required, Validators.min(0)]],
    orderExpirationMinutes: [5, [Validators.required]]
  });

  ngOnInit() {
    this.loadConfiguration();
  }

  loadConfiguration() {
    this.storeConfigService.getConfiguration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        this.form.patchValue(config);
      },
      error: () => this.alertService.error(this.content.alerts.loadError)
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
    
    this.storeConfigService.updateConfiguration(configData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
