import { Component, OnInit, inject, signal } from '@angular/core';
import { InventoryTableComponent } from './components/inventory-table/inventory-table';
import { MovementFormComponent } from './components/movement-form/movement-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryMovement, CreateInventoryMovementRequest } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [InventoryTableComponent, MovementFormComponent, ButtonComponent, CardComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private alertService = inject(AlertService);

  movements = signal<InventoryMovement[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);

  apiConfig = {
    pageSize: 10
  };

  content = {
    title: 'Inventario',
    countSuffix: 'movimientos registrados',
    createBtnLabel: 'Registrar movimiento',
    createBtnIcon: 'pi-plus',
    cardPadding: 'none',
    alerts: {
      success: 'Movimiento registrado correctamente',
      error: 'Error al registrar movimiento'
    }
  } as const;

  ngOnInit() {
    this.loadMovements();
  }

  loadMovements(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.inventoryService.getAll(page, this.apiConfig.pageSize).subscribe({
      next: r => {
        this.movements.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSave(data: CreateInventoryMovementRequest) {
    this.saving.set(true);
    this.inventoryService.register(data).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.success);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMovements();
      },
      error: () => {
        this.alertService.error(this.content.alerts.error);
        this.saving.set(false);
      }
    });
  }
}
