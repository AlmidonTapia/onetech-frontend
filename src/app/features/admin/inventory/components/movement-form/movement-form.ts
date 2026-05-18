
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ProductService } from '../../../../../core/services/product.service';
import { CreateInventoryMovementRequest } from '../../../../../core/models/inventory.model';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule,
    InputNumberModule, SelectModule, ButtonComponent],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css'
})
export class MovementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  @Input() visible: boolean = false;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateInventoryMovementRequest>();
  @Output() cancel = new EventEmitter<void>();

  products: Product[] = [];

  content = {
    dialogWidth: '500px',
    headerTitle: 'Registrar movimiento de inventario',
    errorRequired: 'El motivo es requerido',
    styles: {
      selectWidth: '100%',
      appendTo: 'body'
    },
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Registrar movimiento',
      saveIcon: 'pi-check'
    }
  } as const;

  readonly typeOptions = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  readonly typeIcons: Record<string, string> = {
    IN: 'pi pi-arrow-up',
    OUT: 'pi pi-arrow-down'
  };

  form = this.fb.group({
    idProduct: ['', Validators.required],
    movementType: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  ngOnInit() {
    this.productService.getAll({ page: 0, size: 100 }).subscribe(r => this.products = r.content);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSave() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.value as CreateInventoryMovementRequest);
  }

  onCancel() {
    this.form.reset({ movementType: 'IN', quantity: 1 });
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
