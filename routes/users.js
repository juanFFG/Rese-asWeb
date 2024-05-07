// users.js

const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const DataTypes = require('sequelize').DataTypes;
const User = require('../models/User')(sequelize, DataTypes);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
  }

  const token = jwt.sign({ id: user.id }, 'tu_clave_secreta');

  res.json({ token, user });
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, institutionalmail } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const user = await User.create({ username, password, institutionalmail });

    const newUser = await User.findOne({ where: { id: user.id } });

    const token = jwt.sign({ id: newUser.id }, 'tu_clave_secreta');

    res.json({ token, newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
