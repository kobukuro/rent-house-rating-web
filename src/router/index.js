import Login from '../components/pages/Login.vue';
// import HomePage from "@/components/HomePage";
import Layout from "@/components/layouts/Layout";
import VueRouter from 'vue-router'

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'Login',
            path: '/login',
            component: Login
        },
        {
            name: 'Index',
            path: '/',
            component: Layout
        }]
});



