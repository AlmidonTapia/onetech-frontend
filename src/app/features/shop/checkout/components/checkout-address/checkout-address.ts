import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { UserService } from '../../../../../core/services/user.service';
import { UbigeoService, LocationResponse } from '../../../../../core/services/ubigeo.service';
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
  private ubigeoService = inject(UbigeoService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

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
      departmentLabel: 'Departamento *',
      departmentPlaceholder: 'Seleccione Departamento',
      provinceLabel: 'Provincia *',
      provincePlaceholder: 'Seleccione Provincia',
      districtLabel: 'Distrito *',
      districtPlaceholder: 'Seleccione Distrito',
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
    department: ['', Validators.required],
    province: [{ value: '', disabled: true }, Validators.required],
    district: [{ value: '', disabled: true }, Validators.required],
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

    this.ubigeoService.getDepartments().subscribe(d => this.departments.set(d));

    this.form.get('department')?.valueChanges.subscribe(depId => {
      this.form.get('province')?.reset();
      this.form.get('district')?.reset();
      this.form.get('province')?.disable();
      this.form.get('district')?.disable();
      if (depId) {
        this.ubigeoService.getProvinces(depId).subscribe(p => {
          this.provinces.set(p);
          this.form.get('province')?.enable();
        });
      }
    });

    this.form.get('province')?.valueChanges.subscribe(provId => {
      this.form.get('district')?.reset();
      this.form.get('district')?.disable();
      if (provId) {
        this.ubigeoService.getDistricts(provId).subscribe(d => {
          this.districts.set(d);
          this.form.get('district')?.enable();
        });
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
    const formData = this.form.getRawValue();
    const requestData: CreateAddressRequest = {
      country: formData.country!,
      ubigeoCode: formData.district!,
      mainAddress: formData.mainAddress!,
      reference: formData.reference || '',
      isDefault: formData.isDefault || false
    };

    this.userService.addAddress(requestData).subscribe({
      next: (res: any) => {
        this.alertService.success(this.content.alerts.success);

        const newAddress: Address = {
          idAddress: res?.id || 'addr_' + Date.now(),
          country: requestData.country,
          ubigeoCode: requestData.ubigeoCode,
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
