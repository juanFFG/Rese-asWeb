// models/User.js

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    institutionalmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  }, {});

  User.addHook('beforeCreate', async (user, options) => {
    const salt = await bcrypt.genSalt();
    console.log(`Salt: ${salt}`); // Imprime el salt generado

    user.password = await bcrypt.hash(user.password, salt);
    console.log(`Password encriptada: ${user.password}`); // Imprime la contraseña encriptada

    // También puedes imprimir el objeto de usuario completo para verificar todos los campos
    console.log(`Usuario: ${JSON.stringify(user, null, 2)}`);
  });

  User.associate = models => {
    User.hasMany(models.Token, { foreignKey: 'user_id' });
  };

  return User;
};
