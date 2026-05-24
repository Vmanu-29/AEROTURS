# AEROTURS

This is a code bundle for AEROTURS. The original project is available at https://www.figma.com/design/zbGu1A5SIeigqlTtHsKPml/AEROTURS.

## Running the code

Run `npm i` to install the dependencies.

Copy `.env.example` to `.env` and set your database connection values before starting the backend.

Run `npm run dev` to start the frontend development server.
Run `npm run start:backend` to start the Express backend on port 3000.
Run `npm run dev:all` to start frontend and backend together.

## Base de datos

El proyecto usa PostgreSQL. Para crear la base de datos `aerolinea`, sus tablas y datos iniciales, ejecuta:

```bash
psql -U postgres -f database/aeroturs.sql
```

También puedes usar pgAdmin4 para conectarte al servidor PostgreSQL local y ejecutar el script `database/aeroturs.sql`.

Si usas un archivo `.env`, define las variables:

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aerolinea
```

Si quieres usar Neon, Supabase u otra base de datos PostgreSQL remota, define también:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/aerolinea
# o PG_CONNECTION_STRING si prefieres otro nombre
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

En Neon y Supabase normalmente puedes copiar el connection string desde la consola de administración y pegarlo en `DATABASE_URL`.

> Para bases administradas remotas no ejecutes `CREATE DATABASE` ni `DROP DATABASE` desde `database/aeroturs.sql`; sólo usa los comandos `CREATE TABLE` e `INSERT` dentro de tu base de datos existente.

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


