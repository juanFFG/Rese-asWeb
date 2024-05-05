<template>
  <div>
    <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color= #A69988
        elevate-on-scroll
        flat
    >
      <v-container :class="{ 'px-0': !$vuetify.breakpoint.smAndUp }">
        <v-row
            :no-gutters="!$vuetify.breakpoint.smAndUp"
            align="center"
        >
          <v-col class="d-flex align-center justify-start">
            <!-- ... -->
          </v-col>

          <v-col v-if="$vuetify.breakpoint.mdAndUp" class="d-flex">
            <div class="d-flex flex-grow-1 justify-center align-center">
              <v-btn
                  v-for="(item, i) in barItems"
                  :key="i"
                  :to="item.to"
                  class="text-capitalize text-center"
                  exact
                  exact-active-class="accent--text"
                  text
                  v-if="!$root.user || item.title !== 'Iniciar Sesión' && item.title !== 'Registrarse'"
              >{{ item.title }}
              </v-btn>
              <v-menu offset-y v-if="$root.user">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">
                    {{ $root.user.username }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="logout">
                    <v-list-item-title>Cerrar sesión</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import axios from 'axios'; // Importa axios

export default {
  data: () => ({
    drawer: null,
    barItems: [
      {
        title: "Home",
        to: "/",
      },
      {
        title: "Reseñas",
        to: "/category",
      },
      {
        title: "Mis reseñas",
        to: "/detail",
      },
      {
        title: "Authors",
        to: "/authors",
      },
      {
        title: "Iniciar Sesión",
        to: "/login",
      },
      {
        title: "Registrarse",
        to: "/register",
      }
    ],
    btnItems: [
      // Elementos.
    ],
  }),
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
        console.log('token:', token); // Agrega esta línea
        if (token) {
          const response = await axios.post('http://localhost:3002/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            this.$root.user = null; // Limpia el usuario de la instancia principal de Vue
            localStorage.removeItem('user'); // Elimina el usuario del almacenamiento local
            this.$router.push('/login'); // Redirige al usuario a la página de inicio de sesión
          } else {
            // Maneja cualquier error que pueda ocurrir durante el cierre de sesión
            console.error('Error al cerrar la sesión:', response);
          }
        } else {
          console.error('No se encontró el token de usuario');
        }
      } catch (error) {
        console.error('Error al cerrar la sesión:', error);
      }
    }
  },
  created() {
    console.log(this.$root.user); // Agrega esta línea
  }
};
</script>

<style scoped>
</style>
