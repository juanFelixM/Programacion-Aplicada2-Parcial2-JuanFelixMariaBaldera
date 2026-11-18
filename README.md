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

### Pantallas Principales

| Inicio de Sesión | Catálogo de Vehículos | Detalle y Compra | Vehiculos disponibles | Creacion de Cuenta |
|<img width="740" height="1600" alt="inicio" src="https://github.com/user-attachments/assets/164a9b4b-7311-4fab-8b4d-9e7ff226c0b6" />|
 |<img width="740" height="1600" alt="catalogo" src="https://github.com/user-attachments/assets/f37b8a27-6b99-40d3-9036-0645be0f31a3" />|
 |<img width="740" height="1600" alt="detalles de compra" src="https://github.com/user-attachments/assets/a28987c3-adb0-48b9-9045-3f549afca247" />|
 |<img width="740" height="1600" alt="solo disponibles" src="https://github.com/user-attachments/assets/97f35887-9fda-4723-adf7-743f3366b761" />|
 |<img width="740" height="1600" alt="creacion de cuenta" src="https://github.com/user-attachments/assets/071b09a4-8239-4f7a-bde7-d459cf20c557" />|


Pantallas Principales
