import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [PasswordModule, ReactiveFormsModule],
  templateUrl: './password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  control = input<AbstractControl | null>(null);
  label = input<string>('');
  placeholder = input<string>('');
  id = input<string>(`ot-password-${Math.random().toString(36).slice(2, 7)}`);
  showStrengthMeter = input<boolean>(false);
  disabled = input<boolean>(false);
  errors = input<Record<string, string>>({});
  hint = input<string>('');

  isInvalid = computed(() => {
    const ctrl = this.control();
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  });

  defaultErrors = input<Record<string, string>>({
    required: 'Campo requerido',
    minlength: 'Mínimo de caracteres requeridos',
    maxlength: 'Máximo de caracteres excedido',
    pattern: 'Formato inválido',
    invalidField: 'Campo inválido'
  });

  errorMessage = computed((): string => {
    const ctrl = this.control();
    if (!ctrl?.errors) return '';

    const custom = this.errors();
    const def = this.defaultErrors();

    const firstKey = Object.keys(ctrl.errors)[0];
    if (custom[firstKey]) return custom[firstKey];

    if (firstKey === 'required') return def['required'];
    if (firstKey === 'minlength') {
      return def['minlength'] + ' (' + (ctrl.errors['minlength']?.requiredLength ?? '') + ')';
    }
    if (firstKey === 'maxlength') {
      return def['maxlength'] + ' (' + (ctrl.errors['maxlength']?.requiredLength ?? '') + ')';
    }
    if (firstKey === 'backend') return ctrl.errors['backend'] ?? '';
    if (firstKey === 'pattern') return def['pattern'];

    return def['invalidField'];
  });
}
