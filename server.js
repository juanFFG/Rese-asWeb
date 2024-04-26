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
const Joi = require('joi');


app.use(bodyParser.json());

// Middleware para registrar las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} a ${req.url}`);
  next();
});

// Conexión base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
console.log(allowedOrigins);

app.use(cors({
  origin: function(origin, callback){
    // Permitir solicitudes sin 'origin' (como las de las aplicaciones móviles)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'La política de CORS para este sitio no permite el acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true
}));


const admin = {
  username: 'admin',
  password: 'Admin'
};

let reseñas = [
  {
    id: 1,
    titulo: 'Mi primera reseña',
    fecha: '2024-04-09',
    descripcion: 'Esta es una reseña de prueba.'
  }
];

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

app.get('/', (req, res) => {
  res.send('Funcionamiento servidor.');
});

app.get('/admin', (req, res) => {
  res.send(admin);
});

app.get('/reseñas', (req, res) => {
  res.send(reseñas);
});

app.post('/reseñas', (req, res) => {
  const nuevaReseña = req.body;
  nuevaReseña.id = reseñas.length + 1;
  reseñas.push(nuevaReseña);
  res.send(nuevaReseña);
});

//Inicio de sesión
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si las credenciales coinciden con los datos estáticos
    if (email !== 'prueba@gmail.com' || password !== '123456') {
      return res.status(400).json({ msg: 'Correo o contraseña incorrectos' });
    }

    // Si las credenciales son válidas, enviar un mensaje de éxito
    res.status(200).json({ msg: 'Inicio de sesión exitoso' });

  } catch(err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
