import { Component, OnInit, inject, signal } from '@angular/core';
import { InventoryTableComponent } from './components/inventory-table/inventory-table';
import { MovementFormComponent } from './components/movement-form/movement-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryMovement, CreateInventoryMovementRequest } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [InventoryTableComponent, MovementFormComponent, ButtonComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  movements = signal<InventoryMovement[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  filterType = signal<string | undefined>(undefined);

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
      error: 'Error al registrar movimiento',
      cancelSuccess: 'Movimiento de inventario anulado correctamente',
      cancelError: 'Error al anular el movimiento de inventario'
    },
    confirmModal: {
      title: '¿Anular movimiento?',
      message: 'Esta acción anulará el movimiento seleccionado y revertirá el stock afectado del producto de forma permanente.',
      severity: 'danger' as const,
      confirmLabel: 'Sí, anular'
    }
  } as const;

  ngOnInit() {
    this.loadMovements();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadMovements({ first: 0, rows: 10 });
  }

  onFilterType(type: string) {
    this.filterType.set(type === 'ALL' ? undefined : type);
    this.loadMovements({ first: 0, rows: 10 });
  }

  loadMovements(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.inventoryService.getAll(page, this.apiConfig.pageSize, this.searchTerm(), this.filterType()).subscribe({
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

  onCancel(id: string) {
    this.modalService.open({
      title: this.content.confirmModal.title,
      message: this.content.confirmModal.message,
      severity: this.content.confirmModal.severity,
      confirmLabel: this.content.confirmModal.confirmLabel,
      onConfirm: () => {
        this.loading.set(true);
        this.inventoryService.cancel(id).subscribe({
          next: () => {
            this.alertService.success(this.content.alerts.cancelSuccess);
            this.loadMovements();
          },
          error: () => {
            this.alertService.error(this.content.alerts.cancelError);
            this.loading.set(false);
          }
        });
      }
    });
  }
}
