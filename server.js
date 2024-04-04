const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('./models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

app.use(cors({
  origin: ['http://192.168.56.1:3000', 'http://192.168.87.1:3000', 'http://192.168.116.1:3000', 'http://192.168.142.1:3000', 'http://localhost:3000/register']
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true, useUnifiedTopology: true});

app.post('/register',
  [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'Por favor incluye un correo electrónico válido').isEmail(),
    check('password', 'Por favor ingresa una contraseña con 6 o más caracteres').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'El usuario ya existe' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationCode = crypto.randomBytes(3).toString('hex');

      user = new User({
        username,
        email,
        password: hashedPassword,
        verificationCode: verificationCode,
        isVerified: false
      });

      await user.save();

      let transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
          user: 'upblaureles@outlook.com',
          pass: '231131eqwe12123'
        }
      });

      let mailOptions = {
        from: 'upblaureles@outlook.com',
        to: user.email,
        subject: 'Verificación de correo electrónico',
        text: `Tu código de verificación es: ${verificationCode}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Correo enviado: ' + info.response);
          res.json({ msg: 'Registro exitoso. Se ha enviado un correo electrónico de verificación.' });
        }
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Error del servidor' });
    }
  }
);

app.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'El usuario ya ha sido verificado' });
    }

    if (user.verificationCode === undefined) {
      return res.status(400).json({ msg: 'Código de verificación no definido' });
    }

    if (code !== user.verificationCode) {
      return res.status(400).json({ msg: 'Código de verificación incorrecto' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;

    await user.save();

    res.json({ msg: 'Cuenta verificada con éxito' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('El servidor está escuchando en todas las direcciones IP en el puerto 3000');
});
