import { Component, OnInit, inject, signal } from '@angular/core';
import { ShipmentsTableComponent } from './components/shipments-table/shipments-table';
import { ShipmentFormComponent } from './components/shipment-form/shipment-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ShipmentService } from '../../../core/services/shipment.service';
import { Shipment, CreateShipmentRequest, ShipmentStatus } from '../../../core/models/shipment.model';

@Component({
  selector: 'app-shipments', standalone: true,
  imports: [ShipmentsTableComponent, ShipmentFormComponent, ButtonComponent, CardComponent],
  templateUrl: './shipments.html', styleUrl: './shipments.css'
})
export class ShipmentsComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);

  shipments = signal<Shipment[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingShipment = signal<Shipment | null>(null);

  ngOnInit() { this.loadShipments(); }

  loadShipments(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.shipmentService.getAll(page, 10).subscribe({
      next: r => { this.shipments.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate() { this.editingShipment.set(null); this.formVisible.set(true); }
  openEdit(s: Shipment) { this.editingShipment.set(s); this.formVisible.set(true); }

  onCreate(data: CreateShipmentRequest) {
    this.saving.set(true);
    this.shipmentService.create(data).subscribe({
      next: () => { this.alertService.success('Envío creado'); this.formVisible.set(false); this.saving.set(false); this.loadShipments(); },
      error: () => { this.alertService.error('Error al crear'); this.saving.set(false); }
    });
  }

  onUpdateStatus(data: { id: string, status: ShipmentStatus }) {
    this.saving.set(true);
    this.shipmentService.updateStatus(data.id, data.status).subscribe({
      next: () => { this.alertService.success('Estado actualizado'); this.formVisible.set(false); this.saving.set(false); this.loadShipments(); },
      error: () => { this.alertService.error('Error al actualizar'); this.saving.set(false); }
    });
  }
}
