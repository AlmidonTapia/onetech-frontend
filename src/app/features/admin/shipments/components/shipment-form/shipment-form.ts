import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Shipment, CreateShipmentRequest, ShipmentStatus, ShipmentMethod, DispatchShipmentData } from '../../../../../core/domains/shipping/models/shipment.model';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { FileValidatorUtil } from '../../../../../shared/utils/file-validator.util';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonComponent, InputNumberModule, DatePipe],
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.css'
})
export class ShipmentFormComponent implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);

  @Input() visible = false;
  @Input() shipment: Shipment | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateShipmentRequest>();
  @Output() dispatch = new EventEmitter<{ id: string, data: DispatchShipmentData, file?: File }>();
  @Output() updateStatus = new EventEmitter<{
    id: string;
    status: ShipmentStatus;
  }>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  methods = signal<ShipmentMethod[]>([]);

  content = {
    dialogWidth: '500px',
    titleNew: 'Nuevo Envío',
    titleDispatch: 'Despachar Envío',
    titleView: 'Detalles del Envío',
    errorRequired: 'Campo requerido',
    apiTimezoneSuffix: 'T00:00:00',
    styles: {
      selectWidth: '100%',
      appendTo: 'body'
    },
    actions: {
      cancelLabel: 'Cerrar',
      saveLabel: 'Guardar',
      dispatchLabel: 'Despachar',
      deliveredLabel: 'Marcar Entregado',
      returnedLabel: 'Marcar Devuelto',
      saveIcon: 'pi-check'
    }
  } as const;

  form = this.fb.group({
    idOrder: ['', Validators.required],
    idShipmentMethod: ['', Validators.required],
    shippingCost: [0, [Validators.required, Validators.min(0)]],
    estimatedArrival: ['', Validators.required]
  });

  dispatchForm = this.fb.group({
    trackingNumber: ['', Validators.required],
    pickupCode: ['', Validators.required],
    shippedAt: ['', Validators.required],
    estimatedArrival: ['', Validators.required]
  });

  get title() {
    if (!this.shipment) return this.content.titleNew;
    if (this.shipment.status === 'EN_PREPARACION') return this.content.titleDispatch;
    return this.content.titleView;
  }

  ngOnInit() {
    this.shipmentService.getMethods().subscribe({
      next: (m) => this.methods.set(m),
      error: () => { }
    });
  }

  isInvalid(field: string, formGroup: FormGroup) {
    const control = formGroup.get(field);
    return control?.invalid && control?.touched;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!FileValidatorUtil.validateFileType(file, ['image/jpeg', 'image/png', 'image/webp'])) {
        this.alertService.error('Solo se permiten imágenes (JPG, PNG, WEBP).');
        if (this.fileUpload?.nativeElement) this.fileUpload.nativeElement.value = '';
        this.selectedFile = null;
        return;
      }
      if (!FileValidatorUtil.validateFileSize(file, 5)) {
        this.alertService.error('La imagen no debe pesar más de 5MB.');
        if (this.fileUpload?.nativeElement) this.fileUpload.nativeElement.value = '';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
    }
  }

  ngOnChanges() {
    this.selectedFile = null;
    if (this.fileUpload?.nativeElement) {
      this.fileUpload.nativeElement.value = '';
    }

    if (this.shipment) {
      if (this.shipment.status === 'EN_PREPARACION') {
        let estArr = '';
        if (this.shipment.estimatedArrival) {
          estArr = this.shipment.estimatedArrival.substring(0, 10);
        }
        const now = new Date();
        const shippedAtStr = now.toISOString().substring(0, 16); 
        this.dispatchForm.patchValue({
          trackingNumber: this.shipment.trackingNumber || '',
          pickupCode: this.shipment.pickupCode || '',
          shippedAt: shippedAtStr,
          estimatedArrival: estArr
        });
      }
    } else {
      this.form.reset({ shippingCost: 0 });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: CreateShipmentRequest = {
      idOrder: this.form.value.idOrder as string,
      idShipmentMethod: this.form.value.idShipmentMethod as string,
      trackingNumber: '', 
      shippingCost: this.form.value.shippingCost as number,
      estimatedArrival: (this.form.value.estimatedArrival as string) + this.content.apiTimezoneSuffix
    };
    this.save.emit(payload);
  }

  onDispatch() {
    if (this.dispatchForm.invalid || !this.selectedFile) {
      this.dispatchForm.markAllAsTouched();
      if (!this.selectedFile) {
      }
      return;
    }
    
    let shippedAt = this.dispatchForm.value.shippedAt as string;
    if (shippedAt.length === 16) {
      shippedAt += ':00';
    }

    const data: DispatchShipmentData = {
      trackingNumber: this.dispatchForm.value.trackingNumber as string,
      pickupCode: this.dispatchForm.value.pickupCode as string,
      shippedAt: shippedAt,
      estimatedArrival: (this.dispatchForm.value.estimatedArrival as string) + this.content.apiTimezoneSuffix
    };

    this.dispatch.emit({
      id: this.shipment!.idShipment,
      data,
      file: this.selectedFile
    });
  }

  onUpdateStatus(status: ShipmentStatus) {
    if (!this.shipment) return;
    this.updateStatus.emit({
      id: this.shipment.idShipment,
      status
    });
  }

  onCancel() {
    this.form.reset({ shippingCost: 0 });
    this.dispatchForm.reset();
    this.selectedFile = null;
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
