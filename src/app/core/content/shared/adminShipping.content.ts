export const adminShippingContent = {
  title: "Logística y Envíos",
  description: "Gestiona las agencias de envío disponibles y configura las tarifas o cobertura por Ubigeo.",
  tabs: {
    agencies: "Agencias / Métodos",
    rates: "Cobertura y Tarifas",
    locations: "Ubicaciones"
  },
  agencies: {
    title: "Métodos de Envío",
    badgeSuffix: " métodos",
    newBtnLabel: "Nuevo Método",
    table: {
      quickSearchTitle: "Búsqueda Rápida",
      searchPlaceholder: "Buscar agencia...",
      headers: {
        name: "Nombre del Método",
        price: "Precio Base",
        status: "Estado",
        actions: "Acciones"
      },
      emptyMsg: "No hay métodos de envío registrados."
    },
    dialog: {
      createTitle: "Nuevo Método de Envío",
      editTitle: "Editar Método de Envío",
      fields: {
        name: "Nombre del Método",
        namePlaceholder: "Ej: Express",
        price: "Precio Base (S/)",
        status: "Estado",
        statusPlaceholder: "Seleccione un estado"
      },
      actions: {
        cancel: "Cancelar",
        save: "Guardar"
      }
    },
    confirmDelete: {
      title: "¿Eliminar método de envío?",
      message: "El método de envío \"{name}\" será eliminado de forma permanente.",
      confirmLabel: "Sí, eliminar"
    },
    alerts: {
      saveSuccess: "Método de envío guardado",
      saveError: "Error al guardar método",
      deleteSuccess: "Método de envío eliminado exitosamente",
      deleteError: "Error al eliminar el método de envío"
    },
    statuses: {
      active: "Activo",
      inactive: "Inactivo"
    }
  },
  rates: {
    title: "Tarifas de Envío",
    newRateBtn: "Nueva Tarifa",
    quickSearch: "Búsqueda rápida",
    searchPlaceholder: "Buscar agencia o ubigeo...",
    emptyTable: "No se encontraron tarifas que coincidan con los filtros aplicados.",
    columns: {
      agency: "Agencia / Carrier",
      destination: "Destino (Ubigeo)",
      address: "Dirección",
      cost: "Costo Adicional",
      status: "Estado",
      actions: "Acciones"
    },
    modal: {
      createTitle: "Configurar Nueva Tarifa",
      editTitle: "Editar Tarifa Existente",
      cancelBtn: "Cancelar",
      saveBtn: "Guardar Tarifa"
    },
    filter: {
      agencyPlaceholder: "Todas las Agencias",
      deptPlaceholder: "Todos los Deptos.",
      provPlaceholder: "Todas las Provincias"
    },
    form: {
      agencyLabel: "Agencia de Envío *",
      departmentLabel: "Departamento (Opcional)",
      provinceLabel: "Provincia (Opcional)",
      districtLabel: "Distrito (Opcional)",
      addressLabel: "Dirección del Local (Opcional)",
      costLabel: "Costo Adicional *",
      availableLabel: "Disponible",
      agencyPlaceholder: "Seleccione una agencia",
      addressPlaceholder: "Ej: Av. Principal 123"
    },
    filters: {
      allStatuses: "Todos los estados",
      available: "Disponible",
      unavailable: "No Disponible",
      allAgencies: "Todas las Agencias",
      allDepartments: "Todos los Departamentos",
      allProvinces: "Todas las Provincias"
    },
    alerts: {
      loadError: "Error al cargar tarifas",
      deleteSuccess: "Tarifa eliminada",
      deleteError: "Error al eliminar",
      requireDestination: "Añade al menos un destino para la tarifa.",
      saveSuccess: "Tarifa actualizada",
      saveError: "Error al actualizar la tarifa",
      createSuccess: "{count} tarifa(s) creada(s) correctamente",
      createError: "Hubo un error al crear algunas tarifas"
    },
    confirmDelete: {
      title: "¿Eliminar tarifa?",
      message: "¿Estás seguro de que deseas eliminar esta tarifa de {agency}?",
      confirmLabel: "Sí, eliminar"
    },
    values: {
      national: "Nacional (Todos)"
    }
  },
  locations: {
    deptTitle: "Departamentos",
    provTitle: "Provincias",
    distTitle: "Distritos",
    deptEmpty: "No hay departamentos",
    provEmpty: "No hay provincias",
    distEmpty: "No hay distritos",
    provPlaceholder: "Seleccione un departamento",
    distPlaceholder: "Seleccione una provincia",
    dialogs: {
      department: "Nuevo Departamento",
      province: "Nueva Provincia",
      district: "Nuevo Distrito"
    },
    alerts: {
      loadDeptError: "Error al cargar departamentos",
      loadProvError: "Error al cargar provincias",
      loadDistError: "Error al cargar distritos",
      createDeptSuccess: "Departamento creado",
      createProvSuccess: "Provincia creada",
      createDistSuccess: "Distrito creado",
      createError: "Error al crear. Verifique que el código no esté duplicado.",
      deleteDeptSuccess: "Departamento eliminado",
      deleteProvSuccess: "Provincia eliminada",
      deleteDistSuccess: "Distrito eliminado",
      deleteDeptError: "Error al eliminar departamento",
      deleteProvError: "Error al eliminar provincia",
      deleteDistError: "Error al eliminar distrito"
    },
    confirmDelete: {
      departmentTitle: "¿Eliminar departamento?",
      departmentMsg: "Se eliminará \"{name}\" y todas sus provincias y distritos asociados.",
      provinceTitle: "¿Eliminar provincia?",
      provinceMsg: "Se eliminará \"{name}\" y todos sus distritos asociados.",
      districtTitle: "¿Eliminar distrito?",
      districtMsg: "Se eliminará \"{name}\" de forma permanente.",
      confirmLabel: "Sí, eliminar"
    },
    hints: {
      department: "Código de 2 dígitos (ej: 15)",
      province: "Código de 4 dígitos (ej: 1501)",
      district: "Código de 6 dígitos (ej: 150101)"
    },
    panel: {
      newBtn: "Nuevo",
      loading: "Cargando...",
      deleteTooltip: "Eliminar"
    }
  },
  destinationPicker: {
    title: "Destinos de cobertura",
    hint: "Seleccione una ubicación y haga clic en \"Agregar\" para añadir destinos.",
    department: "Departamento",
    provinces: "Provincias (Múltiple)",
    districts: "Distritos (Múltiple)",
    address: "Dirección del Local de la Agencia en este destino (Opcional)",
    addBtn: "Agregar Destino",
    selected: "{0} seleccionados",
    removeTooltip: "Quitar",
    emptyState: "No hay destinos agregados. Use los selectores de arriba para agregar zonas de cobertura.",
    alerts: {
      requireLevel: "Seleccione al menos un nivel de ubicación",
      duplicates: "Los destinos seleccionados ya fueron agregados"
    },
    addressLabel: "Dirección: {address}"
  }
};
