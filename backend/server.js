import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const useRemote = Boolean(process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'AEROTURS backend activo' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: useRemote ? 'remote' : 'local' });
});

app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      `SELECT
        u.*,
        COALESCE(c.tipo_cuenta, 'persona') AS tipo_cuenta,
        TRIM(CONCAT(COALESCE(c.nombres, ''), ' ', COALESCE(c.apellidos, ''))) AS nombre
       FROM usuario u
       LEFT JOIN cliente c ON c.id_usuario = u.id_usuario
       WHERE u.correo=$1 AND u.password=$2`,
      [correo, password]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    }

    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.post('/register', async (req, res) => {
  const {
    correo,
    password,
    tipo_cuenta = 'persona',
    tipo_documento,
    numero_documento,
    nombres,
    apellidos,
    ciudad,
    pais,
    telefono_principal,
    fecha_nacimiento,
  } = req.body;

  if (!correo || !password || !tipo_documento || !numero_documento || !nombres || !apellidos || !ciudad || !pais || !telefono_principal) {
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para el registro' });
  }

  try {
    const existingUser = await pool.query('SELECT id_usuario FROM usuario WHERE correo = $1', [correo]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    const existingClient = await pool.query('SELECT id_cliente FROM cliente WHERE numero_documento = $1', [numero_documento]);
    if (existingClient.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'El número de documento ya está registrado' });
    }

    const roleResult = await pool.query('SELECT id_rol FROM rol WHERE nombre = $1', ['Cliente']);
    if (roleResult.rows.length === 0) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    const id_rol = roleResult.rows[0].id_rol;
    const userResult = await pool.query(
      'INSERT INTO usuario (id_rol, correo, password, estado) VALUES ($1, $2, $3, $4) RETURNING id_usuario',
      [id_rol, correo, password, 'Activo']
    );

    const id_usuario = userResult.rows[0].id_usuario;
    await pool.query(
      `INSERT INTO cliente (
        id_usuario, tipo_cuenta, tipo_documento, numero_documento, nombres, apellidos,
        ciudad, pais, telefono_principal, fecha_nacimiento
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id_usuario,
        tipo_cuenta,
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        ciudad,
        pais,
        telefono_principal,
        fecha_nacimiento,
      ]
    );

    return res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
