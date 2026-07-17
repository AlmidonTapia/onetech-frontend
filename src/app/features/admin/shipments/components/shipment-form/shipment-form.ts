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
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

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

  ts = inject(AppTranslationService);
  t = this.ts.t;

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

  get content() {
    return {
      dialogWidth: '500px',
      titleNew: this.t().adminShipments.form.titleNew,
      titleDispatch: this.t().adminShipments.form.titleDispatch,
      titleView: this.t().adminShipments.form.titleView,
      errorRequired: this.t().adminShipments.form.errorRequired,
      apiTimezoneSuffix: 'T00:00:00',
      styles: {
        selectWidth: '100%',
        appendTo: 'body'
      },
      actions: {
        cancelLabel: this.t().adminShipments.form.actions.cancelLabel,
        saveLabel: this.t().adminShipments.form.actions.saveLabel,
        dispatchLabel: this.t().adminShipments.form.actions.dispatchLabel,
        deliveredLabel: this.t().adminShipments.form.actions.deliveredLabel,
        returnedLabel: this.t().adminShipments.form.actions.returnedLabel,
        pendingReturn: this.t().adminShipments.form.actions.pendingReturn,
        receiveWarehouse: this.t().adminShipments.form.actions.receiveWarehouse,
        saveIcon: 'pi-check'
      },
      details: {
        status: this.t().adminShipments.form.details.status,
        orderId: this.t().adminShipments.form.details.orderId,
        trackingNumber: this.t().adminShipments.form.details.trackingNumber,
        pickupCode: this.t().adminShipments.form.details.pickupCode,
        shippedAt: this.t().adminShipments.form.details.shippedAt,
        estimatedArrival: this.t().adminShipments.form.details.estimatedArrival,
        actualArrival: this.t().adminShipments.form.details.actualArrival,
        receiptImage: this.t().adminShipments.form.details.receiptImage,
        viewReceipt: this.t().adminShipments.form.details.viewReceipt
      },
      fields: {
        orderId: this.t().adminShipments.form.fields.orderId,
        orderIdPlaceholder: this.t().adminShipments.form.fields.orderIdPlaceholder,
        method: this.t().adminShipments.form.fields.method,
        methodPlaceholder: this.t().adminShipments.form.fields.methodPlaceholder,
        cost: this.t().adminShipments.form.fields.cost,
        estimatedArrival: this.t().adminShipments.form.fields.estimatedArrival,
        trackingNumber: this.t().adminShipments.form.fields.trackingNumber,
        trackingPlaceholder: this.t().adminShipments.form.fields.trackingPlaceholder,
        pickupCode: this.t().adminShipments.form.fields.pickupCode,
        pickupCodePlaceholder: this.t().adminShipments.form.fields.pickupCodePlaceholder,
        shippedAt: this.t().adminShipments.form.fields.shippedAt,
        receiptImage: this.t().adminShipments.form.fields.receiptImage,
        errorImageRequired: this.t().adminShipments.form.errorImageRequired
      }
    };
  }

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
        this.alertService.error(this.t().adminShipments.form.errorImageFormat);
        if (this.fileUpload?.nativeElement) this.fileUpload.nativeElement.value = '';
        this.selectedFile = null;
        return;
      }
      if (!FileValidatorUtil.validateFileSize(file, 5)) {
        this.alertService.error(this.t().adminShipments.form.errorImageSize);
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
