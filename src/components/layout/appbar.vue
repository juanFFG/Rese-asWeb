<template>
  <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color=#A69988 elevate-on-scroll flat>
    <v-container :class="{ 'px-0': !$vuetify.breakpoint.smAndUp }">
      <v-row :no-gutters="!$vuetify.breakpoint.smAndUp" align="center" justify="space-between">
        <v-col class="d-flex align-center">
          <v-app-bar-nav-icon v-if="!$vuetify.breakpoint.mdAndUp" @click.stop="drawer = !drawer" />
          <v-toolbar-title class="font-weight-bold text-h5 primary--text" style="cursor: pointer"
            @click="$router.push('/')">
            <v-icon color="primary" large>mdi-feather</v-icon>
            REVIEW
            <span class="accent--text">CENTRAL</span>
          </v-toolbar-title>
        </v-col>

        <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="7">
          <v-btn v-for="(item, i) in appBarContent" :key="i" :to="item.to" class="text-capitalize" exact
            exact-active-class="accent--text" text>{{ item.title }}
          </v-btn>
          <v-menu offset-y v-if="sesionIniciada">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">{{ $root.user.username }}</v-btn>
            </template>
            <v-list>
              <v-list-item @click="logout">
                <v-list-item-title>Cerrar sesión</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>

        <v-col v-if="$vuetify.breakpoint.mdAndUp" class="text-right">
          <v-btn v-for="(item, i) in btnItems" :key="i" :color="item.color" :href="item.href" :outlined="item.outlined"
            :target="item.target" :to="item.to" class="ml-3 text-capitalize">
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.text }}
          </v-btn>
        </v-col>
        <v-menu offset-y v-if=sesionIniciada>
          <i class="fa fa-user"></i>
          <v-list>
            <!--<v-list-item @click="logout">
                    <v-list-item-title>Cerrar sesión</v-list-item-title>
                  </v-list-item>-->

          </v-list>
        </v-menu>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>

import EventBus from '../../event-bus.js'
export default {
  data() {
    return {
      drawer: null,
      sesionIniciada: false,
      username: "",
      btnItems: [],
    }

  },
  computed: {
    appBarContent() {
      if (this.sesionIniciada) {
        return [
          {
            title: "Home",
            to: "/",
          },
          {
            title: "Reseñas",
            to: "/reseñas",
          },
          {
            title: "Mis reseñas",
            to: "/misresenas",
          },
          {
            title: "Authors",
            to: "/authors",
          },

        ];
      } else {
        return [
          {
            title: "Home",
            to: "/",
          },
          {
            title: "Reseñas",
            to: "/reseñas",
          },
          {
            title: "Mis reseñas",
            to: "/misresenas",
          },
          {
            title: "Authors",
            to: "/authors",
          },
          {
            title: 'Iniciar sesión',
            to: '/login',
          },
          {
            title: 'Registrarse',
            to: '/register',
          },
        ];
      }
    },
  },
  created() {
    EventBus.$on('logged-in', (data) => {
      this.sesionIniciada = data.sesionIniciada
    })
  },
  methods: {
    logout() {
      try {
        this.$root.user = null;
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        this.$router.push('/login');
        this.sesionIniciada = false;
      } catch (error) {
        console.error('Error al cerrar la sesión:', error);
      }
    },
  },


  mounted() {
    if (localStorage.getItem('usuario')) {
      this.sesionIniciada = true;
    }
  }
};
</script>