import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-shipment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, SelectModule, ButtonComponent],
  templateUrl: './shipment-method-form.html',
  styleUrl: './shipment-method-form.css'
})
export class ShipmentMethodFormComponent {
  visible = input<boolean>(false);
  isEditing = input<boolean>(false);
  formGroup = input.required<FormGroup>();
  saving = input<boolean>(false);
  content = input.required<any>();
  statuses = input.required<any[]>();
  
  onClose = output<void>();
  onSave = output<void>();

  close() {
    this.onClose.emit();
  }

  submit() {
    this.onSave.emit();
  }
}
