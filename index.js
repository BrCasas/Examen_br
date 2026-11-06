import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

app.get('/api/usuarios', async (_req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Falta configurar DATABASE_URL en el entorno.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, email FROM usuarios ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ error: 'No se pudieron cargar los usuarios.' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';

  if (
    !nombre ||
    !email ||
    nombre.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({ error: 'Ingresa un nombre y un correo válidos.' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Falta configurar DATABASE_URL en el entorno.' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email',
      [nombre, email]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return res.status(500).json({ error: 'No se pudo guardar el usuario.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada.' });
});

app.use((error, _req, res, _next) => {
  console.error('Error inesperado en la API:', error);
  res.status(500).json({ error: 'Ocurrió un error inesperado.' });
});

export default app;
