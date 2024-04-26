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
          <v-text-field
              label="Email"
              outlined
              v-model="email"
              class="hover-effect"
              style="margin-bottom: 20px"
          ></v-text-field>
          <v-text-field
              label="Password"
              type="password"
              outlined
              v-model="password"
              class="hover-effect"
              style="margin-bottom: 20px"
          ></v-text-field>
          <div class="text-right">
            <v-btn color="primary" @click="login" class="hover-effect">
              Login
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
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
  try {
    const response = await axios.post('http://192.168.56.1:3002/login', {
      email: this.email,
      password: this.password,
      errorMessage: this.errorMessage,
    });
    console.log(response);
    if (response.data.msg === 'Inicio de sesión exitoso') {
      this.$router.push('/'); // redirige al usuario a la página principal
    } else {
      this.errorMessage = response.data.msg; // Muestra el mensaje de error
    }
    console.log(response.data); // Muestra la respuesta del backend en la consola
  } catch (error) {
    // En caso de error de la solicitud HTTP, establecer errorMessage
    errorMessage = error.response.data.msg;
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
