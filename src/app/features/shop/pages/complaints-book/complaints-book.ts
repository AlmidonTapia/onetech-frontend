import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';
import { StoreConfigService } from '../../../../shared/services/store-config.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaints-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputTextModule,
    TextareaModule,
    SelectModule,
    CheckboxModule
  ],
  templateUrl: './complaints-book.html'
})
export class ComplaintsBookComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private storeConfigService = inject(StoreConfigService);
  private destroyRef = inject(DestroyRef);

  companyName = signal('Cargando...');
  taxId = signal('Cargando...');

  loading = signal(false);
  privacyMore = signal(false);

  documentTypes = [
    { label: 'Carnet de extranjería', value: 'ce' },
    { label: 'DNI', value: 'dni' },
    { label: 'Pasaporte', value: 'passport' }
  ];

  goodTypes = [
    { label: 'Producto', value: 'good' },
    { label: 'Servicio', value: 'service' },
    { label: 'Producto y servicio', value: 'good_and_service' }
  ];

  currencyTypes = [
    { label: 'Soles (S/)', value: 'pen' },
    { label: 'Dólares ($)', value: 'usd' }
  ];

  complaintTypes = [
    { label: 'Queja', value: 'queja' },
    { label: 'Reclamo', value: 'reclamo' }
  ];

  form = this.fb.group({
    consumer_name: ['', Validators.required],
    show_consumer_parent_name: [false],
    consumer_parent_name: [''],
    consumer_id_type: [null as any, Validators.required],
    consumer_id_number: ['', Validators.required],
    consumer_email: ['', [Validators.required, Validators.email]],
    consumer_phone: [''],
    consumer_address: [''],
    
    good_or_service_type: [null as any, Validators.required],
    good_or_service_description: ['', Validators.required],
    show_good_or_service_claimed_amount: [false],
    good_or_service_claimed_amount_currency: [null as any],
    good_or_service_claimed_amount_value: [''],
    
    complaint_type: [null as any, Validators.required],
    complaint_description: ['', Validators.required],
    complaint_request: ['', Validators.required]
  });

  constructor() {
    this.form.get('show_consumer_parent_name')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isMinor => {
      const parentNameControl = this.form.get('consumer_parent_name');
      if (isMinor) {
        parentNameControl?.setValidators(Validators.required);
      } else {
        parentNameControl?.clearValidators();
      }
      parentNameControl?.updateValueAndValidity();
    });

    this.form.get('show_good_or_service_claimed_amount')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(claimsAmount => {
      const currencyControl = this.form.get('good_or_service_claimed_amount_currency');
      const valueControl = this.form.get('good_or_service_claimed_amount_value');
      
      if (claimsAmount) {
        currencyControl?.setValidators(Validators.required);
        valueControl?.setValidators(Validators.required);
      } else {
        currencyControl?.clearValidators();
        valueControl?.clearValidators();
      }
      currencyControl?.updateValueAndValidity();
      valueControl?.updateValueAndValidity();
    });
  }

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  ngOnInit() {
    this.storeConfigService.getConfiguration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        this.companyName.set(config.companyName || 'Nuestra Empresa');
        this.taxId.set(config.taxId || 'N/A');
      }
    });
  }

  togglePrivacy() {
    this.privacyMore.update(v => !v);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    // Simulating API call
    setTimeout(() => {
      this.loading.set(false);
      this.form.reset();
      this.alertService.success('Reclamación enviada', 'Su reclamación ha sido registrada exitosamente. Nos comunicaremos con usted pronto.');
    }, 1500);
  }
}
