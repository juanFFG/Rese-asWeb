<template>
  <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
    <v-col cols="12" md="6">
      <v-card class="py-6">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4">
            Login
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="email"
              label="Email"
              outlined
          ></v-text-field>
          <v-text-field v-model="password"
              label="Password"
              outlined
          ></v-text-field>
          <div class="text-right">
            <v-btn color="primary" @click="login">
              Login
            </v-btn>
          </div>
          <div class="error-text">{{ errorMessage }}</div> <!-- Mostrar mensaje de error -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import EventBus from '../event-bus.js'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // Agrega una propiedad para el mensaje de error
    };
  },
  methods: {
    async login() {
      try {
        //http://192.168.56.1:4001/api/users/login
        const response = await axios.post('http://localhost:4001/api/users/login', {
          email: this.email,
          password: this.password,
        });
        if (response && response.data) {
          this.$root.user = response.data.usuario;
          localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
          localStorage.setItem('token', response.data.token);
          EventBus.$emit('logged-in', { sesionIniciada: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          this.$router.push('/Home');
        } else {
          this.errorMessage = response.data.msg;
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.msg : 'Error del servidor'; // Establecer mensaje de error
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
