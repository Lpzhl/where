// src/api/chat.js
import axios from 'axios';
import { useUserStore } from '../stores/userStore';

const API_URL = 'http://121.41.107.127:8088/chat';

// 获取指定用户的所有聊天信息
export const getChatMessagesByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/getChatMessagesByUserId`, {
            params: { userId: userId }
        });
        console.log('聊天记录结果',response.data)
        return response.data;
    } catch (error) {
        console.error('获取聊天信息失败:', error);
        throw error;
    }
};
export const sendChatMessage = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/sendChatMessage`, message, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('发送失败:', error);
        throw error;
    }
};


// 酒店id获取酒店名字
export const getHotelById = async (hotelId) => {
    console.log(hotelId)
    try {
        const response = await axios.get(`http://121.41.107.127:8088/hotel/getHotelById`, { params: { hotelId } });
        if (response) {
            console.log('酒店获取成功', response.data);
            return response.data;
        }
    } catch (e) {
        console.error("酒店获取失败", e);
    }
}

