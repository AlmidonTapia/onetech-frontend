
import { Component, Input, Output, EventEmitter, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';
import { CreateInventoryMovementRequest } from '../../../../../core/domains/inventory/models/inventory.model';
import { Product } from '../../../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule,
    InputNumberModule, SelectModule, ButtonComponent],
  templateUrl: './movement-form.html'
})
export class MovementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  @Input() visible: boolean = false;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateInventoryMovementRequest>();
  @Output() cancel = new EventEmitter<void>();

  products = signal<Product[]>([]);

  get content() {
    return {
      dialogWidth: '400px',
      labels: {
        product: 'Producto *',
        type: 'Tipo de movimiento *',
        quantity: 'Cantidad *',
        reason: 'Motivo *'
      },
      placeholders: {
        reason: 'Ej: Compra de proveedor, Venta, Ajuste...',
        product: 'Seleccionar producto',
        search: 'Buscar...'
      },
      headerTitle: 'Registrar movimiento de inventario',
      errorRequired: 'El motivo es requerido',
      errorMinQuantity: 'Cantidad mínima es 1',
      styles: {
        selectWidth: '100%',
        appendTo: 'body'
      },
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Registrar movimiento',
        saveIcon: 'pi-check'
      }
    };
  }

  get typeOptions() {
    return [
      { label: 'Entrada (IN)', value: 'IN' },
      { label: 'Salida (OUT)', value: 'OUT' },
    ];
  }

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
    this.productService.getAll({ page: 0, size: 100, status: 'ACTIVO' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      setTimeout(() => {
        this.products.set(r.content);
      });
    });
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
