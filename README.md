# OneTech Solutions - Frontend

Plataforma de E-commerce desarrollada en Angular 18+, diseñada para ofrecer una experiencia de usuario rápida, fluida y altamente reactiva.

##  Funcionalidades y Módulos Recientes

Se han implementado y refinado múltiples módulos administrativos y de cliente para mejorar la experiencia operativa y de compras:

- **Panel Administrativo (Dashboard):** Vistas analíticas mejoradas para el seguimiento de órdenes recientes y visualización de estados en tiempo real.
- **Gestión de Órdenes y Envíos (Shipments):**
  - Módulo completo de despachos con seguimiento de estados (`PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - Generación de códigos de recogida (`Pickup Code`) e integración asíncrona con el backend.
  - Vistas dinámicas de cronogramas de envío (Time-line) en el perfil del cliente.
- **Seguridad en la UI:**
  - Protección de Rutas (Route Guards) alineadas con la seguridad y Roles (JWT) provistos por el backend.
  - Componentes reactivos que se adaptan dinámicamente si el usuario es `ADMIN` o `CLIENT`.
- **Experiencia de Usuario (UX/UI):**
  - Tablas dinámicas (PrimeNG/Tailwind) con paginación optimizada desde servidor.
  - Componentes de estados visuales mediante *badges* y paletas de color modernas.
  - **Soporte Multi-idioma (i18n):** Sistema de internacionalización dinámico y reactivo basado en Angular Signals (ES/EN) sin recargas, utilizando un diccionario estrictamente tipado.

## 🛠️ Stack Tecnológico

- **Framework:** Angular 18+
- **Estilos:** TailwindCSS + Vanilla CSS
- **Componentes UI:** PrimeNG
- **Gestión de Estado:** RxJS Signals / Observables

## 📦 Instalación y Ejecución

1. Clona el repositorio y navega a la carpeta del frontend.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno si es necesario (`src/environments/environment.ts`).
4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

La aplicación se servirá en `http://localhost:4200/`.
