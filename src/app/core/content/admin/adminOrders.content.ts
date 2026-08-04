export const adminOrdersContent = {
  title: "Órdenes",
  countSuffix: "órdenes en total",
  alerts: {
    updateSuccess: "Estado actualizado correctamente",
    updateError: "Error al actualizar estado"
  },
  table: {
    allStatuses: "Todos",
    quickSearchTitle: "Búsqueda Rápida",
    searchPlaceholder: "ID de Orden, Cliente...",
    emptyMessage: "No hay órdenes registradas.",
    headers: {
      orderId: "ID Orden",
      client: "Cliente",
      date: "Fecha",
      total: "Total",
      status: "Estado",
      actions: "Acciones"
    },
    tooltips: {
      viewDetail: "Ver detalle",
      changeStatus: "Cambiar estado",
      automatedStatus: "Estado automatizado por pago/envío"
    }
  },
  form: {
    headerTitle: "Cambiar estado de orden",
    labels: {
      order: "Orden:",
      client: "Cliente:",
      total: "Total:",
      newStatus: "Nuevo estado *"
    },
    placeholderSelect: "Seleccionar estado",
    actions: {
      cancelLabel: "Cancelar",
      saveLabel: "Actualizar estado"
    }
  }
};
