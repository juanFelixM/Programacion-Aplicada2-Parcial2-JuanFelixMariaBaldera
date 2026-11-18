# ViceCity Motors - Venta de Vehículos e Historial de Compras

* **Nombre completo:** Juan Felix Maria Baldera
* **Matrícula:** 20213-0680
* **Correo:** Juan_maria1@ucne.edu.do
* **URL API Endpoint:** https://vicecity-motors-api.vercel.app

---

## Endpoints

### Autenticación

* `POST /auth/registro` — Público (Crear cuenta)
* `POST /auth/login` — Público (Iniciar sesión)

### Vehículos

* `GET /vehiculos` — Autenticado (Listar vehículos disponibles)
* `GET /vehiculos/:id` — Autenticado (Detalle de vehículo)
* `POST /vehiculos` — Solo admin (Publicar/crear vehículo)
* `PUT /vehiculos/:id` — Solo admin (Editar vehículo)
* `DELETE /vehiculos/:id` — Solo admin (Eliminar vehículo)

### Compras

* `POST /compras` — Cliente (Realizar compra de un vehículo)
* `GET /compras/mis-compras` — Cliente (Ver historial de compras del usuario)
* `GET /compras` — Solo admin (Ver todas las compras realizadas)
* `PUT /compras/:id/estado` — Solo admin (Actualizar estado de la compra)
* `DELETE /compras/:id` — Cliente (Cancelar compra pendiente)

---

## Capturas de Pantalla

Pantallas Principales
