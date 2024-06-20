// src/api/login.js
import axios from 'axios';
import { useUserStore } from '../stores/userStore';

const API_URL = 'http://121.41.107.127:8088/user';


// 更新订单信息


export const getAllOrders = async() => {
    return axios.get(`${API_URL}/getAllOrders`);
}
