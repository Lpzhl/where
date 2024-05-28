// src/api/manger.js
import axios from 'axios';


const API_URL = 'http://localhost:8089/hotel';


// 酒店id获取酒店名字
export const getHotelNameById = async (hotelId) => {
    try {
        const response = await axios.get(`${API_URL}/getHotelNameById`, { params: { hotelId } });
        if (response) {
            console.log('酒店名字获取成功', response.data);
            return response.data.data;
        }
    } catch (e) {
        console.error("酒店名字获取失败", e);
    }
}



// 根据先是根据用户id获取酒店的id，再根据酒店id获取订单信息getOrdersByHotelId
export const getHotelIdByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/getHotelIdAndBookingsByUserId`, { params: { userId } });
        if (response) {
            console.log('成功', response.data);
            return response.data;
        }
    } catch (e) {
        console.error("失败", e);
    }
}

// 房间图片删除
export const deleteRoomImage = async (imageId) =>{
    try {
        const response = await axios.post(`${API_URL}/deleteRoomImage`,null,{
            params:{ imageId }
        });
        if(response){
            console.log('图片删除成功',response.data)
            return response.data
        }
    }catch (e){
        console.log("图片删除失败",e)
    }

}



// 酒店房间信息
export const getRoomById = async (hotelId) => {
    console.log(hotelId)
    try {
        const response = await axios.get(`${API_URL}/getRoomInfo`, {
            params: { hotelId }
        });
        if (response) {
            console.log('房间信息获取成功', response);
            return response.data;
        } else {
            console.error('获取房间信息失败', e);
        }
    } catch (e) {
        console.error('获取房间信息失败', e);

        throw e;
    }
};

// 删除酒店房间
export const deleteRoom = async (roomId) => {
    try {
        console.log(roomId)
        const response = await axios.post(`${API_URL}/deleteRoom`, null, {
            params: { roomId }
        });
        console.log('酒店房间删除成功', response);
        return response.data;
    } catch (e) {
        console.error('删除酒店房间失败', e);
        throw e;
    }

};

// 添加房间照片
export const updateRoom = async (room) => {
    try {
        const response = await axios.post(`${API_URL}/updateRoom`, room);
        console.log('酒店房间添加', response);
        return response.data;
    } catch (e) {
        throw e;
    }
}

// 添加酒店房间
export const addRoom = async (room) => {
    try {
        const response = await axios.post(`${API_URL}/addRoom`, room);
        console.log('酒店房间添加', response);
        return response.data;
    } catch (e) {
        throw e;
    }
}


// 删除酒店照片
export const removeHotelImage = async (imageId, hotelId) => {
    try {
        const response = await axios.post(`${API_URL}/deleteImage`, null, {
            params: { imageId, hotelId }
        });
        console.log('删除照片响应:', response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// 删除酒店
export const removeHotel = async (hotelId) => {
    console.log('下架酒店',hotelId)
    try {
        const response = await axios.post(`${API_URL}/delete`, null, {
            params: { hotelId }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 获取指定 ownerId 的所有酒店信息
export const getHotelsByOwnerId = async (ownerId) => {
    try {
        const response = await axios.get(`${API_URL}/getHotels`, {
            params: { ownerId }
        });
        return response.data;
    } catch (error) {
        console.error('获取酒店信息失败:', error);
        throw error;
    }
};

// 添加酒店的方法
export const addHotel = async (hotelData) => {
    console.log('6666',hotelData)
    try {
        const response = await axios.post(`${API_URL}/addHotel`, {
            ...hotelData,
        });
        return response.data;
    } catch (error) {
        console.error('添加酒店请求失败:', error);
        throw error;
    }
};

