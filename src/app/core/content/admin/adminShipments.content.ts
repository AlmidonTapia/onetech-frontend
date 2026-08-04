export const adminShipmentsContent = {
  title: "Envíos",
  countSuffix: "envíos registrados",
  createBtnLabel: "Nuevo envío",
  alerts: {
    createSuccess: "Envío creado exitosamente",
    createError: "Error al crear el envío",
    dispatchSuccess: "Envío despachado exitosamente",
    dispatchError: "Error al despachar el envío",
    updateSuccess: "Estado actualizado",
    updateError: "Error al actualizar el estado"
  },
  table: {
    quickSearchTitle: "Búsqueda Rápida",
    searchPlaceholder: "Tracking o ID...",
    emptyMessage: "No hay envíos registrados.",
    headers: {
      orderId: "ID Pedido",
      method: "Método",
      tracking: "Tracking",
      cost: "Costo",
      shippedAt: "Fecha Envío",
      arrival: "Llegada Estimada",
      status: "Estado",
      actions: "Acciones"
    }
  },
  form: {
    titleNew: "Nuevo Envío",
    titleDispatch: "Despachar Envío",
    titleView: "Detalles del Envío",
    errorRequired: "Campo requerido",
    errorImageRequired: "Debe seleccionar una imagen.",
    errorImageFormat: "Solo se permiten imágenes (JPG, PNG, WEBP).",
    errorImageSize: "La imagen no debe pesar más de 5MB.",
    fields: {
      orderId: "ID del Pedido *",
      orderIdPlaceholder: "Ej: ord_123",
      method: "Método de Envío *",
      methodPlaceholder: "Seleccione método",
      cost: "Costo (S/.) *",
      estimatedArrival: "Llegada Estimada *",
      trackingNumber: "Tracking Number *",
      trackingPlaceholder: "Ej: TRK-987",
      pickupCode: "Código de Recojo *",
      pickupCodePlaceholder: "Ej: REC-123",
      shippedAt: "Fecha y Hora de Envío *",
      receiptImage: "Foto Boleta de Envío *"
    },
    details: {
      status: "Estado:",
      orderId: "ID Orden:",
      trackingNumber: "Tracking Number:",
      pickupCode: "Código de Recojo:",
      shippedAt: "Fecha de Envío:",
      estimatedArrival: "Llegada Estimada:",
      actualArrival: "Llegada Real:",
      receiptImage: "Boleta de Envío:",
      viewReceipt: "Ver Boleta",
      unknownMethod: "Desconocido"
    },
    actions: {
      cancelLabel: "Cerrar",
      saveLabel: "Guardar",
      dispatchLabel: "Despachar",
      deliveredLabel: "Marcar Entregado",
      returnedLabel: "Marcar Devuelto",
      pendingReturn: "Devolución Pendiente",
      receiveWarehouse: "Recibir en Almacén"
    },
    statusConfig: {
      inPreparation: {
        label: "En Preparación",
        tooltip: "Despachar Envío"
      },
      onTheWay: {
        label: "En Camino",
        tooltip: "Gestionar Entrega"
      },
      delivered: {
        label: "Entregado",
        tooltip: "Ver Detalles"
      },
      pendingReturn: {
        label: "Dev. Pendiente",
        tooltip: "Recibir en Almacén"
      },
      returned: {
        label: "Devuelto",
        tooltip: "Ver Detalles"
      }
    }
  }
};
