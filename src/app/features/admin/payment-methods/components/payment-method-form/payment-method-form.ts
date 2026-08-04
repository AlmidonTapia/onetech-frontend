import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonComponent],
  templateUrl: './payment-method-form.html'
})
export class PaymentMethodFormComponent {
  visible = input<boolean>(false);
  isEditing = input<boolean>(false);
  formGroup = input.required<FormGroup>();
  saving = input<boolean>(false);
  
  onClose = output<void>();
  onSave = output<void>();

  // We will pass content from parent now
  content = input.required<any>();

  close() {
    this.onClose.emit();
  }

  submit() {
    this.onSave.emit();
  }
}
