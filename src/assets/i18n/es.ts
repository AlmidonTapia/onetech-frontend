export const es = {
  checkout: {
    summaryTitle: 'Tu pedido',
    totalLabel: 'Total',
    labels: {
      subtotal: 'Subtotal',
      discount: 'Descuento',
      shipping: 'Envío',
      couponPlaceholder: 'Código de descuento'
    },
    steps: ['Destino', 'Envío', 'Datos de Entrega', 'Pago', 'Confirmar'],
    alerts: {
      successTitle: '¡Pedido realizado!',
      successSub: 'Orden #',
      successEnd: ' confirmada.',
      error: 'Error al procesar el pedido o sus servicios secundarios',
      invalidSession: 'Sesión no válida o expirada. Por favor, inicia sesión de nuevo.',
      sdkNotLoaded: 'El SDK de Mercado Pago no está cargado. Por favor, recarga la página.',
      sdkBlockedTitle: 'SDK bloqueado o no cargado',
      sdkBlockedMsg: 'No se pudo cargar el sistema de pago. Desactiva tu bloqueador de anuncios e intenta nuevamente.',
      emptyCartTitle: 'Tu carrito está vacío',
      emptyCartMsg: 'Agrega productos para proceder al pago.',
      brickErrorTitle: 'Error del sistema de pago',
      brickError: 'Ocurrió un error al cargar el formulario de pago.',
      paymentErrorTitle: 'Error en el pago',
      paymentError: 'Error al procesar el cargo con tu tarjeta.',
      initPaymentErrorTitle: 'Error al inicializar el pago',
      initPaymentErrorMsg: 'No se pudo cargar el formulario de pago seguro. Verifica tu conexión o intenta con otro método de pago.',
      orderErrorTitle: 'Error al generar la orden',
      couponApplied: 'Cupón aplicado',
      couponAppliedMsg: 'Se ha aplicado el descuento a tu compra.',
      couponInvalid: 'Cupón inválido o expirado.',
      paymentSuccessMsg: 'Tu pago fue procesado con éxito. Orden #{id} confirmada.'
    },
    buttons: {
      back: 'Atrás',
      continue: 'Continuar',
      confirmAndPay: 'Confirmar y Pagar',
      apply: 'Aplicar'
    },
    aside: {
      deliveryAddress: 'Dirección de Entrega',
      shippingAgency: 'Agencia de Envío',
      receiver: 'Quien Recibe',
      paymentMethod: 'Método de Pago',
      myself: 'Yo mismo'
    },
    securePayment: {
      title: 'Pago Seguro con MercadoPago',
      description: 'Tu información de pago está cifrada de extremo a extremo. Ingresa los datos de tu tarjeta para procesar el cargo de ',
      header: 'Ingresa los datos de tu tarjeta'
    },
    consignee: {
      title: 'Datos de Entrega',
      subtitle: '¿Quién recibirá el pedido?',
      selfLabel: 'Yo mismo recibiré el pedido',
      selfFillLabel: 'Tus datos para el envío',
      othersLabel: 'Datos de la persona que recibirá el pedido',
      fullNameLabel: 'Nombre completo',
      docNumberLabel: 'Documento de Identidad (DNI/CE)',
      phoneLabel: 'Número de Celular',
      disclaimerTitle: 'Importante para el envío:',
      disclaimerText: 'Estos datos son exclusivamente para el envío y recojo por parte de la agencia, y son distintos a los datos del comprobante de pago.',
      policiesInfoPre: 'Para garantizar una entrega exitosa, te invitamos a revisar nuestras',
      policiesInfoLink: 'políticas de envío',
      policiesInfoPost: '. Asegúrate de que los datos ingresados sean correctos.',
      policiesAccept: 'He leído y acepto las políticas de envío y condiciones de entrega.'
    },
    destination: {
      title: 'Selecciona tu Destino',
      subtitle: 'Selecciona tu ciudad para ver qué agencias de envío tenemos disponibles.',
      deptLabel: 'Departamento',
      provLabel: 'Provincia',
      distLabel: 'Distrito',
      deptPlaceholder: 'Selecciona una región',
      provPlaceholder: 'Selecciona una provincia',
      distPlaceholder: 'Selecciona un distrito'
    },
    payment: {
      title: 'Método de pago',
      couponTitle: '¿Tienes un código de descuento?',
      couponSuccess: 'Cupón aplicado correctamente'
    },
    shipping: {
      title: 'Método de envío',
      loading: 'Cargando agencias disponibles...',
      noAvailable: 'No hay métodos de envío disponibles para esta zona.'
    },
    confirmReview: {
      title: 'Revisa tu pedido antes de confirmar',
      descriptionPre: 'Verifica los datos en el panel derecho. Si todo está correcto, haz clic en',
      descriptionPost: '.'
    }
  },
  cart: {
    title: 'Mi carrito',
    breadcrumbLabel: 'Carrito de compras',
    loadingLabel: 'Cargando carrito...',
    emptyTitle: 'Tu carrito está vacío',
    emptyDescription: 'Agrega productos para empezar tu compra.',
    exploreBtnLabel: 'Explorar productos',
    alertRemoved: 'Producto eliminado del carrito',
    alertRemoveError: 'Error al eliminar',
    alertUpdateError: 'Error al actualizar cantidad',
    items: {
      each: 'c/u',
      remove: 'Eliminar'
    },
    summary: {
      title: 'Resumen del pedido',
      subtotalLabel: 'Subtotal',
      singularProduct: 'producto',
      pluralProduct: 'productos',
      shippingLabel: 'Envío',
      calculatingLabel: 'Por calcular',
      totalLabel: 'Total',
      checkoutBtnLabel: 'Proceder al pago',
      continueShoppingText: 'Seguir comprando',
      paymentMethodsTitle: 'Aceptamos:'
    }
  },
  catalog: {
    breadcrumbLabel: 'Catálogo',
    seoTitle: 'Catálogo de Productos',
    seoDescription: 'Explora nuestra amplia variedad de productos tecnológicos. Laptops, componentes de PC, smartphones y más.',
    mobileFilterBtn: 'Filtros',
    mobileDrawerTitle: 'Filtros',
    filters: {
      mainTitle: 'Filtros',
      resetBtnText: 'Limpiar',
      categoryTitle: 'Categorías',
      allCategoriesOption: 'Todas las categorías',
      brandTitle: 'Marcas',
      allBrandsOption: 'Todas',
      priceTitle: 'Precio (S/)',
      minPricePlaceholder: 'Mín',
      maxPricePlaceholder: 'Máx',
      applyBtnLabel: 'Aplicar filtros'
    },
    sort: {
      resultsSuffix: 'productos encontrados',
      sortLabelText: 'Ordenar por:',
      options: {
        relevance: 'Relevancia',
        price_asc: 'Precio: menor a mayor',
        price_desc: 'Precio: mayor a menor',
        name_asc: 'Nombre A-Z',
        newest: 'Más nuevos primero'
      }
    },
    grid: {
      emptyTitle: 'Sin resultados',
      emptyDescription: 'Prueba con otros filtros o términos de búsqueda.'
    }
  },
  orders: {
    title: 'Mis pedidos',
    subtitle: 'Historial completo de tus compras en OneTech.',
    breadcrumbLabel: 'Mis pedidos',
    loadingLabel: 'Cargando pedidos...',
    errorLoadingTitle: 'Error al cargar pedidos',
    errorLoadingMsg: 'No se pudieron obtener tus pedidos. Verifica tu conexión e intenta de nuevo.',
    list: {
      orderPrefix: 'Pedido #',
      productSuffixSingular: 'producto',
      productSuffixPlural: 'productos',
      actionBtnLabel: 'Ver detalle',
      loadingLabel: 'Cargando tus pedidos...',
      emptyTitle: 'No tienes pedidos aún',
      emptyDescription: 'Historial de compras vacío. Explora la tienda para comenzar.',
    },
    status: {
      PENDIENTE: 'Pendiente',
      PAGADO: 'Pagado',
      ENVIADO: 'Enviado',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado',
      EXPIRADO: 'Expirado',
      expiredLabel: 'Expirado'
    },
    shipmentSteps: {
      EN_PREPARACION: 'Preparación',
      EN_CAMINO: 'En camino',
      ENTREGADO: 'Entregado'
    },
    detail: {
      headerPrefix: 'Pedido #',
      sections: {
        productsTitle: 'Productos',
        infoTitle: 'Información del pedido',
        shipmentTitle: 'Seguimiento de envío'
      },
      totals: {
        subtotalLabel: 'Subtotal',
        grandTotalLabel: 'Total pagado',
        unitSuffix: ' c/u'
      },
      labels: {
        client: 'Cliente',
        orderId: 'ID de orden',
        trackingNumber: 'Código de seguimiento',
        estimatedArrival: 'Fecha estimada de entrega',
        noShipment: 'El envío se encuentra en preparación. El código de seguimiento estará disponible pronto.',
        loadingShipment: 'Cargando información de envío...',
        discount: 'Descuento',
        shipping: 'Envío',
        expiresIn: 'Vence en: ',
        pickupCode: 'Código de Recojo'
      },
      actions: {
        closeLabel: 'Cerrar'
      }
    }
  },
  navbar: {
    ariaLabelLogo: 'OneTech — Inicio',
    ariaLabelNav: 'Categorías',
    topbar: {
      shipping: 'Envíos a nivel nacional',
      phone: 'Teléfono de contacto',
      hours: 'Horarios de atención'
    },
    admin: {
      labelPre: 'Panel de',
      labelPost: 'Administración'
    },
    wishlist: {
      title: 'Mis favoritos',
      labelPre: 'Lista de',
      labelPost: 'Favoritos'
    },
    cart: {
      ariaLabelCart: 'Ver carrito',
      labelText: 'Carrito',
      emptyTitle: 'Tu carrito está vacío',
      goToCartBtn: 'Ver carrito completo',
      checkoutBtn: 'Ir a pagar',
      totalLabel: 'Total:'
    },
    menu: {
      ariaLabelNav: 'Navegación por categorías',
      allCategoriesLabel: 'Todas las categorías',
      offersLabel: '⚡ Ofertas',
      aboutLabel: 'Sobre nosotros',
      aboutItems: {
        whoWeAre: 'Quiénes somos',
        faq: 'Preguntas frecuentes',
        terms: 'Términos y condiciones',
        privacy: 'Políticas de privacidad',
        contact: 'Contacto'
      }
    },
    search: {
      placeholderText: 'Buscar laptops, monitores, componentes...',
      ariaLabelInput: 'Buscar productos',
      ariaLabelButton: 'Buscar',
      searching: 'Buscando...',
      viewAllResults: 'Ver todos los resultados para',
      noResults: 'No se encontraron resultados para'
    },
    user: {
      guestLabel: 'Bienvenido',
      guestName: 'Inicia sesión',
      userLabel: 'MI CUENTA',
      userDefaultName: 'Usuario',
      menu: {
        profile: 'Mi perfil',
        orders: 'Mis compras',
        wishlist: 'Favoritos'
      },
      viewProfile: 'ver mis datos',
      logout: 'Cerrar sesión'
    }
  },
  footer: {
    tagline: 'Tu tienda de tecnología de confianza. Los mejores productos a los mejores precios.',
    headings: {
      help: 'Ayuda',
      contact: 'Contacto'
    },
    copyPre: '© ',
    copyPost: ' OneTech. Todos los derechos reservados.',
    contact: {
      loading: 'Cargando...',
      unavailable: 'No disponible',
      hours: 'Lunes a Sábado: 9:00 AM - 6:00 PM'
    }
  },
  adminLayout: {
    sidebar: {
      ariaLabelNav: 'Menú admin',
      ariaLabelExpand: 'Expandir menú',
      ariaLabelCollapse: 'Colapsar menú',
      logoCollapsed: 'OT'
    },
    topbar: {
      searchPlaceholder: 'Ingrese el módulo...',
      searchAriaLabel: 'Buscar',
      profileRole: 'Administrador',
      logout: 'Cerrar Sesión'
    },
    navItems: {
      dashboard: 'Dashboard',
      products: 'Productos',
      categories: 'Categorías',
      brands: 'Marcas',
      inventory: 'Inventario',
      coupons: 'Cupones',
      orders: 'Órdenes',
      shipments: 'Envíos',
      shipping: 'Logística / Envíos',
      paymentMethods: 'Métodos Pago',
      invoices: 'Comprobantes',
      users: 'Usuarios',
      reviews: 'Reseñas',
      inbox: 'Bandeja Entrada',
      settings: 'Configuración',
      profile: 'Mi Perfil'
    }
  },
  adminDashboard: {
    title: 'Dashboard',
    subtitle: 'Resumen general del negocio',
    loadingLabel: 'Cargando datos...',
    stats: {
      productsTitle: 'Productos',
      productsSuffix: 'registrados',
      ordersTitle: 'Órdenes',
      ordersSuffix: 'en total',
      usersTitle: 'Usuarios',
      usersSuffix: 'registrados',
      pendingTitle: 'Pendientes',
      pendingSuffix: 'por procesar'
    },
    chart: {
      title: 'Órdenes por estado',
      subtitle: 'últimas 10 órdenes',
      emptyMessage: 'Sin datos disponibles',
      labels: {
        pending: 'Pendiente',
        paid: 'Pagado',
        shipped: 'Enviado',
        completed: 'Completado',
        cancelled: 'Cancelado'
      }
    },
    recentOrders: {
      title: 'Órdenes recientes',
      viewAllLabel: 'Ver todas →',
      emptyMessage: 'No hay órdenes recientes.'
    }
  },
  adminProducts: {
    title: 'Productos',
    countSuffix: 'productos registrados',
    createBtnLabel: 'Nuevo producto',
    searchPlaceholder: 'Buscar por nombre o SKU...',
    refreshBtnLabel: 'Actualizar',
    alerts: {
      createSuccess: 'Producto creado',
      updateSuccess: 'Producto actualizado',
      saveError: 'Error al guardar',
      deleteSuccess: 'Producto eliminado',
      deleteError: 'Error al eliminar',
      imageUploadSuccess: 'Imágenes subidas con éxito',
      imageUploadError: 'Error al subir imágenes',
      imageDeleteSuccess: 'Imagen eliminada',
      imageDeleteError: 'Error al eliminar la imagen',
      imageMainSuccess: 'Imagen establecida como principal',
      imageMainError: 'Error al establecer la imagen principal'
    },
    confirmModal: {
      title: '¿Eliminar producto?',
      confirmLabel: 'Sí, eliminar',
      messageText: 'será eliminado permanentemente.'
    },
    table: {
      allStatuses: 'Todos los estados',
      allCategories: 'Todas las categorías',
      allBrands: 'Todas las marcas',
      quickSearchTitle: 'Catálogo de Productos',
      searchPlaceholder: 'Buscar producto...',
      emptyMessage: 'No se encontraron productos.',
      headers: {
        img: 'Img',
        product: 'Producto',
        sku: 'SKU',
        category: 'Categoría',
        brand: 'Marca',
        price: 'Precio',
        stock: 'Stock',
        status: 'Estado',
        actions: 'Acciones'
      },
      tooltips: {
        images: 'Imágenes',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      deleteLabel: 'Eliminar',
      status: {
        active: 'Activo',
        inactive: 'Inactivo',
        outOfStock: 'Agotado'
      }
    },
    form: {
      titleNew: 'Nuevo Producto',
      titleEdit: 'Editar Producto',
      errorRequired: 'Campo requerido',
      metaLabel: 'Última modificación:',
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar',
      specs: {
        title: 'Especificaciones Técnicas',
        addLabel: 'Añadir Propiedad',
        keyPlaceholder: 'Propiedad (Ej: RAM, Procesador)',
        valuePlaceholder: 'Valor (Ej: 16GB, Intel i7)',
        deleteTitle: 'Eliminar propiedad',
        emptyMessage: 'No hay especificaciones añadidas para este producto.'
      },
      imagesInfo: {
        newProductMsg: 'Podrá subir imágenes una vez que guarde el producto por primera vez.',
        manageBtnLabel: 'Gestionar Imágenes'
      },
      badges: {
        none: 'Ninguno',
        new: 'Nuevo',
        bestseller: 'Más vendido',
        offer: 'Oferta'
      },
      fields: {
        name: 'Nombre del producto *',
        namePlaceholder: 'Ej: Laptop Asus ROG',
        sku: 'SKU *',
        skuPlaceholder: 'Ej: LAP-ASUS-01',
        category: 'Categoría *',
        categoryPlaceholder: 'Seleccionar categoría',
        brand: 'Marca *',
        brandPlaceholder: 'Seleccionar marca',
        price: 'Precio (S/.) *',
        originalPrice: 'Precio Original (Opcional)',
        stock: 'Stock Inicial *',
        status: 'Estado *',
        statusPlaceholder: 'Seleccionar estado',
        badge: 'Insignia',
        badgePlaceholder: 'Sin insignia',
        description: 'Descripción del producto *',
        descriptionPlaceholder: 'Ingresa las especificaciones y características principales...'
      }
    },
    images: {
      headerPrefix: 'Imágenes — ',
      altText: 'Imagen del producto',
      mainBadgeLabel: 'Principal',
      emptyMessage: 'Sin imágenes. Sube la primera imagen abajo.',
      uploadedImages: 'Imágenes cargadas',
      setMainTooltip: 'Establecer como principal',
      deleteTooltip: 'Eliminar imagen',
      uploadNewTitle: 'Subir nuevas imágenes',
      upload: {
        chooseLabel: 'Elegir imágenes',
        uploadLabel: 'Subir',
        cancelLabel: 'Limpiar',
        note: 'Soporta múltiples archivos. Límite de 5 imágenes en total. Tamaño máx: 10MB.'
      },
      closeLabel: 'Cerrar'
    }
  },
  adminOrders: {
    title: 'Órdenes',
    countSuffix: 'órdenes en total',
    alerts: {
      updateSuccess: 'Estado actualizado correctamente',
      updateError: 'Error al actualizar estado'
    },
    table: {
      allStatuses: 'Todos',
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'ID de Orden, Cliente...',
      emptyMessage: 'No hay órdenes registradas.',
      headers: {
        orderId: 'ID Orden',
        client: 'Cliente',
        date: 'Fecha',
        total: 'Total',
        status: 'Estado',
        actions: 'Acciones'
      },
      tooltips: {
        viewDetail: 'Ver detalle',
        changeStatus: 'Cambiar estado',
        automatedStatus: 'Estado automatizado por pago/envío'
      }
    },
    form: {
      headerTitle: 'Cambiar estado de orden',
      labels: {
        order: 'Orden:',
        client: 'Cliente:',
        total: 'Total:',
        newStatus: 'Nuevo estado *'
      },
      placeholderSelect: 'Seleccionar estado',
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Actualizar estado'
      }
    }
  },
  adminCategories: {
    title: 'Categorías',
    countSuffix: 'categorías registradas',
    createBtnLabel: 'Nueva categoría',
    alerts: {
      saveSuccess: 'Categoría guardada',
      saveError: 'Error al guardar',
      deleteSuccess: 'Categoría eliminada exitosamente',
      deleteError: 'Error al eliminar la categoría'
    },
    confirmModal: {
      title: '¿Eliminar categoría?',
      confirmLabel: 'Sí, eliminar',
      messageText: 'será eliminada.'
    },
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar categorías...',
      emptyMessage: 'No hay categorías registradas.',
      headers: {
        name: 'Nombre',
        parent: 'Categoría padre',
        actions: 'Acciones'
      },
      rootCategoryLabel: 'Categoría raíz',
      tooltips: {
        edit: 'Editar',
        delete: 'Eliminar'
      }
    },
    form: {
      titleNew: 'Nueva Categoría',
      titleEdit: 'Editar Categoría',
      optionalText: '(opcional)',
      errorRequired: 'Campo requerido',
      status: {
        label: 'Estado',
        enabled: 'Habilitado',
        disabled: 'Deshabilitado'
      },
      fields: {
        name: 'Nombre *',
        namePlaceholder: 'Ej: Laptops & PCs',
        parent: 'Categoría padre',
        parentPlaceholder: 'Sin categoría padre'
      },
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Guardar'
      }
    }
  },
  adminBrands: {
    title: 'Marcas',
    countSuffix: 'marcas registradas',
    createBtnLabel: 'Nueva marca',
    alerts: {
      saveSuccess: 'Marca guardada',
      saveError: 'Error al guardar',
      deleteSuccess: 'Marca eliminada exitosamente',
      deleteError: 'Error al eliminar la marca',
      uploadError: 'Marca guardada, pero ocurrió un error al subir la imagen'
    },
    confirmModal: {
      title: '¿Eliminar marca?',
      confirmLabel: 'Sí, eliminar',
      messageText: 'será eliminada.'
    },
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar marcas...',
      emptyMessage: 'No hay marcas registradas.',
      headers: {
        brand: 'Marca',
        actions: 'Acciones'
      },
      tooltips: {
        edit: 'Editar',
        delete: 'Eliminar'
      }
    },
    form: {
      titleNew: 'Nueva Marca',
      titleEdit: 'Editar Marca',
      errorRequired: 'Campo requerido',
      status: {
        label: 'Estado',
        enabled: 'Habilitado',
        disabled: 'Deshabilitado'
      },
      fields: {
        name: 'Nombre de la marca *',
        namePlaceholder: 'Ej: HP, Lenovo, Samsung'
      },
      image: {
        label: 'Imagen de la marca',
        changeText: 'Cambiar imagen',
        selectText: 'Seleccionar imagen'
      },
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Guardar'
      }
    }
  },
  adminInventory: {
    title: 'Inventario',
    countSuffix: 'movimientos registrados',
    createBtnLabel: 'Registrar movimiento',
    alerts: {
      success: 'Movimiento registrado correctamente',
      error: 'Error al registrar movimiento',
      cancelSuccess: 'Movimiento de inventario anulado correctamente',
      cancelError: 'Error al anular el movimiento de inventario'
    },
    confirmModal: {
      title: '¿Anular movimiento?',
      message: 'Esta acción anulará el movimiento seleccionado y revertirá el stock afectado del producto de forma permanente.',
      confirmLabel: 'Sí, anular'
    },
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar en inventario...',
      emptyMessage: 'No hay movimientos registrados.',
      headers: {
        product: 'Producto',
        type: 'Tipo',
        quantity: 'Cantidad',
        reason: 'Motivo',
        date: 'Fecha',
        status: 'Estado',
        actions: 'Acciones'
      },
      types: {
        all: 'Todos los tipos',
        in: 'Entrada (IN)',
        out: 'Salida (OUT)'
      },
      labels: {
        inText: 'Entrada',
        outText: 'Salida',
        enabledText: 'Habilitado',
        canceledText: 'Anulado'
      }
    },
    form: {
      headerTitle: 'Registrar movimiento de inventario',
      errorRequired: 'El motivo es requerido',
      fields: {
        product: 'Producto *',
        type: 'Tipo de movimiento *',
        quantity: 'Cantidad *',
        reason: 'Motivo *',
        reasonPlaceholder: 'Ej: Compra de proveedor, Venta, Ajuste...',
        productPlaceholder: 'Seleccionar producto',
        searchPlaceholder: 'Buscar...',
        errorMinQuantity: 'Cantidad mínima es 1'
      },
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Registrar movimiento'
      }
    }
  },
  adminShipments: {
    title: 'Envíos',
    countSuffix: 'envíos registrados',
    createBtnLabel: 'Nuevo envío',
    alerts: {
      createSuccess: 'Envío creado exitosamente',
      createError: 'Error al crear el envío',
      dispatchSuccess: 'Envío despachado exitosamente',
      dispatchError: 'Error al despachar el envío',
      updateSuccess: 'Estado actualizado',
      updateError: 'Error al actualizar el estado'
    },
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Tracking o ID...',
      emptyMessage: 'No hay envíos registrados.',
      headers: {
        orderId: 'ID Pedido',
        method: 'Método',
        tracking: 'Tracking',
        cost: 'Costo',
        shippedAt: 'Fecha Envío',
        arrival: 'Llegada Estimada',
        status: 'Estado',
        actions: 'Acciones'
      }
    },
    form: {
      titleNew: 'Nuevo Envío',
      titleDispatch: 'Despachar Envío',
      titleView: 'Detalles del Envío',
      errorRequired: 'Campo requerido',
      errorImageRequired: 'Debe seleccionar una imagen.',
      errorImageFormat: 'Solo se permiten imágenes (JPG, PNG, WEBP).',
      errorImageSize: 'La imagen no debe pesar más de 5MB.',
      fields: {
        orderId: 'ID del Pedido *',
        orderIdPlaceholder: 'Ej: ord_123',
        method: 'Método de Envío *',
        methodPlaceholder: 'Seleccione método',
        cost: 'Costo (S/.) *',
        estimatedArrival: 'Llegada Estimada *',
        trackingNumber: 'Tracking Number *',
        trackingPlaceholder: 'Ej: TRK-987',
        pickupCode: 'Código de Recojo *',
        pickupCodePlaceholder: 'Ej: REC-123',
        shippedAt: 'Fecha y Hora de Envío *',
        receiptImage: 'Foto Boleta de Envío *'
      },
      details: {
        status: 'Estado:',
        orderId: 'ID Orden:',
        trackingNumber: 'Tracking Number:',
        pickupCode: 'Código de Recojo:',
        shippedAt: 'Fecha de Envío:',
        estimatedArrival: 'Llegada Estimada:',
        actualArrival: 'Llegada Real:',
        receiptImage: 'Boleta de Envío:',
        viewReceipt: 'Ver Boleta',
        unknownMethod: 'Desconocido'
      },
      actions: {
        cancelLabel: 'Cerrar',
        saveLabel: 'Guardar',
        dispatchLabel: 'Despachar',
        deliveredLabel: 'Marcar Entregado',
        returnedLabel: 'Marcar Devuelto',
        pendingReturn: 'Devolución Pendiente',
        receiveWarehouse: 'Recibir en Almacén'
      },
      statusConfig: {
        inPreparation: { label: 'En Preparación', tooltip: 'Despachar Envío' },
        onTheWay: { label: 'En Camino', tooltip: 'Gestionar Entrega' },
        delivered: { label: 'Entregado', tooltip: 'Ver Detalles' },
        pendingReturn: { label: 'Dev. Pendiente', tooltip: 'Recibir en Almacén' },
        returned: { label: 'Devuelto', tooltip: 'Ver Detalles' }
      }
    }
  },
  adminUsers: {
    title: 'Usuarios',
    countSuffix: 'usuarios registrados',
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Nombre, email, DNI...',
      emptyMessage: 'No hay usuarios registrados.',
      notRegisteredLabel: 'No registrado',
      headers: {
        fullName: 'Nombre Completo',
        email: 'Email',
        role: 'Rol',
        status: 'Estado',
        phone: 'Teléfono',
        regDate: 'Fecha Registro'
      },
      roles: {
        all: 'Todos los roles',
        admin: 'Admin',
        client: 'Cliente'
      },
      statuses: {
        all: 'Todos los estados',
        enabled: 'Habilitado',
        disabled: 'Deshabilitado'
      }
    }
  },
  adminCoupons: {
    title: 'Cupones',
    countSuffix: 'cupones registrados',
    createBtnLabel: 'Nuevo Cupón',
    alerts: {
      createSuccess: 'Cupón creado',
      updateSuccess: 'Cupón actualizado',
      saveError: 'Error al guardar cupón',
      deleteSuccess: 'Cupón eliminado',
      deleteError: 'Error al eliminar cupón'
    },
    confirmModal: {
      title: '¿Eliminar cupón?',
      deleteMessage: 'El cupón "{code}" será eliminado permanentemente.',
      confirmLabel: 'Sí, eliminar'
    },
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Código del cupón...',
      emptyMessage: 'No se encontraron cupones.',
      headers: {
        code: 'Código',
        discountType: 'Tipo',
        discountValue: 'Valor',
        startDate: 'Inicio',
        expirationDate: 'Expiración',
        usageLimit: 'Límite de Uso',
        usedCount: 'Usado',
        active: 'Activo',
        actions: 'Acciones'
      },
      tooltips: {
        edit: 'Editar',
        delete: 'Eliminar'
      },
      types: {
        all: 'Todos los tipos',
        percentage: 'Porcentaje',
        fixed: 'Fijo',
        fixedLabel: 'Monto fijo'
      },
      statuses: {
        all: 'Todos los estados',
        active: 'Activo',
        inactive: 'Inactivo',
        exhausted: 'Agotado',
        expired: 'Expirado'
      },
      values: {
        immediate: 'Inmediato',
        noLimit: 'Sin límite'
      }
    },
    form: {
      titleNew: 'Nuevo Cupón',
      titleEdit: 'Editar Cupón',
      errorRequired: 'Campo requerido',
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Guardar Cupón'
      },
      fields: {
        codeLabel: 'Código del Cupón *',
        codePlaceholder: 'Ej: VERANO2026',
        typeLabel: 'Tipo de Descuento *',
        valueLabel: 'Valor de Descuento *',
        startDateLabel: 'Fecha de Inicio (Opcional)',
        expirationLabel: 'Fecha de Expiración *',
        limitLabel: 'Límite de Usos (Opcional)',
        statusLabel: 'Estado'
      }
    }
  },
  adminShipmentMethods: {
    title: 'Métodos de Envío',
    badgeSuffix: ' métodos',
    newBtnLabel: 'Nuevo Método',
    table: {
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar método...',
      headers: {
        name: 'Nombre del Método',
        price: 'Precio Base',
        status: 'Estado',
        actions: 'Acciones'
      },
      emptyMsg: 'No hay métodos de envío registrados.'
    },
    dialog: {
      createTitle: 'Nuevo Método de Envío',
      editTitle: 'Editar Método de Envío',
      fields: {
        name: 'Nombre del Método',
        namePlaceholder: 'Ej: Express',
        price: 'Precio Base (S/)',
        status: 'Estado',
        statusPlaceholder: 'Seleccione un estado'
      },
      actions: {
        cancel: 'Cancelar',
        save: 'Guardar'
      }
    },
    confirmDelete: {
      title: '¿Eliminar método de envío?',
      message: 'El método de envío "{name}" será eliminado de forma permanente.',
      confirmLabel: 'Sí, eliminar'
    },
    alerts: {
      saveSuccess: 'Método de envío guardado',
      saveError: 'Error al guardar método',
      deleteSuccess: 'Método de envío eliminado exitosamente',
      deleteError: 'Error al eliminar el método de envío'
    },
    statuses: {
      active: 'Activo',
      inactive: 'Inactivo'
    }
  },
  adminShipping: {
    title: 'Logística y Envíos',
    description: 'Gestiona las agencias de envío disponibles y configura las tarifas o cobertura por Ubigeo.',
    tabs: {
      agencies: 'Agencias / Métodos',
      rates: 'Cobertura y Tarifas',
      locations: 'Ubicaciones'
    },
    agencies: {
      title: 'Métodos de Envío',
      badgeSuffix: ' métodos',
      newBtnLabel: 'Nuevo Método',
      table: {
        quickSearchTitle: 'Búsqueda Rápida',
        searchPlaceholder: 'Buscar agencia...',
        headers: {
          name: 'Nombre del Método',
          price: 'Precio Base',
          status: 'Estado',
          actions: 'Acciones'
        },
        emptyMsg: 'No hay métodos de envío registrados.'
      },
      dialog: {
        createTitle: 'Nuevo Método de Envío',
        editTitle: 'Editar Método de Envío',
        fields: {
          name: 'Nombre del Método',
          namePlaceholder: 'Ej: Express',
          price: 'Precio Base (S/)',
          status: 'Estado',
          statusPlaceholder: 'Seleccione un estado'
        },
        actions: {
          cancel: 'Cancelar',
          save: 'Guardar'
        }
      },
      confirmDelete: {
        title: '¿Eliminar método de envío?',
        message: 'El método de envío "{name}" será eliminado de forma permanente.',
        confirmLabel: 'Sí, eliminar'
      },
      alerts: {
        saveSuccess: 'Método de envío guardado',
        saveError: 'Error al guardar método',
        deleteSuccess: 'Método de envío eliminado exitosamente',
        deleteError: 'Error al eliminar el método de envío'
      },
      statuses: {
        active: 'Activo',
        inactive: 'Inactivo'
      }
    },
    rates: {
      title: 'Tarifas de Envío',
      newRateBtn: 'Nueva Tarifa',
      quickSearch: 'Búsqueda rápida',
      searchPlaceholder: 'Buscar agencia o ubigeo...',
      emptyTable: 'No se encontraron tarifas que coincidan con los filtros aplicados.',
      columns: {
        agency: 'Agencia / Carrier',
        destination: 'Destino (Ubigeo)',
        address: 'Dirección',
        cost: 'Costo Adicional',
        status: 'Estado',
        actions: 'Acciones'
      },
      modal: {
        createTitle: 'Configurar Nueva Tarifa',
        editTitle: 'Editar Tarifa Existente',
        cancelBtn: 'Cancelar',
        saveBtn: 'Guardar Tarifa'
      },
      filter: {
        agencyPlaceholder: 'Todas las Agencias',
        deptPlaceholder: 'Todos los Deptos.',
        provPlaceholder: 'Todas las Provincias'
      },
      form: {
        agencyLabel: 'Agencia de Envío *',
        departmentLabel: 'Departamento (Opcional)',
        provinceLabel: 'Provincia (Opcional)',
        districtLabel: 'Distrito (Opcional)',
        addressLabel: 'Dirección del Local (Opcional)',
        costLabel: 'Costo Adicional *',
        availableLabel: 'Disponible',
        agencyPlaceholder: 'Seleccione una agencia',
        addressPlaceholder: 'Ej: Av. Principal 123'
      },
      filters: {
        allStatuses: 'Todos los estados',
        available: 'Disponible',
        unavailable: 'No Disponible',
        allAgencies: 'Todas las Agencias',
        allDepartments: 'Todos los Departamentos',
        allProvinces: 'Todas las Provincias'
      },
      alerts: {
        loadError: 'Error al cargar tarifas',
        deleteSuccess: 'Tarifa eliminada',
        deleteError: 'Error al eliminar',
        requireDestination: 'Añade al menos un destino para la tarifa.',
        saveSuccess: 'Tarifa actualizada',
        saveError: 'Error al actualizar la tarifa',
        createSuccess: '{count} tarifa(s) creada(s) correctamente',
        createError: 'Hubo un error al crear algunas tarifas'
      },
      confirmDelete: {
        title: '¿Eliminar tarifa?',
        message: '¿Estás seguro de que deseas eliminar esta tarifa de {agency}?',
        confirmLabel: 'Sí, eliminar'
      },
      values: {
        national: 'Nacional (Todos)'
      }
    },
    locations: {
      deptTitle: 'Departamentos',
      provTitle: 'Provincias',
      distTitle: 'Distritos',
      deptEmpty: 'No hay departamentos',
      provEmpty: 'No hay provincias',
      distEmpty: 'No hay distritos',
      provPlaceholder: 'Seleccione un departamento',
      distPlaceholder: 'Seleccione una provincia',
      dialogs: {
        department: 'Nuevo Departamento',
        province: 'Nueva Provincia',
        district: 'Nuevo Distrito'
      },
      alerts: {
        loadDeptError: 'Error al cargar departamentos',
        loadProvError: 'Error al cargar provincias',
        loadDistError: 'Error al cargar distritos',
        createDeptSuccess: 'Departamento creado',
        createProvSuccess: 'Provincia creada',
        createDistSuccess: 'Distrito creado',
        createError: 'Error al crear. Verifique que el código no esté duplicado.',
        deleteDeptSuccess: 'Departamento eliminado',
        deleteProvSuccess: 'Provincia eliminada',
        deleteDistSuccess: 'Distrito eliminado',
        deleteDeptError: 'Error al eliminar departamento',
        deleteProvError: 'Error al eliminar provincia',
        deleteDistError: 'Error al eliminar distrito'
      },
      confirmDelete: {
        departmentTitle: '¿Eliminar departamento?',
        departmentMsg: 'Se eliminará "{name}" y todas sus provincias y distritos asociados.',
        provinceTitle: '¿Eliminar provincia?',
        provinceMsg: 'Se eliminará "{name}" y todos sus distritos asociados.',
        districtTitle: '¿Eliminar distrito?',
        districtMsg: 'Se eliminará "{name}" de forma permanente.',
        confirmLabel: 'Sí, eliminar'
      },
      hints: {
        department: 'Código de 2 dígitos (ej: 15)',
        province: 'Código de 4 dígitos (ej: 1501)',
        district: 'Código de 6 dígitos (ej: 150101)'
      },
      panel: {
        newBtn: 'Nuevo',
        loading: 'Cargando...',
        deleteTooltip: 'Eliminar'
      }
    },
    destinationPicker: {
      title: 'Destinos de cobertura',
      hint: 'Seleccione una ubicación y haga clic en "Agregar" para añadir destinos.',
      department: 'Departamento',
      provinces: 'Provincias (Múltiple)',
      districts: 'Distritos (Múltiple)',
      address: 'Dirección del Local de la Agencia en este destino (Opcional)',
      addBtn: 'Agregar Destino',
      selected: '{0} seleccionados',
      removeTooltip: 'Quitar',
      emptyState: 'No hay destinos agregados. Use los selectores de arriba para agregar zonas de cobertura.',
      alerts: {
        requireLevel: 'Seleccione al menos un nivel de ubicación',
        duplicates: 'Los destinos seleccionados ya fueron agregados'
      },
      addressLabel: 'Dirección: {address}'
    }
  },
  adminInvoices: {
    title: 'Comprobantes de Pago',
    badgeSuffix: ' boletas en total',
    table: {
      emptyMessage: 'No hay comprobantes registrados.',
      headers: {
        invoiceNumber: 'Nro Comprobante',
        orderId: 'ID Orden',
        client: 'Cliente / Correo',
        date: 'Fecha de Emisión',
        total: 'Monto Total',
        status: 'Estado',
        actions: 'Acciones'
      },
      tooltips: {
        download: 'Descargar PDF',
        sendEmail: 'Reenviar Correo',
        annul: 'Anular Boleta'
      },
      icons: {
        download: 'pi pi-download',
        sendEmail: 'pi pi-envelope',
        annul: 'pi pi-times-circle'
      },
      status: {
        issued: 'Emitido',
        annulled: 'Anulado'
      }
    },
    actions: {
      sendEmail: {
        title: '¿Reenviar comprobante por correo?',
        message: 'Se reenviará la boleta {invoiceNumber} al correo registrado.',
        confirmLabel: 'Sí, enviar'
      },
      annul: {
        title: '¿Anular comprobante de pago?',
        message: 'La boleta {invoiceNumber} será anulada permanentemente.',
        confirmLabel: 'Sí, anular'
      }
    },
    alerts: {
      pdfError: 'El enlace al PDF no está disponible.',
      emailSuccess: 'Correo enviado exitosamente.',
      emailError: 'Error al enviar correo.',
      annulSuccess: 'Comprobante anulado exitosamente.',
      annulError: 'Error al anular comprobante.'
    }
  },
  adminProfile: {
    title: 'Mi Perfil',
    subtitle: 'Administra tu información personal y seguridad',
    tabs: {
      info: 'Información Personal',
      security: 'Seguridad'
    },
    infoSection: {
      title: 'Datos del administrador',
      subtitle: 'Actualiza tus datos de contacto.',
      labels: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo electrónico',
        documentType: 'Tipo de documento',
        documentNumber: 'Número de documento',
        phone: 'Teléfono / Celular'
      },
      hints: {
        emailImmutable: 'El correo no puede modificarse.',
        nameImmutable: 'El nombre se establece al registrarse.'
      },
      placeholders: {
        docTypeSelect: 'Seleccionar',
        docNumber: '12345678',
        phone: '987654321'
      },
      errors: {
        phonePattern: 'Ingresa un número de 9 dígitos.'
      },
      saveLabel: 'Guardar cambios'
    },
    securitySection: {
      title: 'Cambiar contraseña',
      subtitle: 'Usa una contraseña segura de al menos 8 caracteres.',
      labels: {
        currentPassword: 'Contraseña actual *',
        newPassword: 'Nueva contraseña *',
        confirmPassword: 'Confirmar nueva contraseña *'
      },
      placeholders: {
        currentPassword: 'Tu contraseña actual',
        newPassword: 'Mínimo 8 caracteres',
        confirmPassword: 'Repite la nueva contraseña'
      },
      errors: {
        required: 'Campo requerido',
        minlength: 'Mínimo 8 caracteres',
        mismatch: 'Las contraseñas no coinciden'
      },
      saveLabel: 'Actualizar contraseña'
    },
    alerts: {
      profileSuccess: 'Perfil actualizado correctamente',
      profileError: 'Error al actualizar el perfil',
      passwordSuccess: 'Contraseña actualizada correctamente',
      passwordError: 'Error al cambiar contraseña',
      passwordErrorMsg: 'Verifica tu contraseña actual.'
    }
  },
  adminSettings: {
    title: 'Configuración de la Tienda',
    subtitle: 'Administra los ajustes generales y de contacto',
    generalSection: {
      title: 'Información de la Tienda',
      labels: {
        companyName: 'Nombre de la Empresa (Razón Social)',
        taxId: 'RUC / Tax ID',
        address: 'Dirección Fiscal',
        supportEmail: 'Email de Soporte',
        supportPhone: 'Teléfono de Soporte',
        logoUrl: 'URL del Logo',
        freeShippingThreshold: 'Monto Envío Gratis (S/)',
        orderExpirationMinutes: 'Tiempo Expiración Reserva (Minutos)'
      },
      saveLabel: 'Guardar ajustes'
    },
    alerts: {
      success: 'Configuración actualizada',
      error: 'Error al actualizar configuración',
      loadError: 'Error al cargar la configuración de la tienda.'
    }
  },
  shop: {
  }
};
