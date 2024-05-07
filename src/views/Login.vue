<template>
  <v-row class="d-flex justify-center align-center fill-height" style="min-height: 100vh">
    <v-col cols="12" md="6">
      <v-card class="py-6 hover-effect">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4 hover-effect">
            Login
          </div>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="login">
            <v-text-field
                label="Nombre de usuario"
                outlined
                v-model="username"
                :rules="[rules.required]"
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
              <v-btn color="primary" type="submit" class="hover-effect">
                Login
              </v-btn>
            </div>
            <transition name="slide-fade">
              <div v-if="errorMessage" class="error-message">
                <v-icon>mdi-close-circle</v-icon>
                {{ errorMessage }}
              </div>
            </transition>
          </form>
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
      password: '',
      errorMessage: '',
      rules: {
        required: value => !!value || 'Este campo es requerido.',
      },
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.errorMessage = 'Necesitas rellenar los campos necesarios';
        return;
      }

      try {
        const response = await axios.post('http://localhost:3002/users/login', {
          username: this.username,
          password: this.password
        });
        if (response && response.data && response.data.token && response.data.user) {
          this.$root.user = response.data.user; // Almacena el usuario en $root.user
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Guarda los detalles del usuario en el almacenamiento local
          localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
          localStorage.setItem('user_id', response.data.user.id); // Guarda el ID del usuario en el almacenamiento local
          localStorage.setItem('username', response.data.user.username); // Guarda el nombre de usuario en el almacenamiento local
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          this.$router.push('/');
        } else {
          this.errorMessage = 'Error desconocido';
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          // Maneja diferentes tipos de errores de manera diferente
          switch (error.response.data.message) {
            case 'Usuario o contraseña incorrecta':
              this.errorMessage = 'El nombre de usuario o la contraseña que ingresaste son incorrectos. Por favor, inténtalo de nuevo.';
              break;
            default:
              this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
              break;
          }
        } else {
          this.errorMessage = 'Error desconocido';
        }
      }
    }
  }
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
