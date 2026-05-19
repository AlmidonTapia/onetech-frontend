import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { UserService } from '../../../../../core/services/user.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Address, CreateAddressRequest } from '../../../../../core/models/address.model';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './checkout-address.html',
  styleUrl: './checkout-address.css'
})
export class CheckoutAddressComponent implements OnInit {
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  @Output() selected = new EventEmitter<Address>();

  addresses = signal<Address[]>([]);
  selectedId = signal<string | null>(null);
  showNewForm = signal(false);
  saving = signal(false);

  // ── CONTENIDO ADMINISTRABLE DE TEXTOS, ETIQUETAS Y ALERTAS ──
  content = {
    title: 'Dirección de entrega',
    titleIcon: 'pi pi-map-marker',
    defaultBadgeText: 'Principal',
    addAddressBtnText: 'Agregar nueva dirección',
    formTitle: 'Nueva dirección',

    // Configuración dinámica de inputs
    fields: {
      regionLabel: 'Región *',
      regionPlaceholder: 'Lima',
      districtLabel: 'Distrito *',
      districtPlaceholder: 'Miraflores',
      mainAddressLabel: 'Dirección *',
      mainAddressPlaceholder: 'Av. Principal 123, Dpto 4B',
      referenceLabel: 'Referencia',
      referencePlaceholder: 'Cerca al parque',
      errorRequired: 'Campo requerido'
    },

    // Botones de acción
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar dirección'
    },

    // Alertas informativas
    alerts: {
      success: 'Dirección guardada',
      error: 'Error al guardar dirección'
    }
  };

  form = this.fb.group({
    country: ['Perú', Validators.required],
    region: ['', Validators.required],
    district: ['', Validators.required],
    mainAddress: ['', Validators.required],
    reference: [''],
    isDefault: [false],
  });

  ngOnInit() {
    this.userService.getAddresses().subscribe({
      next: addrs => {
        this.addresses.set(addrs);
        const def = addrs.find(a => a.isDefault) ?? addrs[0];
        if (def) {
          this.selectedId.set(def.idAddress);
          this.selected.emit(def);
        }
      }
    });
  }

  // Método de control unificado para verificar errores en los inputs
  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  selectAddress(address: Address) {
    this.selectedId.set(address.idAddress);
    this.selected.emit(address);
  }

  saveNew() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const requestData = this.form.value as CreateAddressRequest;

    this.userService.addAddress(requestData).subscribe({
      next: (res: any) => {
        this.alertService.success(this.content.alerts.success);

        const newAddress: Address = {
          idAddress: res?.id || 'addr_' + Date.now(),
          country: requestData.country,
          region: requestData.region,
          district: requestData.district,
          mainAddress: requestData.mainAddress,
          reference: requestData.reference,
          isDefault: requestData.isDefault
        };

        if (newAddress.isDefault) {
          this.addresses.update(addrs => addrs.map(a => ({ ...a, isDefault: false })));
        }

        this.addresses.update(a => [...a, newAddress]);
        this.selectAddress(newAddress);

        this.showNewForm.set(false);
        this.saving.set(false);
        this.form.reset({ country: 'Perú', isDefault: false });
      },
      error: () => {
        this.alertService.error(this.content.alerts.error);
        this.saving.set(false);
      }
    });
  }
}
