export const adminInventoryContent = {
  title: "Inventario",
  countSuffix: "movimientos registrados",
  createBtnLabel: "Registrar movimiento",
  alerts: {
    success: "Movimiento registrado correctamente",
    error: "Error al registrar movimiento",
    cancelSuccess: "Movimiento de inventario anulado correctamente",
    cancelError: "Error al anular el movimiento de inventario"
  },
  confirmModal: {
    title: "¿Anular movimiento?",
    message: "Esta acción anulará el movimiento seleccionado y revertirá el stock afectado del producto de forma permanente.",
    confirmLabel: "Sí, anular"
  },
  table: {
    quickSearchTitle: "Búsqueda Rápida",
    searchPlaceholder: "Buscar en inventario...",
    emptyMessage: "No hay movimientos registrados.",
    headers: {
      product: "Producto",
      type: "Tipo",
      quantity: "Cantidad",
      reason: "Motivo",
      date: "Fecha",
      status: "Estado",
      actions: "Acciones"
    },
    types: {
      all: "Todos los tipos",
      in: "Entrada (IN)",
      out: "Salida (OUT)"
    },
    labels: {
      inText: "Entrada",
      outText: "Salida",
      enabledText: "Habilitado",
      canceledText: "Anulado"
    }
  },
  form: {
    headerTitle: "Registrar movimiento de inventario",
    errorRequired: "El motivo es requerido",
    fields: {
      product: "Producto *",
      type: "Tipo de movimiento *",
      quantity: "Cantidad *",
      reason: "Motivo *",
      reasonPlaceholder: "Ej: Compra de proveedor, Venta, Ajuste...",
      productPlaceholder: "Seleccionar producto",
      searchPlaceholder: "Buscar...",
      errorMinQuantity: "Cantidad mínima es 1"
    },
    actions: {
      cancelLabel: "Cancelar",
      saveLabel: "Registrar movimiento"
    }
  }
};
