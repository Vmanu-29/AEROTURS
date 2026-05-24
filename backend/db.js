import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;
const useRemote = Boolean(connectionString);

const poolConfig = useRemote
  ? {
      connectionString,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      } : false,
    }
  : {
      user: process.env.DB_USER || process.env.PGUSER || 'postgres',
      host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
      database: process.env.DB_NAME || process.env.PGDATABASE || 'aerolinea',
      port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
    };

const pool = new Pool(poolConfig);

pool.connect()
  .then((client) => {
    client.release();
    console.log('Conectado a PostgreSQL correctamente');
    if (useRemote) {
      console.log('Usando conexión remota a la base de datos.');
    }
  })
  .catch((error) => {
    console.error('Error conectando a PostgreSQL:', error);
  });

export default pool;
