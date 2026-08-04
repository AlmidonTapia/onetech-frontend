import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShipmentsTableComponent } from './components/shipments-table/shipments-table';
import { ShipmentFormComponent } from './components/shipment-form/shipment-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ShipmentService } from '../../../core/domains/shipping/services/shipment.service';
import { Shipment, CreateShipmentRequest, ShipmentStatus, ShipmentMethod, DispatchShipmentData } from '../../../core/domains/shipping/models/shipment.model';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [ShipmentsTableComponent, ShipmentFormComponent, ButtonComponent],
  templateUrl: './shipments.html'
})
export class ShipmentsComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  shipments = signal<Shipment[]>([]);
  methods = signal<ShipmentMethod[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  searchTerm = signal<string | undefined>(undefined);
  editingShipment = signal<Shipment | null>(null);

  apiConfig = {
    pageSize: 10
  };

  ngOnInit() {
    this.loadMethodsAndShipments();
  }

  loadMethodsAndShipments() {
    this.loading.set(true);
    this.shipmentService.getMethods().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: m => {
        this.methods.set(m);
        this.loadShipments();
      },
      error: () => {
        this.loadShipments();
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadShipments({ first: 0, rows: 10 });
  }

  loadShipments(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.shipmentService.getAll(page, this.apiConfig.pageSize, this.searchTerm()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => {
        const mappedContent = r.content.map((s: any) => {
          const method = this.methods().find(m => m.idShipmentMethod === s.idShipmentMethod);
          return {
            ...s,
            shipmentMethodName: method ? method.methodName : 'Desconocido'
          };
        });
        this.shipments.set(mappedContent);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingShipment.set(null);
    this.formVisible.set(true);
  }

  openEdit(s: Shipment) {
    this.editingShipment.set(s);
    this.formVisible.set(true);
  }

  onCreate(data: CreateShipmentRequest) {
    this.saving.set(true);
    this.shipmentService.create(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Envío creado exitosamente');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al crear el envío';
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onDispatch(payload: { id: string, data: DispatchShipmentData, file?: File }) {
    this.saving.set(true);
    this.shipmentService.dispatch(payload.id, payload.data, payload.file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Envío despachado exitosamente');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al despachar el envío';
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onUpdateStatus(data: { id: string, status: ShipmentStatus }) {
    this.saving.set(true);
    this.shipmentService.updateStatus(data.id, data.status).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Estado actualizado');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al actualizar el estado';
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }
}
