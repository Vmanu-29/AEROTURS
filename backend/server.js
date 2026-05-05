const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aerolinea',
  password: '1234',
  port: 5432,
});

app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM usuario WHERE correo=$1 AND password=$2',
    [correo, password]
  );

  if(result.rows.length > 0){
    res.json({ success:true, user:result.rows[0] });
  }else{
    res.json({ success:false });
  }
});

app.listen(3000, ()=>{
  console.log('Backend corriendo en http://localhost:3000');
});