import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Verify from '../views/Verify.vue' // Importa el componente Verify

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home
    },
    {
        path: '/reseñas',
        name: 'Reseñas',
        component: () => import("@/views/Reseñas.vue"),
    },
    {
        path: '/misresenas',
        name: 'MisReseñas',
        component: () => import("@/views/MisReseñas.vue"),
    },
    {
        path: '/comentarios/:id',
        name: 'Comentarios',
        component: () => import("@/views/Comentarios.vue"),
        props: true
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/Login.vue"),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/verify',
        name: 'Verify',
        component: Verify
    },
    {
        path: '/logout',
        name: 'logout',
        beforeEnter(to, from, next) {
            localStorage.removeItem('usuario');
            next('/login');
        }
    }
]

const router = new VueRouter({
    routes,
    scrollBehavior() {
        document.getElementById('app').scrollIntoView();
    }
})

export default router
