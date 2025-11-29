import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Main from '../components/Main.vue';

const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Main', component: Main },
];

const router = createRouter({
    history: createWebHashHistory(),  // <<< ВАЖНО
    routes,
});

// navigation guard
router.beforeEach((to, from, next) => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt && to.name !== 'Login') {
        // если нет jwt и пытаемся на главную → редирект на login
        next({ name: 'Login' });
    } else if (jwt && to.name === 'Login') {
        // если есть jwt и пытаемся на login → редирект на main
        next({ name: 'Main' });
    } else {
        next();
    }
});

export default router;