import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { AlertComponent } from '../../../../../shared/components/ui/alert/alert';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent,
    InputTextModule, PasswordModule, CheckboxModule, AlertComponent
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterFormComponent {
  formData = input.required<any>();
  fields = input.required<any[]>();
  formGroup = input.required<FormGroup>();
  errorMsg = input<string>('');
  loading = input<boolean>(false);
  
  onSubmit = output<void>();
  onErrorClear = output<void>();

  isInvalid(field: string) {
    const control = this.formGroup().get(field);
    return control?.invalid && control?.touched;
  }

  submit() {
    this.onSubmit.emit();
  }

  clearError() {
    this.onErrorClear.emit();
  }
}
