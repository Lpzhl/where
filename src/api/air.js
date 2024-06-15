// src/api/air.js
import axios from 'axios';

const API_URL = 'http://localhost:8088/air';

//取消订单
export const cancelOrde = async (bookingId) => {
    console.log(bookingId);
    try {
        const response = await axios.post(`${API_URL}/cancelAirBooking?bookingId=${bookingId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("取消订单错误:", error);
        throw new Error(".");
    }
};

// 根据航班id获取信息
export const getb = async (flghtId,bookingId) =>{
    console.log(flghtId)
    console.log(bookingId)
    try {
        const re = await axios.get(`${API_URL}/get`,{params:{flightId:flghtId ,bookingId:bookingId}})
        return re.data.data
        console.log('嘻嘻嘻',re)
    }catch (e){
        throw e
    }
}

// 获取指定用户的机票信息
export const  getAirBookingListsById = async (userId) =>{
    console.log(userId)
    try {
        const re = await axios.get(`${API_URL}/getAirBookingList`,{params:{ userId }})
        return re.data;
    }catch (e){
        throw e
    }
}

// 通过id获取机票订单信息
export const getAirBookingById = async (bookingId) =>{
    try {
        const res = await axios.get(`${API_URL}/getAirBookingById`, { params: { bookingId} })
        return res.data
    }catch (e){
        throw e
    }
}

// 预定机票
export const bookingAir = async (formData) => {
    console.log('机票表单信息', formData);
    try {
        return await axios.post(`${API_URL}/bookingAir`, formData);
    } catch (error) {
        console.error('预定机票失败:', error);
        throw error;
    }
};


// 搜索机票
export const searchAir = async (requestData) => {
    console.log('机票', requestData);
    try {
        const response = await axios.post(`${API_URL}/searchAir`, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (e) {
        console.log('错误', e);
        throw e;
    }
};
