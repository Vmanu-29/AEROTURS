-- Base de datos AEROTURS para PostgreSQL
-- Ejecutar desde psql con:
-- psql -U postgres -f database/aeroturs.sql

DROP DATABASE IF EXISTS aerolinea;
CREATE DATABASE aerolinea WITH ENCODING = 'UTF8';

\connect aerolinea

CREATE TABLE rol (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(180)
);

CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  id_rol INTEGER NOT NULL REFERENCES rol(id_rol),
  correo VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(120) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_usuario_estado CHECK (estado IN ('Activo', 'Inactivo', 'Bloqueado'))
);

CREATE TABLE cliente (
  id_cliente SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  tipo_cuenta VARCHAR(20) NOT NULL DEFAULT 'persona',
  tipo_documento VARCHAR(20) NOT NULL,
  numero_documento VARCHAR(30) NOT NULL UNIQUE,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  direccion VARCHAR(160),
  ciudad VARCHAR(80) NOT NULL,
  departamento VARCHAR(80),
  pais VARCHAR(80) NOT NULL,
  telefono_principal VARCHAR(30) NOT NULL,
  telefono_alternativo VARCHAR(30),
  fecha_nacimiento DATE,
  CONSTRAINT chk_cliente_tipo_cuenta CHECK (tipo_cuenta IN ('persona', 'empresa')),
  CONSTRAINT chk_cliente_documento CHECK (tipo_documento IN ('Cedula', 'Pasaporte', 'DNI', 'NIT'))
);

CREATE TABLE destino (
  id_destino SERIAL PRIMARY KEY,
  codigo VARCHAR(5) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  ciudad VARCHAR(80) NOT NULL,
  pais VARCHAR(80) NOT NULL
);

CREATE TABLE vuelo (
  id_vuelo SERIAL PRIMARY KEY,
  codigo_vuelo VARCHAR(12) NOT NULL UNIQUE,
  id_origen INTEGER NOT NULL REFERENCES destino(id_destino),
  id_destino INTEGER NOT NULL REFERENCES destino(id_destino),
  fecha_salida TIMESTAMP NOT NULL,
  fecha_llegada_estimada TIMESTAMP NOT NULL,
  capacidad_total INTEGER NOT NULL,
  asientos_disponibles INTEGER NOT NULL,
  precio_base NUMERIC(12, 2) NOT NULL,
  clase VARCHAR(20) NOT NULL DEFAULT 'economy',
  aerolinea VARCHAR(80) NOT NULL DEFAULT 'AEROTURS',
  estado VARCHAR(20) NOT NULL DEFAULT 'Programado',
  CONSTRAINT chk_vuelo_destinos CHECK (id_origen <> id_destino),
  CONSTRAINT chk_vuelo_capacidad CHECK (capacidad_total > 0),
  CONSTRAINT chk_vuelo_asientos CHECK (asientos_disponibles >= 0 AND asientos_disponibles <= capacidad_total),
  CONSTRAINT chk_vuelo_precio CHECK (precio_base >= 0),
  CONSTRAINT chk_vuelo_clase CHECK (clase IN ('economy', 'business', 'first')),
  CONSTRAINT chk_vuelo_estado CHECK (estado IN ('Programado', 'Abordando', 'En vuelo', 'Finalizado', 'Cancelado'))
);

CREATE TABLE reserva_estado (
  id_estado SERIAL PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE reserva (
  id_reserva SERIAL PRIMARY KEY,
  codigo_reserva VARCHAR(12) NOT NULL UNIQUE,
  id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
  id_vuelo INTEGER NOT NULL REFERENCES vuelo(id_vuelo),
  id_estado INTEGER NOT NULL REFERENCES reserva_estado(id_estado),
  fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valor_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cantidad_pasajeros INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT chk_reserva_valor CHECK (valor_total >= 0),
  CONSTRAINT chk_reserva_pasajeros CHECK (cantidad_pasajeros > 0)
);

CREATE TABLE reserva_estado_historial (
  id_historial SERIAL PRIMARY KEY,
  id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
  id_estado INTEGER NOT NULL REFERENCES reserva_estado(id_estado),
  fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacion VARCHAR(250)
);

CREATE TABLE pasajero (
  id_pasajero SERIAL PRIMARY KEY,
  id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  numero_documento VARCHAR(30) NOT NULL
);

CREATE TABLE asiento (
  id_asiento SERIAL PRIMARY KEY,
  id_vuelo INTEGER NOT NULL REFERENCES vuelo(id_vuelo) ON DELETE CASCADE,
  numero_asiento VARCHAR(5) NOT NULL,
  clase VARCHAR(20) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Disponible',
  CONSTRAINT uq_asiento_vuelo UNIQUE (id_vuelo, numero_asiento),
  CONSTRAINT chk_asiento_clase CHECK (clase IN ('economy', 'business', 'first')),
  CONSTRAINT chk_asiento_estado CHECK (estado IN ('Disponible', 'Reservado', 'Ocupado', 'Bloqueado'))
);

CREATE TABLE tiquete (
  id_tiquete SERIAL PRIMARY KEY,
  id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
  id_pasajero INTEGER NOT NULL REFERENCES pasajero(id_pasajero) ON DELETE CASCADE,
  id_asiento INTEGER REFERENCES asiento(id_asiento),
  codigo_tiquete VARCHAR(16) NOT NULL UNIQUE,
  precio NUMERIC(12, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Emitido',
  fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_tiquete_precio CHECK (precio >= 0),
  CONSTRAINT chk_tiquete_estado CHECK (estado IN ('Emitido', 'Cancelado', 'Usado'))
);

CREATE TABLE paquete_turistico (
  id_paquete SERIAL PRIMARY KEY,
  id_destino INTEGER NOT NULL REFERENCES destino(id_destino),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(30) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Disponible',
  CONSTRAINT chk_paquete_tipo CHECK (tipo IN ('Alojamiento', 'Transporte', 'Tour', 'Combinado')),
  CONSTRAINT chk_paquete_precio CHECK (precio >= 0),
  CONSTRAINT chk_paquete_estado CHECK (estado IN ('Disponible', 'No disponible'))
);

CREATE TABLE reserva_paquete (
  id_reserva_paquete SERIAL PRIMARY KEY,
  id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
  id_paquete INTEGER NOT NULL REFERENCES paquete_turistico(id_paquete),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(12, 2) NOT NULL,
  CONSTRAINT uq_reserva_paquete UNIQUE (id_reserva, id_paquete),
  CONSTRAINT chk_reserva_paquete_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_reserva_paquete_precio CHECK (precio_unitario >= 0)
);

CREATE TABLE pago (
  id_pago SERIAL PRIMARY KEY,
  id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
  metodo_pago VARCHAR(30) NOT NULL,
  valor_pagado NUMERIC(12, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
  referencia_pago VARCHAR(40) UNIQUE,
  fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_pago_metodo CHECK (metodo_pago IN ('Tarjeta', 'PSE', 'Transferencia', 'Efectivo')),
  CONSTRAINT chk_pago_valor CHECK (valor_pagado >= 0),
  CONSTRAINT chk_pago_estado CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado', 'Reembolsado'))
);

CREATE INDEX idx_usuario_correo ON usuario(correo);
CREATE INDEX idx_vuelo_ruta ON vuelo(id_origen, id_destino);
CREATE INDEX idx_vuelo_fecha_salida ON vuelo(fecha_salida);
CREATE INDEX idx_reserva_cliente ON reserva(id_cliente);
CREATE INDEX idx_reserva_codigo ON reserva(codigo_reserva);

INSERT INTO rol (nombre, descripcion) VALUES
  ('Super Administrador', 'Gestion integral del sistema'),
  ('Agente de Aerolinea', 'Gestion de reservas, pagos y asientos'),
  ('Cliente', 'Reserva vuelos y compra servicios turisticos');

INSERT INTO usuario (id_rol, correo, password, estado) VALUES
  (1, 'admin@aeroturs.com', 'admin123', 'Activo'),
  (2, 'agente@aeroturs.com', 'agente123', 'Activo'),
  (3, 'cliente@aeroturs.com', 'cliente123', 'Activo'),
  (3, 'empresa@aeroturs.com', 'empresa123', 'Activo');

INSERT INTO cliente (
  id_usuario,
  tipo_cuenta,
  tipo_documento,
  numero_documento,
  nombres,
  apellidos,
  direccion,
  ciudad,
  departamento,
  pais,
  telefono_principal,
  telefono_alternativo,
  fecha_nacimiento
) VALUES (
  3,
  'persona',
  'Cedula',
  '1000000001',
  'Cliente',
  'Demo',
  'Calle 100 # 15-20',
  'Bogota',
  'Cundinamarca',
  'Colombia',
  '+57 300 000 0000',
  '+57 601 000 0000',
  '1995-05-12'
), (
  4,
  'empresa',
  'NIT',
  '900000001',
  'Empresa',
  'Demo',
  'Avenida Empresa # 10-20',
  'Bogota',
  'Cundinamarca',
  'Colombia',
  '+57 601 111 1111',
  '+57 300 111 1111',
  '2000-01-01'
);

INSERT INTO destino (codigo, nombre, ciudad, pais) VALUES
  ('MAD', 'Madrid', 'Madrid', 'Espana'),
  ('BCN', 'Barcelona', 'Barcelona', 'Espana'),
  ('PAR', 'Paris', 'Paris', 'Francia'),
  ('LON', 'Londres', 'Londres', 'Reino Unido'),
  ('NYC', 'Nueva York', 'Nueva York', 'Estados Unidos'),
  ('TYO', 'Tokio', 'Tokio', 'Japon'),
  ('ROM', 'Roma', 'Roma', 'Italia'),
  ('BER', 'Berlin', 'Berlin', 'Alemania');

INSERT INTO vuelo (
  codigo_vuelo,
  id_origen,
  id_destino,
  fecha_salida,
  fecha_llegada_estimada,
  capacidad_total,
  asientos_disponibles,
  precio_base,
  clase
) VALUES
  ('AT101', 1, 2, '2026-06-10 08:00:00', '2026-06-10 09:30:00', 180, 42, 356000, 'economy'),
  ('AT202', 1, 2, '2026-06-10 12:00:00', '2026-06-10 13:30:00', 180, 28, 476000, 'economy'),
  ('AT303', 1, 2, '2026-06-10 18:00:00', '2026-06-10 19:30:00', 180, 15, 396000, 'economy'),
  ('AT401', 2, 3, '2026-06-11 09:00:00', '2026-06-11 11:00:00', 160, 35, 596000, 'economy'),
  ('AT501', 1, 4, '2026-06-12 07:30:00', '2026-06-12 09:00:00', 190, 50, 796000, 'economy'),
  ('AT601', 1, 5, '2026-06-13 14:00:00', '2026-06-13 17:30:00', 260, 120, 2396000, 'economy'),
  ('AT701', 1, 6, '2026-06-14 11:00:00', '2026-06-15 08:00:00', 300, 80, 3596000, 'economy'),
  ('AT801', 2, 1, '2026-06-15 10:00:00', '2026-06-15 11:30:00', 180, 22, 316000, 'economy');

INSERT INTO asiento (id_vuelo, numero_asiento, clase, estado)
SELECT
  v.id_vuelo,
  (((s.n - 1) / 6) + 1)::TEXT || SUBSTRING('ABCDEF' FROM ((s.n - 1) % 6) + 1 FOR 1),
  v.clase,
  CASE
    WHEN s.n <= (v.capacidad_total - v.asientos_disponibles) THEN 'Reservado'
    ELSE 'Disponible'
  END
FROM vuelo v
CROSS JOIN LATERAL generate_series(1, v.capacidad_total) AS s(n);

INSERT INTO reserva_estado (nombre) VALUES
  ('Reservada'),
  ('Confirmada'),
  ('Cancelada'),
  ('Expirada');

INSERT INTO paquete_turistico (id_destino, nombre, descripcion, tipo, precio, estado) VALUES
  (2, 'Barcelona Esencial', 'Hotel por dos noches y recorrido por la ciudad.', 'Combinado', 820000, 'Disponible'),
  (3, 'Paris Cultural', 'Tour guiado por puntos historicos y museos seleccionados.', 'Tour', 1190000, 'Disponible'),
  (5, 'Traslado NYC', 'Transporte aeropuerto-hotel-aeropuerto.', 'Transporte', 280000, 'Disponible'),
  (6, 'Tokio Completo', 'Alojamiento, transporte y actividades urbanas.', 'Combinado', 1890000, 'Disponible');

INSERT INTO reserva (
  codigo_reserva,
  id_cliente,
  id_vuelo,
  id_estado,
  valor_total,
  cantidad_pasajeros
) VALUES (
  'SADEMO01',
  1,
  1,
  2,
  356000,
  1
);

INSERT INTO reserva_estado_historial (id_reserva, id_estado, observacion) VALUES
  (1, 1, 'Reserva creada desde datos iniciales'),
  (1, 2, 'Pago confirmado desde datos iniciales');

INSERT INTO pasajero (
  id_reserva,
  nombres,
  apellidos,
  correo,
  telefono,
  fecha_nacimiento,
  numero_documento
) VALUES (
  1,
  'Cliente',
  'Demo',
  'cliente@aeroturs.com',
  '+57 300 000 0000',
  '1995-05-12',
  '1000000001'
);

UPDATE asiento
SET estado = 'Ocupado'
WHERE id_vuelo = 1 AND numero_asiento = '1A';

INSERT INTO tiquete (
  id_reserva,
  id_pasajero,
  id_asiento,
  codigo_tiquete,
  precio,
  estado
) VALUES (
  1,
  1,
  (SELECT id_asiento FROM asiento WHERE id_vuelo = 1 AND numero_asiento = '1A'),
  'TQSADEMO01',
  356000,
  'Emitido'
);

INSERT INTO pago (
  id_reserva,
  metodo_pago,
  valor_pagado,
  estado,
  referencia_pago
) VALUES (
  1,
  'Tarjeta',
  356000,
  'Aprobado',
  'PAY-SA-DEMO-01'
);
