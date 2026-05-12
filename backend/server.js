import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const dbPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD;

const poolConfig = {
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'aerolinea',
  port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
};

if (dbPassword) {
  poolConfig.password = dbPassword;
}

const pool = new Pool(poolConfig);

pool.connect()
  .then((client) => {
    client.release();
    console.log('Conectado a PostgreSQL correctamente');
  })
  .catch((error) => {
    console.error('Error conectando a PostgreSQL:', error);
  });

app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

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

  if(result.rows.length > 0){
    res.json({ success:true, user:result.rows[0] });
  }else{
    res.json({ success:false });
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
    fecha_nacimiento
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id_usuario FROM usuario WHERE correo = $1',
      [correo]
    );

    if (existingUser.rows.length > 0) {
      return res.json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el documento ya existe
    const existingClient = await pool.query(
      'SELECT id_cliente FROM cliente WHERE numero_documento = $1',
      [numero_documento]
    );

    if (existingClient.rows.length > 0) {
      return res.json({ success: false, message: 'El número de documento ya está registrado' });
    }

    // Obtener el ID del rol de cliente
    const roleResult = await pool.query(
      'SELECT id_rol FROM rol WHERE nombre = $1',
      ['Cliente']
    );

    if (roleResult.rows.length === 0) {
      return res.json({ success: false, message: 'Error interno del servidor' });
    }

    const id_rol = roleResult.rows[0].id_rol;

    // Crear el usuario
    const userResult = await pool.query(
      'INSERT INTO usuario (id_rol, correo, password, estado) VALUES ($1, $2, $3, $4) RETURNING id_usuario',
      [id_rol, correo, password, 'Activo']
    );

    const id_usuario = userResult.rows[0].id_usuario;

    // Crear el cliente
    await pool.query(
      `INSERT INTO cliente (
        id_usuario, tipo_cuenta, tipo_documento, numero_documento, nombres, apellidos,
        ciudad, pais, telefono_principal, fecha_nacimiento
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id_usuario, tipo_cuenta, tipo_documento, numero_documento, nombres, apellidos,
        ciudad, pais, telefono_principal, fecha_nacimiento
      ]
    );

    res.json({ success: true, message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.json({ success: false, message: 'Error interno del servidor' });
  }
});

app.listen(3000, ()=>{
  console.log('Backend corriendo en http://localhost:3000');
});
