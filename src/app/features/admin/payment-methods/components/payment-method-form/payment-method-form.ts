import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonComponent],
  templateUrl: './payment-method-form.html',
  styleUrl: './payment-method-form.css'
})
export class PaymentMethodFormComponent {
  visible = input<boolean>(false);
  isEditing = input<boolean>(false);
  formGroup = input.required<FormGroup>();
  saving = input<boolean>(false);
  
  onClose = output<void>();
  onSave = output<void>();

  content = {
    titleNew: 'Nuevo Método de Pago',
    titleEdit: 'Editar Método de Pago',
    labels: {
      name: 'Nombre del Método',
      status: 'Estado'
    },
    statusOptions: {
      active: 'Activo',
      inactive: 'Inactivo'
    },
    placeholders: {
      name: 'Ej: Tarjeta de Crédito, PayPal'
    },
    buttons: {
      cancel: 'Cancelar',
      save: 'Guardar'
    }
  };

  close() {
    this.onClose.emit();
  }

  submit() {
    this.onSave.emit();
  }
}
