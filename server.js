// server.js

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
const chalk = require('chalk');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
});

const User = require('./models/User')(sequelize, DataTypes);
const Review = require('./models/Review')(sequelize, DataTypes);
const Token = require('./models/Token')(sequelize, DataTypes);

User.hasMany(Token, { foreignKey: 'user_id' });
Token.belongsTo(User, { foreignKey: 'user_id' });

const usersRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');

app.use(bodyParser.json());

app.use((req, res, next) => {
  const date = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${chalk.blue(date)}] ${chalk.green(method)} a ${chalk.yellow(url)}`);
  
  next();
});

sequelize.sync()
  .then(async () => {
    console.log(chalk.green('Base de datos y tablas creadas'));
    
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    console.log(chalk.blue('Tablas creadas:'), chalk.yellow(tableNames.join(', ')));
  })
  .catch(err => console.error(chalk.red('Error al sincronizar la base de datos:', err)));

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

app.use('/users', usersRoutes);
app.use('/reviews', reviewsRoutes);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ where: { username } });
  
  if (!user) {
    return res.status(400).send({ message: 'Usuario o contraseña incorrecta' });
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(400).send({ message: 'Usuario o contraseña incorrecta' });
  }
  
  // Si todo está bien, procede con el inicio de sesión...
});

app.get('/', (req, res) => {
  res.send('Funcionamiento servidor.');
});

app.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    await Token.invalidate(token); 
    res.send('Cierre de sesión exitoso.');
  } catch (error) {
    console.error('Error al cerrar la sesión:', error);
    res.status(500).send('Ocurrió un error al cerrar la sesión.');
  }
});

app.use(expressJwt({ secret: 'tu_clave_secreta', algorithms: ['HS256'] }).unless({ path: ['/login', '/register', '/logout'] }));

app.listen(port, () => {
  console.log(chalk.green(`El servidor está corriendo en http://localhost:${port}`));
});
