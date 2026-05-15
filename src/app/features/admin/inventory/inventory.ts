import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { InventoryService } from '../../../core/services/inventory.service';
import { ProductService } from '../../../core/services/product.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { InventoryMovement, CreateInventoryMovementRequest } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    NgClass, ReactiveFormsModule, TableModule, DialogModule,
    InputTextModule, InputNumberModule, SelectModule, TagModule, ButtonComponent, DatePipe
  ],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class InventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  movements = signal<InventoryMovement[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  dialogVisible = signal(false);
  saving = signal(false);

  productOptions = signal<{ label: string; value: string }[]>([]);

  readonly movementTypeOptions = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  formConfig: any[] = [
    [
      { name: 'idProduct', label: 'Producto *', type: 'select', optionsKey: 'productOptions', optionLabel: 'label', optionValue: 'value', placeholder: 'Selecciona un producto', filter: true }
    ],
    [
      { name: 'movementType', label: 'Tipo *', type: 'select', optionsKey: 'movementTypeOptions', optionLabel: 'label', optionValue: 'value' },
      { name: 'quantity', label: 'Cantidad *', type: 'number', min: 1 }
    ],
    [
      { name: 'reason', label: 'Motivo *', type: 'text', placeholder: 'Ej: Compra a proveedor, Ajuste de inventario...' }
    ]
  ];

  form = this.fb.group({
    idProduct: ['', Validators.required],
    movementType: ['IN' as 'IN' | 'OUT', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  getOptions(key: string) {
    if (key === 'productOptions') return this.productOptions();
    if (key === 'movementTypeOptions') return this.movementTypeOptions;
    return [];
  }

  isInvalid = (f: string) => { const c = this.form.get(f); return c?.invalid && c?.touched; };

  ngOnInit() {
    this.loadMovements();
    this.productService.getAll({ page: 0, size: 200 }).subscribe(res => {
      this.productOptions.set(res.content.map(p => ({ label: p.productName, value: p.id })));
    });
  }

  loadMovements(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    const size = event?.rows ?? 10;
    this.loading.set(true);
    this.inventoryService.getAll(page, size).subscribe({
      next: res => {
        this.movements.set(res.content);
        this.totalRecords.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openRegister() {
    this.form.reset({ movementType: 'IN', quantity: 1 });
    this.dialogVisible.set(true);
  }

  onSave() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.inventoryService.register(this.form.value as CreateInventoryMovementRequest).subscribe({
      next: () => {
        this.alertService.success('Registrado', 'Movimiento registrado correctamente.');
        this.dialogVisible.set(false);
        this.saving.set(false);
        this.loadMovements();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo registrar el movimiento.');
        this.saving.set(false);
      },
    });
  }
}