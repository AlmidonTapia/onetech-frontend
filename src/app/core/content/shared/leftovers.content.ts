export const leftoversContent = {
  login: {
    brandData: {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
    title: 'Bienvenido de vuelta',
    description: 'Accede a tu cuenta y sigue comprando la tecnología que necesitas.',
    benefits: [
      { icon: 'pi pi-truck', title: 'Envío rápido', desc: 'Despacho en 24h a todo Lima' },
      { icon: 'pi pi-shield', title: 'Compra segura', desc: 'Pagos encriptados y protegidos' },
      { icon: 'pi pi-refresh', title: 'Devoluciones fáciles', desc: '30 días para cambios o reembolsos' },
      { icon: 'pi pi-star', title: '+5,000 productos', desc: 'Las mejores marcas del mercado' }
    ]
  },
    formData: {
    title: 'Iniciar sesión',
    registerText: '¿Aún no tienes cuenta?',
    registerLinkText: 'Regístrate aquí',
    registerRoute: '/auth/register',
    submitButtonLabel: 'Ingresar',
    googleButtonLabel: 'Continuar con Google',
    dividerText: 'O continuar con',
    forgotPasswordText: '¿Olvidaste tu contraseña?',
    forgotPasswordRoute: '/auth/forgot-password',
    errors: {
      required: 'Campo requerido',
      email: 'Ingresa un correo válido'
    }
  },
    fields: [
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'ejemplo@correo.com', icon: 'pi pi-envelope' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Ingresa tu contraseña' }
  ],
  },
  register: {
    brandData: {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
    title: 'Únete a OneTech',
    description: 'Crea tu cuenta y empieza a disfrutar de los mejores precios en tecnología para Lima.',
    stats: [
      { value: '+15,000', label: 'clientes felices' },
      { value: '+5,000', label: 'productos' },
      { value: '4.8★', label: 'valoración' }
    ],
    perks: [
      'Historial de compras y seguimiento',
      'Direcciones guardadas para pagar más rápido',
      'Lista de favoritos sincronizada',
      'Ofertas exclusivas para miembros',
      'Soporte prioritario por correo'
    ]
  },
    formData: {
    title: 'Crear cuenta',
    loginText: '¿Ya tienes cuenta?',
    loginLinkText: 'Inicia sesión aquí',
    loginRoute: '/auth/login',
    backToShopText: 'Volver a la tienda sin registrarme',
    submitButtonLabel: 'Crear mi cuenta',
    googleButtonLabel: 'Continuar con Google',
    dividerText: 'O continuar con',
    termsText: 'Acepto los',
    termsLink: 'Términos y condiciones',
    privacyText: 'y la',
    privacyLink: 'Política de privacidad',
    termsErrorMsg: 'Debes aceptar los términos para continuar',
    mismatchErrorMsg: 'Las contraseñas no coinciden',
    errors: {
      required: 'Campo requerido',
      email: 'Correo inválido',
      minLengthPre: 'Mínimo',
      minLengthPost: 'caracteres'
    },
    passwordFeedback: {
      prompt: 'Escribe una contraseña',
      weak: 'Débil',
      medium: 'Media',
      strong: 'Segura'
    }
  },
    fields: [
    { name: 'firstName', label: 'Nombre *', type: 'text', placeholder: 'Juan' },
    { name: 'lastName', label: 'Apellido *', type: 'text', placeholder: 'Pérez' },
    { name: 'email', label: 'Correo electrónico *', type: 'email', placeholder: 'tu@correo.com', icon: 'pi pi-envelope' },
    { name: 'password', label: 'Contraseña *', type: 'password', placeholder: 'Mínimo 8 caracteres', feedback: true }
  ],
  },
  forgotPassword: {
    brandData: {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
    title: 'Recupera tu acceso',
    description: 'No te preocupes, a todos nos pasa. Ingresa tu correo y te ayudaremos a restablecer tu contraseña para que sigas disfrutando de OneTech.'
  },
    formData: {
    title: 'Olvidé mi contraseña',
    description: 'Ingresa el correo electrónico asociado a tu cuenta.',
    submitButtonLabel: 'Enviar enlace de recuperación',
    backText: 'Volver al inicio de sesión',
    backRoute: '/auth/login',
    errors: {
      required: 'Campo requerido',
      email: 'Ingresa un correo válido'
    }
  },
  },
  resetPassword: {
    brandData: {
    logoText1: 'One',
    logoText2: 'Tech',
    logoRoute: '/',
    title: 'Nueva Contraseña',
    description: 'Estás a un paso de recuperar tu cuenta. Crea una contraseña segura para mantener tu información protegida.'
  },
    formData: {
    title: 'Crear nueva contraseña',
    description: 'Ingresa tu nueva contraseña a continuación.',
    submitButtonLabel: 'Restablecer contraseña',
    backText: 'Volver al inicio de sesión',
    backRoute: '/auth/login',
    mismatchErrorMsg: 'Las contraseñas no coinciden',
    errors: {
      required: 'Campo requerido',
      minLengthPre: 'Mínimo',
      minLengthPost: 'caracteres'
    },
    passwordFeedback: {
      prompt: 'Escribe una contraseña',
      weak: 'Débil',
      medium: 'Media',
      strong: 'Segura'
    }
  },
  },
  productImages: {
    imgAlt: 'Imagen del producto',
    viewAlt: 'Vista del producto',
    expandLabel: 'Ampliar imagen',
    zoomLabel: 'Zoom de producto'
  },
  productReviews: {
    title: 'Reseñas de clientes',
    writeReview: 'Escribir reseña',
    loading: 'Cargando reseñas...',
    empty: 'Aún no hay reseñas. ¡Sé el primero en opinar!'
  },
  wishlist: {
    title: 'Mis favoritos',
    emptyTitle: 'Tu lista de favoritos está vacía',
    emptyListBtn: 'Vaciar lista',
    loading: 'Cargando favoritos...',
    noFavorites: 'Sin favoritos todavía'
  },
  cookieConsent: {
    text: 'Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido. Al continuar navegando, acepta nuestro uso de cookies.',
    essential: 'Solo esenciales'
  },
  whatsapp: {
    label: 'Consultar por WhatsApp'
  },
  emptyState: {
    title: 'Sin resultados',
    desc: 'No hay datos para mostrar en este momento.'
  },
  formErrors: {
    unexpected: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
    verifyFields: 'Verifique los campos marcados en rojo.'
  }
};
