// src/api/review.js
import axios from 'axios';

const API_URL = 'http://121.41.107.127:8088/review';

/**
 * 回复
 * @param reply
 * @returns {Promise<any|null>}
 */
// 修改 fetchReply 以接受 reviewId 和 content
export const fetchReply = async (reviewId, content,userId,hotelId) => {
    try {
        const response = await axios.post(`${API_URL}/saveReply`, {
            parentReviewId: reviewId,
            comment: content,
            userId: userId,
            hotelId:hotelId

        });
        console.log('回复评论', response.data);
        return response.data;
    } catch (e) {
        console.error('回复失败', e);
        return null;
    }
}




// 获取酒店评论
export const fetchReviews = async (hotelId) => {
    try {
        const response = await axios.get(`${API_URL}/getByHotelId?hotelId=${hotelId}`);
        console.log('获取的数据:', response.data.data)
        return response.data
        // 在这里处理你的数据
    } catch (error) {
        console.error('请求错误:', error);
    }
}
