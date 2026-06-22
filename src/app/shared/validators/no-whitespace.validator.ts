import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator that requires the control to have a non-whitespace value.
 * Fails if the string is empty or contains only spaces.
 */
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
