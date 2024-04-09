<template>
  <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
    <v-col cols="12" md="6">
      <v-card class="py-6">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4">
            Registro
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="username"
              label="Username"
              outlined
              required
          ></v-text-field>
          <v-text-field
              v-model="email"
              label="Email"
              type="email"
              outlined
              required
          ></v-text-field>
          <v-text-field
              v-model="password"
              label="Password"
              type="password"
              outlined
              required
          ></v-text-field>
          <div class="text-right">
            <v-btn color="primary" @click="register">
              Registrarse
            </v-btn>
          </div>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p> <!-- Muestra el mensaje de error -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '', // Agrega una propiedad para el mensaje de error
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://192.168.56.1:3000/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if (response.data.msg === 'Registro exitoso. Se ha enviado un correo electrónico de verificación.') {
          localStorage.setItem('email', this.email); // Almacena el correo electrónico en el almacenamiento local
          this.$router.push('/verify'); // redirige al usuario a la página de verificación
        } else {
          this.errorMessage = response.data.msg; // Muestra el mensaje de error
        }
      } catch (error) {
        if (error.response && error.response.data.msg === 'El usuario ya existe') {
          this.errorMessage = 'El correo electrónico ya está en uso. Por favor, intenta con un correo electrónico diferente.';
        } else {
          console.error('Error de registro:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
.error-text {
  color: red;
}
</style>
