// main.js

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './routers/index.js';

import axios from 'axios'; // 导入axios
import './assets/css/common.css'
import './assets/css/index.css'
import './assets/font/iconfont.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue';


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)

import zhCn from 'element-plus/es/locale/lang/zh-cn';


import { getToken } from './utils/token-utils';


axios.interceptors.request.use((config) => {
    const token = getToken();
    console.log('添加请求头：token',token)
    if (token) {
        config.headers['Authorization'] = `${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


axios.interceptors.response.use(response => {
    console.log('拦截器', response);
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // 当状态码为 401 时，重定向到登录页面
        window.location = "http://localhost:5173/#/login";

    }
    return Promise.reject(error);
});



app.use(ElementPlus, {
    locale: zhCn, // 设置为中文
});

const pinia = createPinia();
app.use(pinia)
app.use(router)

app.config.globalProperties.$axios = axios; // 将axios设置为Vue全局属性

app.mount('#app')
