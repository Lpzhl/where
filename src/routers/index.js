// routers/index.js

import { createRouter, createWebHashHistory,createWebHistory} from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import FindPassword from '../views/FindPassword.vue'
import Hote from '../components/Menu/Hote.vue'
import AirTicket from '../components/Menu/AirTicket.vue'
import TrainTicket  from '../components/Menu/TrainTicket.vue'
import Messages from '../components/Menu/Messages.vue'
import AboutUs from "../components/Menu/AboutUs.vue";

import Treasure from "../components/Menu/Treasure.vue";
import Test from "../components/Test.txt";
import FlightBooking from "../components/Menu/FlightBooking/FlightBooking.vue"
import Index from "../views/index.vue";
import Hotedetails from "../components/hote/hotedetails.vue";
import HotelBooking from "../components/hote/HotelBooking.vue";
import HotelOrder from "../components/order/index.vue";
import order from "../components/hote/hotelOrders.vue";
import Hotel from "../components/order/hotelOreder.vue";
import AirOrder from "../components/order/airOrder.vue";
import HelloWorld from "../components/HelloWorld.vue";
import hotel from "../components/manger/hotel.vue";
import testweb from "../components/test/testwebsocket.vue"
import charts from "../components/echats/AllCharts.vue"
import hotelcharts from "../components/echats/hotelcharts.vue"

const router = createRouter({
    history: createWebHashHistory(),
    //mode: 'hash',
    routes: [
        { path: '/index', name: 'index',component: Index,
            children: [

            ]},
        {
            path: '/hotel-details',
            name: 'HotelDetails',
            component: Hotedetails,
            props: true
        },
        {
            path: '/hotel-booking',
            name: '图表统计',
            component: () => import('../components/echats/AllCharts.vue')
        },
        { path: '/', component:Main },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/find-password', component: FindPassword },
        {
            path: '/Hote',
            component:Hote
        },
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
        { path: '/Treasure', component: Treasure },

        {
            path: '/booking-hotel',
            name: 'HotelBooking',
            component: HotelBooking
        },
        {
          path: '/order',
          name:  'HotelOrder',
          component: HotelOrder,
            children: [
                {
                    path: 'hotel-order',
                    name: 'Ho',
                    component: Hotel
                },
                {
                    path: 'air-order',
                    name: 'airOrder',
                    component: AirOrder
                },
                {
                    path: 'myInfo',
                    name: 'myInfo',
                    component: () => import("../components/my/MyInfo.vue")
                },
                {
                    path: '/userManger',
                    name: 'userManger',
                    component: ()=>import("../components/my/UserManger.vue")
                },
                {
                    path: '/orderManger',
                    name: 'orderManger',
                    component: () =>  import("../components/my/orderManger.vue")
                },
                {
                    path: '/hotelManger',
                    name: 'hotelManger',
                    component: () => import("../components/manger/HotelManagement.vue")
                },
                {
                    path: '/allorderEchats',
                    name: 'allorderEchats',
                    component: () => import("../components/echats/AllCharts.vue")
                },
                {
                    path: '/hotelRoomManger',
                    name: 'hotelRoomManger',
                    component:()=>import("../components/manger/HotelRoomManger.vue")
                },
                {
                    path: '/hotelcharts',
                    name: 'hotelcharts',
                    component: () => import("../components/echats/HotelCharts.vue")
                },
                {
                    path:'/hotelRoomDet',
                    name:'hotelRoomDet',
                    component:()=>import("../components/manger/HotelRoomTypeManger.vue")
                },
                {
                    path:'/hotelBook',
                    name:'hotelBook',
                    component:()=>import("../components/manger/HotelBookingManger.vue")
                },
                {
                    path: '/shengq',
                    name:'shengq',
                    component:()=>import("../components/hote/shengqing.vue")
                },
                {
                    path: '/MangeShen',
                    name:'MangeShen',
                    component:()=>import("../components/manger/MangerShenq.vue")
                }

            ]
        },
        {
            path: '/orders',
            name: 'order',
            component: order,
        },
        {
            path: '/hotelOrder-det',
            name:'Orderdet',
            component: () => import("../components/order/OrderDetails.vue"),
            children:[

            ]
        },
        {
            path: '/OrderReview',
            name:'OrderReview',
            component: () => import("../components/order/OrderRewiv.vue")
        },
        { path: '/payment-success', component:()=>import("../components/order/PaymentSuccess.vue")
        },
        {
            path: '/hello',
            name: 'hello',
            component:()=>import("../components/HelloWorld.vue")
        },
        {
            path:'/chat',
            name:'Chat',
            component:()=>import("../components/manger/Chat.vue")
        },
        {
            path:'/MessageList',
            name:'MessageList',
            component:()=>import("../components/TestMessageList.vue")
        },
        {
            path:'/ChatIndex',
            name:'ChatIndex',
            component:()=>import("../components/Chat/ChatIndex.vue"),
            children:[
            ]
        },
        {
            path:'/MessageIndex',
            name:'MessageIndex',
            component:()=>import("../components/Chat/MessageList.vue"),
            children:[
                {
                    path: '/ChatBox',
                    name:'ChatBox',
                    component: ()=>import("../components/Chat/ChatBox.vue")
                }
            ]
        },
        {
            path: '/mangerOrder-det',
            name:'mangerOrderdet',
            component: () => import("../components/manger/MangerOrderDetail.vue"),
            children:[

            ]
        },
        {
            path:'/flightOrder',
            name:'flightOrder',
            component:() => import("../components/Menu/FlightBooking/FlightOrder.vue")
        },
        {
            path:'/sumOrder',
            name:'sumOrder',
            component:()=>import("../components/Menu/FlightBooking/SumOrder.vue")
        },
        {
            path:'/airBookingDetail',
            name:'airBookingDetail',
            component:()=>import("../components/Menu/FlightBooking/AirOrderDetails.vue")
        }
    ]
})

export default router

