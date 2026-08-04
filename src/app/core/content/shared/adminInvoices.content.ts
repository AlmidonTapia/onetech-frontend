export const adminInvoicesContent = {
  title: "Comprobantes de Pago",
  badgeSuffix: " boletas en total",
  table: {
    emptyMessage: "No hay comprobantes registrados.",
    headers: {
      invoiceNumber: "Nro Comprobante",
      orderId: "ID Orden",
      client: "Cliente / Correo",
      date: "Fecha de Emisión",
      total: "Monto Total",
      status: "Estado",
      actions: "Acciones"
    },
    tooltips: {
      download: "Descargar PDF",
      sendEmail: "Reenviar Correo",
      annul: "Anular Boleta"
    },
    icons: {
      download: "pi pi-download",
      sendEmail: "pi pi-envelope",
      annul: "pi pi-times-circle"
    },
    status: {
      issued: "Emitido",
      annulled: "Anulado"
    }
  },
  actions: {
    sendEmail: {
      title: "¿Reenviar comprobante por correo?",
      message: "Se reenviará la boleta {invoiceNumber} al correo registrado.",
      confirmLabel: "Sí, enviar"
    },
    annul: {
      title: "¿Anular comprobante de pago?",
      message: "La boleta {invoiceNumber} será anulada permanentemente.",
      confirmLabel: "Sí, anular"
    }
  },
  alerts: {
    pdfError: "El enlace al PDF no está disponible.",
    emailSuccess: "Correo enviado exitosamente.",
    emailError: "Error al enviar correo.",
    annulSuccess: "Comprobante anulado exitosamente.",
    annulError: "Error al anular comprobante."
  }
};
