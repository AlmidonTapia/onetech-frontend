# OneTech Frontend — Arquitectura & Setup

## Stack
- **Angular 21** (Standalone Components, Signals)
- **PrimeNG v18+** — componentes UI (DataTable, Dialog, Toast, etc.)
- **Tailwind CSS v4** — utilidades de layout y spacing
- **PrimeIcons** — íconos incluidos con PrimeNG
- **Base API:** `http://localhost:8080/api/v1`

---

## ¿PrimeNG usa Tailwind? ¿Son compatibles?

**Sí, son 100% compatibles** con una pequeña configuración.  
PrimeNG tiene su propio sistema de temas (`@primeuix/themes`).  
Tailwind lo usas **al lado** para layout, spacing, responsive, etc.  
La config de `app.config.ts` incluye el `cssLayer` para que no haya conflictos.

---

## Instalación rápida

```bash
# 1. PrimeNG
npm install primeng @primeuix/themes primeicons

# 2. Tailwind CSS v4 (con plugin Vite — Angular 21 usa Vite)
npm install -D tailwindcss @tailwindcss/vite

# 3. En angular.json → styles agrega:
#    "src/styles.css"
# Y en styles.css agrega al tope:
#    @import "tailwindcss";
#    @import "primeicons/primeicons.css";
```

> **Nota:** Con Tailwind v4 ya **no necesitas** `tailwind.config.js`.  
> Solo agrega `@import "tailwindcss";` en tu CSS principal.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                          # Lógica central, no UI
│   │   ├── auth/
│   │   │   ├── auth.guard.ts          # Protege rutas de usuario logueado
│   │   │   └── admin.guard.ts         # Protege rutas de ADMIN
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Agrega JWT a cada request
│   │   ├── models/                    # Interfaces TypeScript por módulo
│   │   │   ├── auth-response.model.ts
│   │   │   ├── page-response.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── address.model.ts
│   │   │   ├── brand.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── qualification.model.ts
│   │   │   ├── inventory.model.ts
│   │   │   ├── cart.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── payment.model.ts
│   │   │   └── shipment.model.ts
│   │   └── services/                  # Servicios HTTP por módulo backend
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       ├── brand.service.ts
│   │       ├── category.service.ts
│   │       ├── product.service.ts
│   │       ├── qualification.service.ts
│   │       ├── inventory.service.ts
│   │       ├── cart.service.ts
│   │       ├── order.service.ts
│   │       ├── payment.service.ts
│   │       └── shipment.service.ts
│   │
│   ├── features/                      # Módulos de funcionalidad (lazy-loaded)
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── shop/                      # Vista del cliente (tienda)
│   │   │   ├── shop.routes.ts
│   │   │   ├── home/                  # Landing + Banners + Destacados
│   │   │   │   └── components/
│   │   │   │       ├── hero-banner/
│   │   │   │       ├── featured-categories/
│   │   │   │       ├── featured-products/
│   │   │   │       └── promo-banner/
│   │   │   ├── catalog/               # Listado filtrable de productos
│   │   │   │   └── components/
│   │   │   │       ├── catalog-filters/
│   │   │   │       ├── catalog-grid/
│   │   │   │       └── catalog-sort/
│   │   │   ├── product-detail/        # Detalle + Reviews + Relacionados
│   │   │   │   └── components/
│   │   │   │       ├── product-images/
│   │   │   │       ├── product-info/
│   │   │   │       ├── product-reviews/
│   │   │   │       └── related-products/
│   │   │   ├── cart/                  # Carrito de compras
│   │   │   │   └── components/
│   │   │   │       ├── cart-items/
│   │   │   │       └── cart-summary/
│   │   │   ├── checkout/              # Flujo de pago (4 pasos)
│   │   │   │   └── components/
│   │   │   │       ├── checkout-address/
│   │   │   │       ├── checkout-shipping/
│   │   │   │       ├── checkout-payment/
│   │   │   │       └── checkout-summary/
│   │   │   ├── orders/                # Historial de órdenes
│   │   │   │   └── components/
│   │   │   │       ├── orders-list/
│   │   │   │       └── order-detail/
│   │   │   ├── profile/               # Perfil + Direcciones
│   │   │   │   └── components/
│   │   │   │       ├── profile-info/
│   │   │   │       ├── profile-addresses/
│   │   │   │       └── profile-security/
│   │   │   └── wishlist/
│   │   │
│   │   └── admin/                     # Panel de administración
│   │       ├── admin.routes.ts
│   │       ├── dashboard/
│   │       │   └── components/
│   │       │       ├── dashboard-stats/
│   │       │       ├── dashboard-chart/
│   │       │       └── dashboard-recent-orders/
│   │       ├── products/
│   │       │   └── components/
│   │       │       ├── products-table/
│   │       │       ├── product-form/
│   │       │       └── product-images-manager/
│   │       ├── categories/
│   │       ├── brands/
│   │       ├── orders/
│   │       ├── inventory/
│   │       ├── shipments/
│   │       └── users/
│   │
│   └── shared/                        # Reutilizable en todo el proyecto
│       ├── layout/
│       │   ├── navbar/                # Navbar con search + cart icon
│       │   │   └── components/
│       │   │       ├── navbar-menu/
│       │   │       ├── navbar-search/
│       │   │       └── navbar-cart/
│       │   ├── footer/
│       │   ├── admin-sidebar/         # Sidebar del panel admin
│       │   ├── shop-layout/           # Layout con navbar + footer
│       │   └── admin-layout/          # Layout con sidebar
│       ├── components/
│       │   └── ui/                    # Wrappers de PrimeNG customizados
│       │       ├── button/
│       │       ├── badge/
│       │       ├── card/
│       │       ├── spinner/
│       │       ├── alert/
│       │       ├── modal/
│       │       ├── breadcrumb/
│       │       └── star-rating/
│       ├── pipes/
│       │   └── currency-pen.pipe.ts   # Formateo de precios en soles
│       └── services/
│           ├── alert.service.ts       # Toast notifications
│           └── modal.service.ts
│
├── environments/
│   ├── environment.ts                 # dev (localhost:8080)
│   └── environment.prod.ts
│
└── assets/
    ├── images/
    └── icons/
```

---

## Mapeo Backend → Frontend

| Backend módulo        | Endpoint base                  | Feature/Service frontend         |
|-----------------------|--------------------------------|----------------------------------|
| Identity              | `/api/v1/users`                | `auth.service` + `user.service`  |
| Catalog - Marcas      | `/api/v1/brands`               | `brand.service` + admin/brands   |
| Catalog - Categorías  | `/api/v1/categories`           | `category.service` + admin/cats  |
| Catalog - Productos   | `/api/v1/products`             | `product.service` + shop/catalog |
| Catalog - Reviews     | `/api/v1/qualifications`       | `qualification.service`          |
| Inventory             | `/api/v1/inventory/movements`  | `inventory.service` + admin      |
| Cart                  | `/api/v1/cart`                 | `cart.service` + shop/cart       |
| Orders                | `/api/v1/orders`               | `order.service` + shop+admin     |
| Payments              | `/api/v1/payments`             | `payment.service` + checkout     |
| Shipment Methods      | `/api/v1/shipment-methods`     | `shipment.service`               |
| Shipments             | `/api/v1/shipments`            | `shipment.service` + admin       |

---

## Pasos para empezar

```bash
# 1. Genera la estructura
bash setup-onetech-structure.sh

# 2. Instala dependencias
npm install primeng @primeuix/themes primeicons
npm install -D tailwindcss @tailwindcss/vite

# 3. Copia los archivos de onetech-core-files.ts y onetech-routes-and-config.ts
#    a sus rutas correspondientes (quitando los comentarios /* */ de cada bloque)

# 4. Agrega al styles.css:
#    @import "tailwindcss";
#    @import "primeicons/primeicons.css";

# 5. Verifica con:
ng serve
```

---

## Convención de nombres (igual que el ejemplo)

- Cada feature tiene: `nombre.ts` + `nombre.html` + `nombre.css`
- Los componentes son **standalone** con `imports: []` explícito
- Los servicios usan `inject()` y **Signals** (`signal()`, `computed()`)
- Lazy loading en TODAS las rutas de features
- Los guards y el interceptor están en `core/`
