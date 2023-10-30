// routers/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import FindPassword from '../views/FindPassword.vue'
import Records from '../components/Records.vue'
import Favorites from '../components/Favorites.vue'
import Travel  from '../components/Travel.vue'
import Messages from  '../components/Messages.vue'
import AboutUs from "../components/AboutUs.vue";
import Treasure from "../components/Treasure.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/find-password', component: FindPassword },
        { path: '/Records', component:Records },
        { path: '/Travel', component:Travel },
        { path: '/Likes', component:Favorites },
        { path: '/Messages', component:Messages },
        { path: '/AboutUs', component: AboutUs },
        { path: '/Treasure', component: Treasure },
    ]
})

export default router

