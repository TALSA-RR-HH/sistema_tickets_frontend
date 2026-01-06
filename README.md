# Sistema de Registro de Tickets RRHH - Frontend (Talsa)

Interfaz web corporativa para la gestión de solicitudes de Recursos Humanos. Este proyecto consume la API REST del sistema de tickets y está construido con una arquitectura modular y escalable.

## 🛠 Tecnologías
* **Framework:** Angular 17+ (Standalone Components)
* **Lenguaje:** TypeScript
* **Estilos:** Bootstrap 5 & Bootstrap Icons
* **Arquitectura:** Component-Based Architecture
* **Gestión de Paquetes:** NPM

## 📂 Estructura del Proyecto
El proyecto sigue una organización modular para facilitar el mantenimiento:

```text
src/app/
├── components/   # Componentes reutilizables (Navbar, Footer, Loaders)
├── guards/       # Protección de rutas (AuthGuard)
├── models/       # Interfaces y tipos de datos (DTOs espejo del Backend)
├── pages/        # Vistas completas (Login, Dashboard, Historial)
└── services/     # Lógica de comunicación HTTP con Spring Boot
```
---
Desarrollado por Valentin Fernandez - 2026