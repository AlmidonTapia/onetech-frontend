export const ordersContent = {
  title: "Mis pedidos",
  subtitle: "Historial completo de tus compras en OneTech.",
  breadcrumbLabel: "Mis pedidos",
  loadingLabel: "Cargando pedidos...",
  errorLoadingTitle: "Error al cargar pedidos",
  errorLoadingMsg: "No se pudieron obtener tus pedidos. Verifica tu conexión e intenta de nuevo.",
  list: {
    orderPrefix: "Pedido #",
    productSuffixSingular: "producto",
    productSuffixPlural: "productos",
    actionBtnLabel: "Ver detalle",
    loadingLabel: "Cargando tus pedidos...",
    emptyTitle: "No tienes pedidos aún",
    emptyDescription: "Historial de compras vacío. Explora la tienda para comenzar."
  },
  status: {
    PENDIENTE: "Pendiente",
    PAGADO: "Pagado",
    ENVIADO: "Enviado",
    COMPLETADO: "Completado",
    CANCELADO: "Cancelado",
    EXPIRADO: "Expirado",
    expiredLabel: "Expirado"
  },
  shipmentSteps: {
    EN_PREPARACION: "Preparación",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado"
  },
  detail: {
    headerPrefix: "Pedido #",
    sections: {
      productsTitle: "Productos",
      infoTitle: "Información del pedido",
      shipmentTitle: "Seguimiento de envío"
    },
    totals: {
      subtotalLabel: "Subtotal",
      grandTotalLabel: "Total pagado",
      unitSuffix: " c/u"
    },
    labels: {
      client: "Cliente",
      orderId: "ID de orden",
      trackingNumber: "Código de seguimiento",
      estimatedArrival: "Fecha estimada de entrega",
      noShipment: "El envío se encuentra en preparación. El código de seguimiento estará disponible pronto.",
      loadingShipment: "Cargando información de envío...",
      discount: "Descuento",
      shipping: "Envío",
      expiresIn: "Vence en: ",
      pickupCode: "Código de Recojo"
    },
    actions: {
      closeLabel: "Cerrar"
    }
  },
  modal: {
    title: "Detalle de Orden",
    summary: {
      date: "Fecha",
      totalPaid: "Total Pagado",
      status: "Estado de Pago"
    },
    destination: {
      title: "Destino y Consignatario",
      location: "Ubicación:",
      method: "Método:",
      agency: "Agencia:",
      pickupAgency: "Recojo en Agencia",
      homeDelivery: "Envío a Domicilio",
      receiver: "Recibe:",
      document: "Documento:",
      phone: "Teléfono:",
      notRegistered: "No registrado"
    },
    invoice: {
      title: "Boleta de Compra",
      invoicePrefix: "Boleta",
      issuedOn: "Emitida el",
      downloadBtn: "Descargar",
      emptyState: "La boleta de compra aún no ha sido generada o no está disponible.",
      generateBtn: "Generar Boleta"
    },
    shipment: {
      title: "Seguimiento de Envío",
      tracking: "Tracking:",
      estimatedArrival: "Llegada estimada:",
      receiptImage: "Boleta de Envío / Guía",
      emptyState: "El envío aún no ha sido programado.",
      statuses: {
        pending: "Pendiente",
        dispatched: "Despachado",
        inTransit: "En camino",
        delivered: "Entregado",
        returned: "Devuelto"
      }
    },
    products: {
      title: "Productos",
      defaultName: "Producto",
      unitSuffix: " unidades"
    }
  }
};
