// src/api/hotel.js
import axios from 'axios';

/*const API_URL = 'http://121.41.107.127:8088/hotel';*/
const API_URL = 'http://121.41.107.127:8088/hotel';

export const getAllBookings = (userId, hotelId) => {
    return axios.get(`${API_URL}/hhbookings`, {
        params: { userId, hotelId }
    });
}

// 获取评论

// 删除订单
export const deleteOrder1 = (bookingId) => {
    return axios.delete(`${API_URL}/deleteOrder`, { params: { bookingId } });
};


// 获取指定用户的订单信息
export const getUserOrders = (userId) => {
    return axios.get(`${API_URL}/getUserOrders`, { params: { userId } });
};

//取消订单
export const offOrder = async (bookingId) => {
    try {
        const response = await axios.post(`${API_URL}/handleOffBooking?bookingId=${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('处理订单过期错误:', error);
        throw error;
    }
};

// 处理过期订单
export const handleExpiredBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${API_URL}/handleExpiredBooking?bookingId=${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('处理订单过期错误:', error);
        throw error;
    }
};



// 通过订单id获取订单信息和剩余时间
export const fetchOrderInfo = async (bookingId) => {
    try {
        const response = await axios.get(`${API_URL}/getOrderInfo`, {params: {bookingId}});
        return response.data;
    } catch (error) {
        console.error('获取订单信息错误:', error);
        throw error;
    }
}

// 通过酒店id获取酒店信息
export const fetchHotel = async (hotelId) => {
    try {
        const response = await axios.get(`${API_URL}/hotelId`, { params: { hotelId } });
        return response.data;
    } catch (error) {
        console.error('错误:', error);
        throw error;
    }
}

// 获取联系人
export const fetchContactPeople6 = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/contacts`, { params: { userId } });
        console.log('获取联系人行行行',response.data)
        return response.data;

    } catch (error) {
        console.error('获取联系人列表失败:', error);
        throw error;
    }
};

export const searchHotels = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/search`, formData);
        console.log('搜索结果:', response.data.data);
        return response;
    } catch (error) {

    }
}

export const submitBookingRequest = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/book`, bookingData);
        console.log('订单提交结果:', response.data);
        return response;
    } catch (error) {
        console.error('订单提交出错:', error);
    }
}

export const getHotelById = async (hotelId) => {
    try {
        const response = await axios.post(`${API_URL}/update`, null, { params: { hotelId } });
        console.log('酒店信息:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('查询酒店信息出错:', error);
    }
}
