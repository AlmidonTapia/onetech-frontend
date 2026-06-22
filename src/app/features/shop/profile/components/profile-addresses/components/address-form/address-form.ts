import { Component, OnInit, input, output, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../../../shared/components/ui/button/button';
import { UbigeoService, LocationResponse } from '../../../../../../../core/services/ubigeo.service';
import { CreateAddressRequest } from '../../../../../../../core/models/address.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css'
})
export class AddressFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);
  private destroyRef = inject(DestroyRef);

  content = input.required<any>();
  saving = input<boolean>(false);
  
  onCancel = output<void>();
  onSave = output<CreateAddressRequest>();

  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

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
    this.ubigeoService.getDepartments().subscribe(d => this.departments.set(d));

    this.form.get('department')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(depId => {
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

    this.form.get('province')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(provId => {
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

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  cancel() {
    this.onCancel.emit();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.getRawValue();
    const requestData: CreateAddressRequest = {
      country: formData.country!,
      ubigeoCode: formData.district!,
      mainAddress: formData.mainAddress!,
      reference: formData.reference || '',
      isDefault: formData.isDefault || false
    };
    this.onSave.emit(requestData);
  }
}
