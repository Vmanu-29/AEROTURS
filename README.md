# AEROTURS

This is a code bundle for AEROTURS. The original project is available at https://www.figma.com/design/zbGu1A5SIeigqlTtHsKPml/AEROTURS.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Base de datos

El proyecto usa PostgreSQL. Para crear la base de datos `aerolinea`, sus tablas y datos iniciales, ejecuta:

```bash
psql -U postgres -f database/aeroturs.sql
```

Usuarios de prueba:

- `admin@aeroturs.com` / `admin123`
- `agente@aeroturs.com` / `agente123`
- `cliente@aeroturs.com` / `cliente123`
- `empresa@aeroturs.com` / `empresa123`

## Version 1 Aeroturs

Creacion de la parte visual:

- Reserva de vuelo.
- Registro.
- Estado de vuelo.
- Mis reservas.
- Espacios informativos en la pagina principal.

## Version 2 Aeroturs

Incorporacion de precios con mas destinos, informacion general y seleccion de clase de vuelo: economica, Business y primera clase.

## Version actual

- Formulario de busqueda responsivo.
- Seleccion de clase de vuelo desde el buscador.
- Diferencia de precios por clase.
- Business disponible solo para cuentas empresariales.
- Registro con tipo de cuenta: persona natural o empresa.
- Panel de administrador para ver, crear, modificar y cancelar reservas de usuarios.

- feat(backend): add PostgreSQL connection module

- refactor(backend): use shared DB module and improve routes

- chore(package): add dotenv and concurrently dependencies
   
- docs(env): add .env.example for local and remote DB config

- docs(readme): document backend startup and Neon/Supabase setup


