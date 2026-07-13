import { FormGroup } from '@angular/forms';

/**
 * Handles backend errors returned from the API, mapping them to the corresponding FormGroup controls.
 * @param err The error response object from the HttpClient
 * @param form The Angular FormGroup
 * @returns A general error message to display in an alert, or null if all errors were mapped to fields.
 */
export function handleFormError(err: any, form: FormGroup): string | null {
  if (!err || !err.error) {
    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
  }

  const errorResponse = err.error;

  // Si hay errores de validación (fieldErrors map) - HTTP 400
  if (errorResponse.fieldErrors && Object.keys(errorResponse.fieldErrors).length > 0) {
    for (const [field, message] of Object.entries(errorResponse.fieldErrors)) {
      const control = form.get(field);
      if (control) {
        control.setErrors({ backend: message });
        control.markAsTouched();
      }
    }
    return errorResponse.message || 'Verifique los campos marcados en rojo.';
  }

  // Errores de negocio (HTTP 401, 403, 404, 409, etc.)
  if (errorResponse.message) {
    return errorResponse.message;
  }

  return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
}
