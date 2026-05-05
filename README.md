
  # AEROTURS

  This is a code bundle for AEROTURS. The original project is available at https://www.figma.com/design/zbGu1A5SIeigqlTtHsKPml/AEROTURS.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    >>>>>>> c42fb60 (Diseño de AEROTURS)

# Versión 1 Aeroturs

Creacion de la parte visual
-reserva de vuelo (creacion de las reservas)
-registro (solo se creo el espacio)
-estado de vuelo (solo se creo el espacio)
-mis reservas (se veran las reservas realizadas)
en la pagina principal se crearon diferentes espacios de informacion (precios, destinos populares, etc).

# Configuración Inicial y Documentación
feat: inicializar repositorio con estructura de carpetas MVC 
docs: agregar documentación de casos de uso y diagramas de secuencia 
docs: agregar diagrama de clases y modelo entidad-relación 

# Version 2 Aeroturs

Incorporación de precios con mas destinos, informacion general, selección de clase de vuelo (economico, negocio, primera clase) tambien se incorporo informacion de la aerolinea

Analisis de casos de us para modificacion del proyecto

reoganización de elementos de la pagina

funcionalidad de pestañas de pagina 

analisis de incorporacion de inicio de seccion


# Autenticación y usuarios
feat: implementar sistema de registro de usuarios con validación de datos

feat: implementar inicio de sesión (login) con autenticación básica

feat: agregar control de acceso por roles (admin, agente, cliente)

fix: corregir validación de campos en formulario de registro

# Base de datos y backend
feat: conectar aplicación con base de datos PostgreSQL

feat: crear modelo de clientes con operaciones CRUD

feat: crear modelo de vuelos con operaciones CRUD

feat: implementar modelo de reservas y relación con clientes y vuelos

feat: crear modelo de tiquetes con selección de clase y asiento

feat: agregar modelo de paquetes turísticos

# Funcionalidad de reservas
feat: implementar flujo completo de reserva de vuelos

feat: calcular precio total de reserva según clase y destino

feat: permitir selección de asientos en la reserva


# Seguridad y mejoras

feat: encriptar contraseñas de usuarios

feat: validar sesiones activas

fix: corregir vulnerabilidad en autenticación

refactor: optimizar consultas a base de datos

feat: asociar múltiples tiquetes a una reserva

fix: corregir error en cálculo de precios de reserva


# Reportes y consultas

feat: generar reporte de reservas por vuelo

feat: implementar consulta de clientes frecuentes

feat: agregar reporte de ingresos por destino

feat: mostrar historial de estados de reservas

# Seguridad y mejoras
feat: encriptar contraseñas de usuarios

feat: validar sesiones activas

fix: corregir vulnerabilidad en autenticación
