// src/main.js

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = false

function getUserFromLocalStorage() {
  const userString = localStorage.getItem('user');
  try {
    return JSON.parse(userString);
  } catch (error) {
    return null;
  }
}

new Vue({
  vuetify,
  router,
  data: {
    user: getUserFromLocalStorage() // Asegúrate de que estás manejando correctamente este proceso
  },
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log(router.app.$root.user); // Agrega esta línea
  next();
});
