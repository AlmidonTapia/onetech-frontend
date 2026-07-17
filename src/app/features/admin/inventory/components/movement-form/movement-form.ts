
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';
import { CreateInventoryMovementRequest } from '../../../../../core/domains/inventory/models/inventory.model';
import { Product } from '../../../../../core/domains/catalog/models/product.model';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

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

  ts = inject(AppTranslationService);
  t = this.ts.t;

  @Input() visible: boolean = false;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateInventoryMovementRequest>();
  @Output() cancel = new EventEmitter<void>();

  products: Product[] = [];

  get content() {
    return {
      dialogWidth: '400px',
      labels: {
        product: this.t().adminInventory.form.fields.product,
        type: this.t().adminInventory.form.fields.type,
        quantity: this.t().adminInventory.form.fields.quantity,
        reason: this.t().adminInventory.form.fields.reason
      },
      placeholders: {
        reason: this.t().adminInventory.form.fields.reasonPlaceholder,
        product: this.t().adminInventory.form.fields.productPlaceholder,
        search: this.t().adminInventory.form.fields.searchPlaceholder
      },
      headerTitle: this.t().adminInventory.form.headerTitle,
      errorRequired: this.t().adminInventory.form.errorRequired,
      errorMinQuantity: this.t().adminInventory.form.fields.errorMinQuantity,
      styles: {
        selectWidth: '100%',
        appendTo: 'body'
      },
      actions: {
        cancelLabel: this.t().adminInventory.form.actions.cancelLabel,
        saveLabel: this.t().adminInventory.form.actions.saveLabel,
        saveIcon: 'pi-check'
      }
    };
  }

  get typeOptions() {
    return [
      { label: this.t().adminInventory.table.types.in, value: 'IN' },
      { label: this.t().adminInventory.table.types.out, value: 'OUT' },
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
    this.productService.getAll({ page: 0, size: 100, status: 'ACTIVO' }).subscribe(r => {
      setTimeout(() => {
        this.products = r.content;
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
