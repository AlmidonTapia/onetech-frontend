export const checkoutContent = {
  summaryTitle: "Tu pedido",
  totalLabel: "Total",
  labels: {
    subtotal: "Subtotal",
    discount: "Descuento",
    shipping: "Envío",
    couponPlaceholder: "Código de descuento"
  },
  steps: [
    "Destino",
    "Envío",
    "Datos de Entrega",
    "Pago",
    "Confirmar"
  ],
  alerts: {
    successTitle: "¡Pedido realizado!",
    successSub: "Orden #",
    successEnd: " confirmada.",
    error: "Error al procesar el pedido o sus servicios secundarios",
    invalidSession: "Sesión no válida o expirada. Por favor, inicia sesión de nuevo.",
    sdkNotLoaded: "El SDK de Mercado Pago no está cargado. Por favor, recarga la página.",
    sdkBlockedTitle: "SDK bloqueado o no cargado",
    sdkBlockedMsg: "No se pudo cargar el sistema de pago. Desactiva tu bloqueador de anuncios e intenta nuevamente.",
    emptyCartTitle: "Tu carrito está vacío",
    emptyCartMsg: "Agrega productos para proceder al pago.",
    brickErrorTitle: "Error del sistema de pago",
    brickError: "Ocurrió un error al cargar el formulario de pago.",
    paymentErrorTitle: "Error en el pago",
    paymentError: "Error al procesar el cargo con tu tarjeta.",
    initPaymentErrorTitle: "Error al inicializar el pago",
    initPaymentErrorMsg: "No se pudo cargar el formulario de pago seguro. Verifica tu conexión o intenta con otro método de pago.",
    orderErrorTitle: "Error al generar la orden",
    couponApplied: "Cupón aplicado",
    couponAppliedMsg: "Se ha aplicado el descuento a tu compra.",
    couponInvalid: "Cupón inválido o expirado.",
    paymentSuccessMsg: "Tu pago fue procesado con éxito. Orden #{id} confirmada.",
    reservationExpiredTitle: "Tiempo expirado",
    reservationExpiredMsg: "Tu reserva de stock ha expirado. Por favor, vuelve a intentar el pago."
  },
  timer: {
    timeLeft: "Tiempo restante para asegurar tu reserva: "
  },
  buttons: {
    back: "Atrás",
    continue: "Continuar",
    confirmAndPay: "Confirmar y Pagar",
    apply: "Aplicar"
  },
  aside: {
    deliveryAddress: "Dirección de Entrega",
    shippingAgency: "Agencia de Envío",
    receiver: "Quien Recibe",
    paymentMethod: "Método de Pago",
    myself: "Yo mismo"
  },
  securePayment: {
    title: "Pago Seguro con MercadoPago",
    description: "Tu información de pago está cifrada de extremo a extremo. Ingresa los datos de tu tarjeta para procesar el cargo de ",
    header: "Ingresa los datos de tu tarjeta"
  },
  consignee: {
    title: "Datos de Entrega",
    subtitle: "¿Quién recibirá el pedido?",
    selfLabel: "Yo mismo recibiré el pedido",
    selfFillLabel: "Tus datos para el envío",
    othersLabel: "Datos de la persona que recibirá el pedido",
    fullNameLabel: "Nombre completo",
    docNumberLabel: "Documento de Identidad (DNI/CE)",
    phoneLabel: "Número de Celular",
    disclaimerTitle: "Importante para el envío:",
    disclaimerText: "Estos datos son exclusivamente para el envío y recojo por parte de la agencia, y son distintos a los datos del comprobante de pago.",
    policiesInfoPre: "Para garantizar una entrega exitosa, te invitamos a revisar nuestras",
    policiesInfoLink: "políticas de envío",
    policiesInfoPost: ". Asegúrate de que los datos ingresados sean correctos.",
    policiesAccept: "He leído y acepto las políticas de envío y condiciones de entrega."
  },
  destination: {
    title: "Selecciona tu Destino",
    subtitle: "Selecciona tu ciudad para ver qué agencias de envío tenemos disponibles.",
    deptLabel: "Departamento",
    provLabel: "Provincia",
    distLabel: "Distrito",
    deptPlaceholder: "Selecciona una región",
    provPlaceholder: "Selecciona una provincia",
    distPlaceholder: "Selecciona un distrito"
  },
  payment: {
    title: "Método de pago",
    couponTitle: "¿Tienes un código de descuento?",
    couponSuccess: "Cupón aplicado correctamente"
  },
  shipping: {
    title: "Método de envío",
    loading: "Cargando agencias disponibles...",
    noAvailable: "No hay métodos de envío disponibles para esta zona."
  },
  confirmReview: {
    title: "Revisa tu pedido antes de confirmar",
    descriptionPre: "Verifica los datos en el panel derecho. Si todo está correcto, haz clic en",
    descriptionPost: "."
  }
};
