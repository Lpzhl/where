// routers/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Main from '../备份/views/Main.vue'
import Login from '../备份/views/Login.vue'
import Register from '../备份/views/Register.vue'
import FindPassword from '../备份/views/FindPassword.vue'
import Hote from '../components/Menu/Hote.vue'
import AirTicket from '../components/Menu/AirTicket.vue'
import TrainTicket  from '../components/Menu/TrainTicket.vue'
import Messages from '../components/Menu/Messages.vue'
import AboutUs from "../components/Menu/AboutUs.vue";
import Treasure from "../components/Menu/Treasure.vue";
import Test from "../components/Test.vue";
import FlightBooking from "../components/Menu/FlightBooking/FlightBooking.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component:Main },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/find-password', component: FindPassword },
        { path: '/Hote', component:Hote },
        { path: '/TrainTicket', component:TrainTicket },
        {
            path: '/AirTicket',
            component: AirTicket,
/*            children: [
                {
                    path: '/flight-booking',
                    name: 'FlightBooking',
                    component: FlightBooking,
                }],*/
        },
/*        {
            path: '/AirTicket/FlightBooking',
            name: 'FlightBooking',
            component: FlightBooking,
        },*/
        {
            path: '/FlightBooking',
            name: 'FlightBooking',
            component: FlightBooking,
        },
        { path: '/Messages', component:Messages },
        { path: '/AboutUs', component: AboutUs },
        { path: '/Treasure', component: Test },
    ]
})

export default router

