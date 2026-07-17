import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value === '') {
      return null;
    }
    const isWhitespace = (control.value || '').toString().trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  };
}
