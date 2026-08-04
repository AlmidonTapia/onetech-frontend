export const adminProductsContent = {
  title: "Productos",
  countSuffix: "productos registrados",
  createBtnLabel: "Nuevo producto",
  searchPlaceholder: "Buscar por nombre o SKU...",
  refreshBtnLabel: "Actualizar",
  alerts: {
    createSuccess: "Producto creado",
    updateSuccess: "Producto actualizado",
    saveError: "Error al guardar",
    deleteSuccess: "Producto eliminado",
    deleteError: "Error al eliminar",
    imageUploadSuccess: "Imágenes subidas con éxito",
    imageUploadError: "Error al subir imágenes",
    imageDeleteSuccess: "Imagen eliminada",
    imageDeleteError: "Error al eliminar la imagen",
    imageMainSuccess: "Imagen establecida como principal",
    imageMainError: "Error al establecer la imagen principal"
  },
  confirmModal: {
    title: "¿Eliminar producto?",
    confirmLabel: "Sí, eliminar",
    messageText: "será eliminado permanentemente."
  },
  table: {
    allStatuses: "Todos los estados",
    allCategories: "Todas las categorías",
    allBrands: "Todas las marcas",
    quickSearchTitle: "Catálogo de Productos",
    searchPlaceholder: "Buscar producto...",
    emptyMessage: "No se encontraron productos.",
    headers: {
      img: "Img",
      product: "Producto",
      sku: "SKU",
      category: "Categoría",
      brand: "Marca",
      price: "Precio",
      stock: "Stock",
      status: "Estado",
      actions: "Acciones"
    },
    tooltips: {
      images: "Imágenes",
      edit: "Editar",
      delete: "Eliminar"
    },
    deleteLabel: "Eliminar",
    status: {
      active: "Activo",
      inactive: "Inactivo",
      outOfStock: "Agotado"
    }
  },
  form: {
    titleNew: "Nuevo Producto",
    titleEdit: "Editar Producto",
    errorRequired: "Campo requerido",
    metaLabel: "Última modificación:",
    cancelLabel: "Cancelar",
    saveLabel: "Guardar",
    specs: {
      title: "Especificaciones Técnicas",
      addLabel: "Añadir Propiedad",
      keyPlaceholder: "Propiedad (Ej: RAM, Procesador)",
      valuePlaceholder: "Valor (Ej: 16GB, Intel i7)",
      deleteTitle: "Eliminar propiedad",
      emptyMessage: "No hay especificaciones añadidas para este producto."
    },
    imagesInfo: {
      newProductMsg: "Podrá subir imágenes una vez que guarde el producto por primera vez.",
      manageBtnLabel: "Gestionar Imágenes"
    },
    badges: {
      none: "Ninguno",
      new: "Nuevo",
      bestseller: "Más vendido",
      offer: "Oferta"
    },
    fields: {
      name: "Nombre del producto *",
      namePlaceholder: "Ej: Laptop Asus ROG",
      sku: "SKU *",
      skuPlaceholder: "Ej: LAP-ASUS-01",
      category: "Categoría *",
      categoryPlaceholder: "Seleccionar categoría",
      brand: "Marca *",
      brandPlaceholder: "Seleccionar marca",
      price: "Precio (S/.) *",
      originalPrice: "Precio Original (Opcional)",
      stock: "Stock Inicial *",
      status: "Estado *",
      statusPlaceholder: "Seleccionar estado",
      badge: "Insignia",
      badgePlaceholder: "Sin insignia",
      description: "Descripción del producto *",
      descriptionPlaceholder: "Ingresa las especificaciones y características principales..."
    }
  },
  images: {
    headerPrefix: "Imágenes — ",
    altText: "Imagen del producto",
    mainBadgeLabel: "Principal",
    emptyMessage: "Sin imágenes. Sube la primera imagen abajo.",
    uploadedImages: "Imágenes cargadas",
    setMainTooltip: "Establecer como principal",
    deleteTooltip: "Eliminar imagen",
    uploadNewTitle: "Subir nuevas imágenes",
    upload: {
      chooseLabel: "Elegir imágenes",
      uploadLabel: "Subir",
      cancelLabel: "Limpiar",
      note: "Soporta múltiples archivos. Límite de 5 imágenes en total. Tamaño máx: 10MB."
    },
    closeLabel: "Cerrar"
  }
};
