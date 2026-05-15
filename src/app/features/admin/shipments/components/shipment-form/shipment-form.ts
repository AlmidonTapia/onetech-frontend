import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Shipment, CreateShipmentRequest, ShipmentStatus, ShipmentMethod } from '../../../../../core/models/shipment.model';
import { ShipmentService } from '../../../../../core/services/shipment.service';

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonComponent, InputNumberModule],
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.css'
})
export class ShipmentFormComponent implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private shipmentService = inject(ShipmentService);

  @Input() visible = false;
  @Input() shipment: Shipment | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateShipmentRequest>();
  @Output() updateStatus = new EventEmitter<{ id: string, status: ShipmentStatus }>();
  @Output() cancel = new EventEmitter<void>();

  methods = signal<ShipmentMethod[]>([]);
  statuses = [
    { label: 'En Preparación', value: 'EN_PREPARACION' },
    { label: 'En Camino', value: 'EN_CAMINO' },
    { label: 'Entregado', value: 'ENTREGADO' },
    { label: 'Devuelto', value: 'DEVUELTO' }
  ];

  formConfig: any[] = [
    [{ name: 'idOrder', label: 'ID del Pedido *', type: 'text', placeholder: 'Ej: ord_123' }],
    [{ name: 'idShipmentMethod', label: 'Método de Envío *', type: 'select', optionsKey: 'methods', optionLabel: 'methodName', optionValue: 'idShipmentMethod', placeholder: 'Seleccione un método' }],
    [{ name: 'trackingNumber', label: 'Tracking Number *', type: 'text', placeholder: 'Ej: TRK-987' }],
    [
      { name: 'shippingCost', label: 'Costo (S/.) *', type: 'number', placeholder: '0.00', min: 0, minFractionDigits: 2 },
      { name: 'estimatedArrival', label: 'Llegada Estimada *', type: 'date' }
    ]
  ];

  statusFormConfig: any[] = [
    [{ name: 'status', label: 'Estado del Envío', type: 'select', optionsKey: 'statuses', optionLabel: 'label', optionValue: 'value', placeholder: 'Seleccione un estado' }]
  ];

  form = this.fb.group({
    idOrder: ['', Validators.required],
    idShipmentMethod: ['', Validators.required],
    trackingNumber: ['', Validators.required],
    shippingCost: [0, [Validators.required, Validators.min(0)]],
    estimatedArrival: ['', Validators.required]
  });

  statusForm = this.fb.group({ status: ['', Validators.required] });

  getOptions(key: string) {
    if (key === 'methods') return this.methods();
    if (key === 'statuses') return this.statuses;
    return [];
  }

  isInvalid(field: string, formGroup: FormGroup) {
    const control = formGroup.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnInit() {
    this.shipmentService.getMethods().subscribe({
        next: (m) => this.methods.set(m),
        error: () => {}
    });
  }

  get title() { return this.shipment ? 'Actualizar Estado' : 'Nuevo Envío'; }

  ngOnChanges() {
    if (this.shipment) {
      this.statusForm.patchValue({ status: this.shipment.status });
    } else {
      this.form.reset({ shippingCost: 0 });
    }
  }

  onSave() {
    if (this.shipment) {
      if (this.statusForm.invalid) { this.statusForm.markAllAsTouched(); return; }
      this.updateStatus.emit({ id: this.shipment.idShipment, status: this.statusForm.value.status as ShipmentStatus });
    } else {
      if (this.form.invalid) { this.form.markAllAsTouched(); return; }
      const payload: CreateShipmentRequest = {
         idOrder: this.form.value.idOrder as string,
         idShipmentMethod: this.form.value.idShipmentMethod as string,
         trackingNumber: this.form.value.trackingNumber as string,
         shippingCost: this.form.value.shippingCost as number,
         estimatedArrival: (this.form.value.estimatedArrival as string) + 'T00:00:00Z'
      };
      this.save.emit(payload);
    }
  }

  onCancel() {
    this.form.reset({ shippingCost: 0 });
    this.statusForm.reset();
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
