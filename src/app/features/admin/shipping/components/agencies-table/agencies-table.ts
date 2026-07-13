import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { ShipmentsMethodTableComponent } from './components/shipments-method-table/shipments-method-table';
import { ShipmentMethodFormComponent } from './components/shipment-method-form/shipment-method-form';

@Component({
  selector: 'app-agencies-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent,  ShipmentsMethodTableComponent, ShipmentMethodFormComponent],
  templateUrl: './agencies-table.html',
  styleUrl: './agencies-table.css'
})
export class AgenciesTableComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  methods = signal<ShipmentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<ShipmentMethod | null>(null);
  searchTerm = signal<string | undefined>(undefined);

  statuses = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  content = {
    title: 'Métodos de Envío',
    badgeSuffix: ' métodos',
    newBtnLabel: 'Nuevo Método',
    newBtnIcon: 'pi-plus',
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar agencia...',
      headers: {
        name: 'Nombre del Método',
        price: 'Precio Base',
        status: 'Estado',
        actions: 'Acciones'
      },
      emptyMsg: 'No hay métodos de envío registrados.'
    },
    dialog: {
      createTitle: 'Nuevo Método de Envío',
      editTitle: 'Editar Método de Envío',
      fields: {
        name: 'Nombre del Método',
        namePlaceholder: 'Ej: Express',
        price: 'Precio Base (S/)',
        status: 'Estado',
        statusPlaceholder: 'Seleccione un estado'
      },
      actions: {
        cancel: 'Cancelar',
        save: 'Guardar'
      }
    },
    confirmDelete: {
      title: '¿Eliminar método de envío?',
      message: (name: string) => `El método de envío "${name}" será eliminado de forma permanente.`,
      confirmLabel: 'Sí, eliminar',
      severity: 'danger'
    },
    alerts: {
      saveSuccess: 'Método de envío guardado',
      saveError: 'Error al guardar método',
      deleteSuccess: 'Método de envío eliminado exitosamente',
      deleteError: 'Error al eliminar el método de envío'
    }
  };

  form = this.fb.group({
    methodName: ['', Validators.required],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    status: ['ACTIVO']
  });

  ngOnInit() {
    this.loadMethods();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadMethods();
  }

  loadMethods() {
    this.loading.set(true);
    this.shipmentService.getMethods(false, this.searchTerm()).subscribe({
      next: r => {
        this.methods.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingMethod.set(null);
    this.form.reset({ methodName: '', basePrice: 0, status: 'ACTIVO' });
    this.formVisible.set(true);
  }

  openEdit(m: ShipmentMethod) {
    this.editingMethod.set(m);
    this.form.reset({
      methodName: m.methodName,
      basePrice: m.basePrice,
      status: m.status || 'ACTIVO'
    });
    this.formVisible.set(true);
  }

  onSave() {
    if (this.form.invalid) return;
    this.saving.set(true);
    
    const formVal = this.form.value;
    const data: any = {
      methodName: formVal.methodName!,
      basePrice: formVal.basePrice!,
      status: formVal.status || 'ACTIVO'
    };

    const currentMethod = this.editingMethod();
    const req$ = currentMethod
      ? this.shipmentService.updateMethod(currentMethod.idShipmentMethod, data)
      : this.shipmentService.createMethod(data);

    req$.subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.content.alerts.saveError;
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: ShipmentMethod) {
    this.modalService.open({
      title: this.content.confirmDelete.title,
      message: this.content.confirmDelete.message(m.methodName),
      severity: this.content.confirmDelete.severity as any,
      confirmLabel: this.content.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteMethod(m.idShipmentMethod).subscribe({
          next: () => {
            this.alertService.success(this.content.alerts.deleteSuccess);
            this.loadMethods();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.content.alerts.deleteError;
            this.alertService.error(errMsg);
          }
        });
      }
    });
  }
}
