<template>
  <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
    <v-col cols="12" md="6">
      <v-card class="py-6 hover-effect">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4 hover-effect">
            Register
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Nombre de usuario"
              outlined
              v-model="username"
              :rules="[rules.required, rules.noSpecialChars]"
              class="hover-effect"
              style="margin-bottom: 20px"
          ></v-text-field>
          <v-text-field
              label="Correo institucional"
              outlined
              v-model="institutionalmail"
              :rules="[rules.required, rules.email]"
              class="hover-effect"
              style="margin-bottom: 20px"
          ></v-text-field>
          <v-text-field
              label="Contraseña"
              type="password"
              outlined
              v-model="password"
              :rules="[rules.required]"
              class="hover-effect"
              style="margin-bottom: 20px"
          ></v-text-field>
          <div class="text-right">
            <v-btn color="primary" @click="register" class="hover-effect">
              Register
            </v-btn>
          </div>
          <transition name="slide-fade">
            <div v-if="errorMessage" class="error-message">
              <v-icon>mdi-close-circle</v-icon>
              {{ errorMessage }}
            </div>
          </transition>
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
      institutionalmail: '',
      password: '',
      errorMessage: '',
      rules: {
        required: value => !!value || 'Este campo es requerido.',
        email: value => /.+@.+\..+/.test(value) || 'Debe ser un correo válido.',
        noSpecialChars: value => /^[a-zA-Z0-9]+$/.test(value) || 'No se permiten caracteres especiales.'
      }
    };
  },
  methods: {
    async register() {
      try {
        const { username, institutionalmail, password } = this;

        const response = await axios.post('http://localhost:3002/register', {
          username,
          institutionalmail,
          password
        });

        if (response && response.data && response.data.msg === 'Registro exitoso') {
          // Guarda el token y el usuario en localStorage y en $root.user
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.$root.user = response.data.user;
          this.$router.push('/'); // Redirige al usuario a la página de inicio
        } else if (response && response.data && response.data.msg) {
          this.errorMessage = response.data.msg; // Muestra el mensaje de error
        } else {
          this.errorMessage = 'Error desconocido'; // Muestra un mensaje de error genérico
        }
      } catch (error) {
        console.error('Error al registrarse:', error);
        if (error.response && error.response.data && error.response.data.msg) {
          this.errorMessage = error.response.data.msg;
        } else {
          this.errorMessage = 'Error desconocido'; // Muestra un mensaje de error genérico
        }
      }
    }
  },
};
</script>

<style scoped>
.hover-effect {
  transition: transform 0.3s ease-in-out;
}

.hover-effect:hover {
  transform: scale(1.01);
}

.error-message {
  color: #ff7f7f;
  display: flex;
  align-items: center;
  gap: 10px;
}

.v-btn:hover {
  background-color: #f0f0f0;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
