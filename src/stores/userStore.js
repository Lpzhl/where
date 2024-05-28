// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || null, // 从本地存储初始化6
        token: localStorage.getItem('vue_admin_template_token') || null
    }),
    actions: {
        setUser(userInfo) {
            this.userInfo = userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo)); // 更新本地存储6
        },
        setToken(token) {
            this.token = token;
            localStorage.setItem('vue_admin_template_token', token); // 更新本地存储6
        },
        clearUser() {
            this.userInfo = null;
            this.token = null;
            localStorage.removeItem('userInfo'); // 清除本地存储6
            localStorage.removeItem('vue_admin_template_token');
        }
    }
});
