import { Component, OnInit, inject, signal } from '@angular/core';
import { ShipmentsTableComponent } from './components/shipments-table/shipments-table';
import { ShipmentFormComponent } from './components/shipment-form/shipment-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ShipmentService } from '../../../core/services/shipment.service';
import { Shipment, CreateShipmentRequest, ShipmentStatus, ShipmentMethod, DispatchShipmentData } from '../../../core/models/shipment.model';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [ShipmentsTableComponent, ShipmentFormComponent, ButtonComponent],
  templateUrl: './shipments.html',
  styleUrl: './shipments.css'
})
export class ShipmentsComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);

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

  content = {
    title: 'Envíos',
    countSuffix: 'envíos registrados',
    createBtnLabel: 'Nuevo envío',
    createBtnIcon: 'pi-plus',
    alerts: {
      createSuccess: 'Envío creado exitosamente',
      createError: 'Error al crear el envío',
      dispatchSuccess: 'Envío despachado exitosamente',
      dispatchError: 'Error al despachar el envío',
      updateSuccess: 'Estado actualizado',
      updateError: 'Error al actualizar el estado'
    }
  } as const;

  ngOnInit() {
    this.loadMethodsAndShipments();
  }

  loadMethodsAndShipments() {
    this.loading.set(true);
    this.shipmentService.getMethods().subscribe({
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
    this.shipmentService.getAll(page, this.apiConfig.pageSize, this.searchTerm()).subscribe({
      next: r => {
        const mappedContent = r.content.map(s => {
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
    this.shipmentService.create(data).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.createSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: () => {
        this.alertService.error(this.content.alerts.createError);
        this.saving.set(false);
      }
    });
  }

  onDispatch(payload: { id: string, data: DispatchShipmentData, file?: File }) {
    this.saving.set(true);
    this.shipmentService.dispatch(payload.id, payload.data, payload.file).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.dispatchSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: () => {
        this.alertService.error(this.content.alerts.dispatchError);
        this.saving.set(false);
      }
    });
  }

  onUpdateStatus(data: { id: string, status: ShipmentStatus }) {
    this.saving.set(true);
    this.shipmentService.updateStatus(data.id, data.status).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.updateSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadShipments();
      },
      error: () => {
        this.alertService.error(this.content.alerts.updateError);
        this.saving.set(false);
      }
    });
  }
}
