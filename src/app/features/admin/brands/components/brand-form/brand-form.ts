import { Component, Input, Output, EventEmitter, OnChanges, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Brand, CreateBrandRequest, UpdateBrandRequest } from '../../../../../core/domains/catalog/models/brand.model';
import { BrandStatus } from '../../../../../core/domains/catalog/enums/brand-status.enum';
import { noWhitespaceValidator } from '../../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonComponent],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css'
})
export class BrandFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible: boolean = false;
  @Input() brand: Brand | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ request: CreateBrandRequest | UpdateBrandRequest, file?: File }>();
  @Output() cancel = new EventEmitter<void>();

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  content = {
    dialogWidth: '400px',
    titleNew: 'Nueva Marca',
    titleEdit: 'Editar Marca',
    errorRequired: 'Campo requerido',
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar',
      saveIcon: 'pi-check'
    },
    image: {
      label: 'Imagen de la marca',
      changeText: 'Cambiar imagen',
      selectText: 'Seleccionar imagen'
    }
  };

  statusOptions = [
    { label: 'Habilitado', value: BrandStatus.HABILITADO },
    { label: 'Deshabilitado', value: BrandStatus.DESHABILITADO }
  ];

  formConfig: any[] = [
    [{ name: 'brandName', label: 'Nombre de la marca *', type: 'text', placeholder: 'Ej: HP, Lenovo, Samsung' }]
  ];

  form = this.fb.group({
    brandName: ['', [Validators.required, noWhitespaceValidator(), Validators.minLength(2)]],
    status: [BrandStatus.HABILITADO]
  });

  get title() {
    return this.brand ? this.content.titleEdit : this.content.titleNew;
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnChanges() {
    this.brand ? this.form.patchValue({ brandName: this.brand.brandName, status: this.brand.status as BrandStatus }) : this.form.reset({ status: BrandStatus.HABILITADO });
    this.selectedFile.set(null);
    this.previewUrl.set(this.brand?.imageUrl || null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = e => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const req = this.brand 
      ? (this.form.value as UpdateBrandRequest) 
      : ({ brandName: this.form.value.brandName } as CreateBrandRequest);
      
    this.save.emit({
      request: req,
      file: this.selectedFile() ?? undefined
    });
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
