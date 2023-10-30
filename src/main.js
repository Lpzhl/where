// main.js

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './routers/index.js';
import axios from 'axios'; // 导入axios

const app = createApp(App)

app.use(ElementPlus)

const pinia = createPinia();
app.use(pinia)
app.use(router)

app.config.globalProperties.$axios = axios; // 将axios设置为Vue全局属性

app.mount('#app')
