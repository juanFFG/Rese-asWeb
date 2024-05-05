import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  data: {
    user: localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
  },
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log(router.app.$root.user); // Agrega esta línea
  next();
});
