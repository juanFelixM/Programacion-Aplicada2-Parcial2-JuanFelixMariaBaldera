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

| Inicio de Sesión | Catálogo de Vehículos | Detalle y Compra | Vehiculos disponibles |
| :---: | :---: | :---: | :---: |
| <img width="740" height="1600" alt="inicio" src="https://github.com/user-attachments/assets/207f12da-bbdf-4acc-9290-f0527050fd46" />
| <img width="740" height="1600" alt="catalogo" src="https://github.com/user-attachments/assets/1e55646f-fb7b-4dd6-863e-e80947608819" />
 | <img width="740" height="1600" alt="detalles de compra" src="https://github.com/user-attachments/assets/f629d64b-4f2c-4ac5-9f22-1bcd7acc0b05" />
 | <img width="740" height="1600" alt="solo disponibles" src="https://github.com/user-attachments/assets/e0ccb178-7a70-48d2-9d85-1d3f3c67b79d" />
|

Pantallas Principales
