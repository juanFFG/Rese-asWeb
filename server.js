require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Joi = require('joi');

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} a ${req.url}`);
  next();
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa. Fecha y hora actuales:', res.rows[0].now);
  }
});

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'La política de CORS para este sitio no permite el acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true
}));

pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        institutionalmail VARCHAR(100) UNIQUE NOT NULL
    )
`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Tabla users creada con éxito');
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        description TEXT NOT NULL
    )
`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Tabla reviews creada con éxito');
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token VARCHAR(255) NOT NULL,
        expiry TIMESTAMP NOT NULL
    )
`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Tabla tokens creada con éxito');
    }
});

app.get('/', (req, res) => {
  res.send('Funcionamiento servidor.');
});

app.use(expressJwt({ secret: 'tu_clave_secreta', algorithms: ['HS256'] }).unless({ path: ['/login', '/register'] }));

app.get('/my-reviews', async (req, res) => {
  const user_id = req.user.id;

  const { rows } = await pool.query('SELECT * FROM reviews WHERE user_id = $1', [user_id]);

  res.status(200).json(rows);
});

app.post('/reviews', async (req, res) => {
  const { title, date, description } = req.body;
  const user_id = req.user.id;

  const result = await pool.query('INSERT INTO reviews (user_id, title, date, description) VALUES ($1, $2, $3, $4)', [user_id, title, date, description]);

  res.status(200).json({ msg: 'Review created successfully' });
});

app.put('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const { title, date, description } = req.body;

  const result = await pool.query('UPDATE reviews SET title = $1, date = $2, description = $3 WHERE id = $4 AND user_id = $5', [title, date, description, reviewId, userId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ msg: 'Reseña no encontrada o no tienes permiso para editarla' });
  }

  res.status(200).json({ msg: 'Reseña actualizada con éxito' });
});

app.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  const result = await pool.query('UPDATE reviews SET status = $1 WHERE id = $2 AND user_id = $3', ['deleted', reviewId, userId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ msg: 'Reseña no encontrada o no tienes permiso para eliminarla' });
  }

  res.status(200).json({ msg: 'Reseña eliminada con éxito' });
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Nombre de usuario o contraseña incorrectos' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, 'tu_clave_secreta');

    res.json({ token, user: user.rows[0] });

  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, institutionalmail, password } = req.body;

    if (!username || !institutionalmail || !password) {
      return res.status(400).json({ msg: 'Por favor, proporciona todos los campos' });
    }
    if (!/.+@.+\..+/.test(institutionalmail)) {
      return res.status(400).json({ msg: 'Por favor, proporciona un correo válido' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({ msg: 'El nombre de usuario no debe contener caracteres especiales' });
    }

    const user = await pool.query('SELECT * FROM users WHERE username = $1 OR institutionalmail = $2', [username, institutionalmail]);
    if (user.rows.length > 0) {
      return res.status(400).json({ msg: 'El nombre de usuario o el correo electrónico ya están en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO users (username, institutionalmail, password) VALUES ($1, $2, $3) RETURNING *', [username, institutionalmail, hashedPassword]);

    const token = jwt.sign({ id: result.rows[0].id }, 'tu_clave_secreta');

    res.status(200).json({ msg: 'Registro exitoso', token, user: { username, institutionalmail } });

  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

app.post('/logout', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  await pool.query('DELETE FROM tokens WHERE token = $1', [token]);
  res.status(200).json({ msg: 'Cierre de sesión exitoso' });
});

app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  }

  res.status(200).json(result.rows[0]);
});

app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, institutionalmail, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query('UPDATE users SET username = $1, institutionalmail = $2, password = $3 WHERE id = $4', [username, institutionalmail, hashedPassword, userId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  }

  res.status(200).json({ msg: 'Usuario actualizado con éxito' });
});

app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;

  const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ msg: 'Usuario no encontrado' });
  }

  res.status(200).json({ msg: 'Usuario eliminado con éxito' });
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
