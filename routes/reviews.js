const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const DataTypes = require('sequelize').DataTypes;
const Review = require('../models/Review')(sequelize, DataTypes);

router.get('/', async (req, res) => {
  const reviews = await Review.findAll({ where: { active: true } });
  res.json(reviews);
});

router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const reviews = await Review.findAll({ where: { user_id, active: true } });
  res.json(reviews);
});

router.post('/', async (req, res) => {
  console.log(req.body); // Esto imprimirá el cuerpo de la solicitud en la consola
  const { user_id, username, title, date, description } = req.body;
  const newReview = await Review.create({ user_id, username, title, date, description });
  res.json(newReview);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Review.update({ active: false }, { where: { id } });
  res.json({ message: 'Reseña marcada como inactiva' });
});

module.exports = router;
