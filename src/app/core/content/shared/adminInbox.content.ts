export const adminInboxContent = {
  title: "Bandeja de Entrada",
  subtitle: "Gestiona los mensajes enviados por los clientes desde el formulario de contacto.",
  badgeSuffix: " sin leer",
  table: {
    quickSearchTitle: "Búsqueda Rápida",
    searchPlaceholder: "Nombre, email o asunto...",
    emptyMessage: "No hay mensajes en la bandeja de entrada.",
    headers: {
      date: "Fecha",
      name: "Nombre",
      email: "Email",
      subject: "Asunto",
      status: "Estado",
      actions: "Acciones"
    },
    statusLabels: {
      unread: "No Leído",
      read: "Leído",
      replied: "Respondido"
    },
    icons: {
      view: "pi pi-eye",
      reply: "pi pi-reply",
      delete: "pi pi-trash"
    },
    actions: {
      markRead: "Marcar como Leído",
      markUnread: "Marcar como No Leído",
      markReplied: "Marcar como Respondido",
      delete: "Eliminar"
    },
    confirmDelete: {
      title: "Confirmar Eliminación",
      message: "¿Estás seguro de que deseas eliminar el mensaje de {name}?",
      acceptLabel: "Sí, Eliminar",
      rejectLabel: "Cancelar"
    }
  },
  alerts: {
    loadError: "Error al cargar los mensajes",
    statusSuccess: "Estado actualizado",
    statusError: "Error al actualizar el estado",
    deleteSuccess: "Mensaje eliminado",
    deleteError: "Error al eliminar el mensaje"
  }
};
