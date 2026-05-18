import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Brand, CreateBrandRequest } from '../../../../../core/models/brand.model';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, ButtonComponent],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css'
})
export class BrandFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible: boolean = false;
  @Input() brand: Brand | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateBrandRequest>();
  @Output() cancel = new EventEmitter<void>();

  content = {
    dialogWidth: '400px',
    titleNew: 'Nueva Marca',
    titleEdit: 'Editar Marca',
    errorRequired: 'Campo requerido',
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar',
      saveIcon: 'pi-check'
    }
  };

  formConfig: any[] = [
    [{ name: 'brandName', label: 'Nombre de la marca *', type: 'text', placeholder: 'Ej: HP, Lenovo, Samsung' }]
  ];

  form = this.fb.group({
    brandName: ['', [Validators.required, Validators.minLength(2)]]
  });

  get title() {
    return this.brand ? this.content.titleEdit : this.content.titleNew;
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnChanges() {
    this.brand ? this.form.patchValue({ brandName: this.brand.brandName }) : this.form.reset();
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as CreateBrandRequest);
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
