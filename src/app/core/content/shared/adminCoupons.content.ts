export const adminCouponsContent = {
  title: "Cupones",
  countSuffix: "cupones registrados",
  createBtnLabel: "Nuevo Cupón",
  alerts: {
    createSuccess: "Cupón creado",
    updateSuccess: "Cupón actualizado",
    saveError: "Error al guardar cupón",
    deleteSuccess: "Cupón eliminado",
    deleteError: "Error al eliminar cupón"
  },
  confirmModal: {
    title: "¿Eliminar cupón?",
    deleteMessage: "El cupón \"{code}\" será eliminado permanentemente.",
    confirmLabel: "Sí, eliminar"
  },
  table: {
    quickSearchTitle: "Búsqueda Rápida",
    searchPlaceholder: "Código del cupón...",
    emptyMessage: "No se encontraron cupones.",
    headers: {
      code: "Código",
      discountType: "Tipo",
      discountValue: "Valor",
      startDate: "Inicio",
      expirationDate: "Expiración",
      usageLimit: "Límite de Uso",
      usedCount: "Usado",
      active: "Activo",
      actions: "Acciones"
    },
    tooltips: {
      edit: "Editar",
      delete: "Eliminar"
    },
    types: {
      all: "Todos los tipos",
      percentage: "Porcentaje",
      fixed: "Fijo",
      fixedLabel: "Monto fijo"
    },
    statuses: {
      all: "Todos los estados",
      active: "Activo",
      inactive: "Inactivo",
      exhausted: "Agotado",
      expired: "Expirado"
    },
    values: {
      immediate: "Inmediato",
      noLimit: "Sin límite"
    }
  },
  form: {
    titleNew: "Nuevo Cupón",
    titleEdit: "Editar Cupón",
    errorRequired: "Campo requerido",
    actions: {
      cancelLabel: "Cancelar",
      saveLabel: "Guardar Cupón"
    },
    fields: {
      codeLabel: "Código del Cupón *",
      codePlaceholder: "Ej: VERANO2026",
      typeLabel: "Tipo de Descuento *",
      valueLabel: "Valor de Descuento *",
      startDateLabel: "Fecha de Inicio (Opcional)",
      expirationLabel: "Fecha de Expiración *",
      limitLabel: "Límite de Usos (Opcional)",
      statusLabel: "Estado"
    }
  }
};
