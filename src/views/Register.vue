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
          <form @submit.prevent="register">
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
                :rules="[rules.required, rules.password]"
                class="hover-effect"
                style="margin-bottom: 20px"
            ></v-text-field>
            <div class="text-right">
              <v-btn color="primary" type="submit" class="hover-effect">
                Register
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
      institutionalmail: '',
      password: '',
      errorMessage: '',
      rules: {
        required: value => !!value || 'Este campo es requerido.',
        email: value => /.+@.+\..+/.test(value) || 'Debe ser un correo válido.',
        noSpecialChars: value => /^[a-zA-Z0-9]+$/.test(value) || 'No se permiten caracteres especiales.',
        password: value => {
          if (value.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
          }
          if (!/[0-9]/.test(value)) {
            return 'La contraseña debe contener al menos un número.';
          }
          if (!/[a-zA-Z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra.';
          }
          return true;
        },
      }
    };
  },
  methods: {
    async register() {
      if (!this.username || !this.institutionalmail || !this.password) {
        this.errorMessage = 'Necesitas rellenar los campos necesarios.';
        return;
      }

      try {
        const { username, institutionalmail, password } = this;

        const response = await axios.post('http://localhost:3002/users/register', {
          username,
          institutionalmail,
          password
        });

        // Imprime la respuesta del servidor
        console.log('Respuesta del servidor:', response.data);

        if (response && response.data && response.data.token && response.data.newUser) {
        this.$root.user = response.data.newUser; // Almacena el usuario en $root.user
        localStorage.setItem('user', JSON.stringify(response.data.newUser)); // Guarda los detalles del usuario en el almacenamiento local
        localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
        this.$router.push('/');
      } else {
        this.errorMessage = 'Error desconocido';
      }

      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          // Maneja diferentes tipos de errores de manera diferente
          switch (error.response.data.message) {
            case 'El nombre de usuario ya está en uso':
              this.errorMessage = 'El nombre de usuario que has elegido ya está en uso. Por favor, elige otro.';
              break;
            default:
              this.errorMessage = 'Ocurrió un error al intentar registrarte. Por favor, inténtalo de nuevo más tarde.';
              break;
          }
        } else {
          this.errorMessage = 'Error desconocido';
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
