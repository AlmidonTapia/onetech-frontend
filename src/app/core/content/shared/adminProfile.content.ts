export const adminProfileContent = {
  title: "Mi Perfil",
  subtitle: "Administra tu información personal y seguridad",
  tabs: {
    info: "Información Personal",
    security: "Seguridad"
  },
  infoSection: {
    title: "Datos del administrador",
    subtitle: "Actualiza tus datos de contacto.",
    labels: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      documentType: "Tipo de documento",
      documentNumber: "Número de documento",
      phone: "Teléfono / Celular"
    },
    hints: {
      emailImmutable: "El correo no puede modificarse.",
      nameImmutable: "El nombre se establece al registrarse."
    },
    placeholders: {
      docTypeSelect: "Seleccionar",
      docNumber: "12345678",
      phone: "987654321"
    },
    errors: {
      phonePattern: "Ingresa un número de 9 dígitos."
    },
    saveLabel: "Guardar cambios"
  },
  securitySection: {
    title: "Cambiar contraseña",
    subtitle: "Usa una contraseña segura de al menos 8 caracteres.",
    labels: {
      currentPassword: "Contraseña actual *",
      newPassword: "Nueva contraseña *",
      confirmPassword: "Confirmar nueva contraseña *"
    },
    placeholders: {
      currentPassword: "Tu contraseña actual",
      newPassword: "Mínimo 8 caracteres",
      confirmPassword: "Repite la nueva contraseña"
    },
    errors: {
      required: "Campo requerido",
      minlength: "Mínimo 8 caracteres",
      mismatch: "Las contraseñas no coinciden"
    },
    saveLabel: "Actualizar contraseña"
  },
  alerts: {
    profileSuccess: "Perfil actualizado correctamente",
    profileError: "Error al actualizar el perfil",
    passwordSuccess: "Contraseña actualizada correctamente",
    passwordError: "Error al cambiar contraseña",
    passwordErrorMsg: "Verifica tu contraseña actual."
  }
};
