Temática Proyecto Integrador: Gestión de reservas y venta de servicios de una aerolínea 
Objetivo General
Aplicar los conceptos de bases de datos y programación en Ambiente Web I para el análisis, diseño y desarrollo de un sistema web que permita gestionar los procesos de una aerolínea, incluyendo reservas de vuelos, compra de tiquetes, adquisición de paquetes turísticos adicionales según el sector de destino y el registro y gestión de clientes.
 
Objetivos Específicos 
•	Aplicar los conceptos de modelamiento UML para ilustrar el alcance y funcionamiento del sistema de gestión de la aerolínea.
•	Aplicar el patrón de arquitectura Modelo–Vista–Controlador (MVC) dentro de la aplicación web.
•	Implementar tecnologías web vistas en el curso de Desarrollo en Ambientes Web I (HTML5, Framework CSS como Flexbox o Bootstrap, JavaScript).
•	Integrar conceptos de bases de datos relacionales en el desarrollo de la solución.
•	Implementar una base de datos que sea consultada y gestionada desde la aplicación web.
•	Utilizar un repositorio en GitHub para el control de versiones y la evaluación del aporte de cada integrante del equipo de proyecto.
Descripción del Proyecto
Una aerolínea nacional ha contratado a su equipo de desarrollo para diseñar e implementar un sistema web que permita gestionar de manera integral sus operaciones comerciales, bajo un modelo similar al de plataformas de reserva aérea y turismo como Avianca, LATAM o Despegar.
 
El sistema permitirá:
•	Registrar y gestionar clientes.
•	Realizar reservas de vuelos nacionales e internacionales.
•	Comprar tiquetes aéreos.
•	Adquirir paquetes turísticos adicionales (hotel, transporte, tours) según el sector o destino del vuelo.
•	Administrar el estado de las reservas y los tiquetes.
Los datos de país, departamento y ciudad estarán almacenados por separado. Un país puede tener varios departamentos. Un departamento o estado pertenece a un único país y puede tener varias ciudades. Cada ciudad pertenece a un único departamento. De cada uno se almacenará un identificador único y su nombre.
Los clientes deben registrarse en el sistema con la siguiente información: Número de identificación (cédula o pasaporte), nombres y apellidos, correo electrónico, dirección de residencia, ciudad, departamento y país, teléfono principal y teléfono alterno. Un cliente puede realizar múltiples reservas y comprar varios tiquetes.
Cada vuelo se identifica por: Código único de vuelo, ciudad de origen, ciudad de destino, fecha y hora de salida, fecha y hora estimada de llegada, capacidad total de pasajeros, precio base del tiquete, estado del vuelo (Programado, Abordando, En vuelo, Finalizado, Cancelado). Un vuelo puede tener múltiples reservas asociadas.
Cada reserva es realizada por un único cliente y puede incluir uno o varios tiquetes; además, está asociada a un único vuelo. De la reserva se almacena: Identificador único, fecha y hora de la reserva, valor total, estado de la reserva (Reservada, Confirmada, Cancelada, Expirada).
Cada tiquete contiene: Identificador único, número de asiento, clase del tiquete (Económica, Ejecutiva, Primera clase), precio final.
La aerolínea ofrece paquetes turísticos que pueden adquirirse de forma opcional durante la compra del tiquete, dependiendo del sector o destino del vuelo. Los paquetes pueden ser: Alojamiento (hotel), transporte terrestre, tours o actividades turísticas, paquetes combinados. De cada paquete se almacena: Identificador único, nombre del paquete, descripción, sector o destino aplicable, precio, estado (Disponible / No disponible). Una reserva puede incluir cero, uno o varios paquetes turísticos.
Adicionalmente,  se debe modelar: El estado de una reserva (id, nombre del estado), el historial de estados de cada reserva, registrando la fecha y hora de cada cambio.
Perfiles de usuario
La aplicación contará con los siguientes perfiles:
•	Súper Administrador: encargado de la gestión integral de vuelos, destinos, paquetes turísticos, clientes y parámetros generales del sistema.
•	Agente de Aerolínea: responsable de gestionar reservas, confirmar pagos, asignar asientos y atender solicitudes de los clientes.
•	Cliente: encargado de registrarse, realizar reservas, comprar tiquetes y adquirir paquetes turísticos adicionales.
El sistema implementará operaciones CRUD (Crear, Consultar, Actualizar y Eliminar) sobre las entidades principales y contará con un mecanismo básico de autenticación y control de acceso por roles.
Consultas Organizadas por Areas Funiconales
1.	Gestión de datos (CRUD)
•	Registrar, modificar, eliminar y consultar clientes.
•	Registrar, modificar, eliminar y consultar vuelos.
•	Registrar, modificar, eliminar y consultar reservas.
•	Registrar, modificar, eliminar y consultar tiquetes.
•	Registrar, modificar, eliminar y consultar paquetes turísticos.
•	Registrar, modificar, eliminar y consultar países, departamentos y ciudades.
 
2.	Reportes comerciales
•	Ingresos mensuales por destino.
•	Número de reservas por vuelo y por mes.
•	Clientes frecuentes: clientes con mayor número de reservas en un periodo determinado.


3.	Reportes de cobertura y destinos
•	Listado de vuelos por país, departamento y ciudad de destino.
•	Destinos más vendidos por sector geográfico.
 
4.	Reportes de reservas y operación
•	Historial de reservas por cliente.
•	Reservas canceladas y su causa.
•	Tiempo promedio entre reserva y confirmación.
 
5.	Seguridad
•	Implementación de autenticación básica con usuario y contraseña.
•	Control de acceso basado en roles (Administrador, Agente, Cliente).
 
Entregables
•	Documentación de casos de uso.
•	Diagramas de secuencia.
•	Diagrama de clases.
•	Diagrama entidad–relación y modelo relacional de la base de datos.
•	Implementación de la base de datos en PostgreSQL.
•	Evidencia de uso de repositorio GitHub.
•	Aplicación web funcional.
•	Manual de instalación.
•	Manual de usuario final.
•	Documento final del proyecto.
•	Presentación y sustentación.
